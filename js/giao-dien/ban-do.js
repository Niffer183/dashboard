// ============================================
// 🌱 VIEW: BẢN ĐỒ MÔI TRƯỜNG ĐA CẤP (Leaflet)
// ============================================

import { FARM_PLOTS, FARM_CENTER } from '../../du-lieu/du-lieu-gis.js';

let mapInstance = null;
let geojsonLayer = null; // Lớp Tỉnh (Polygon)
let districtLayer = null; // Lớp Huyện (Marker)
let communeLayer = null; // Lớp Xã (Marker)
let plotLayer = null; // Lớp Lô/Thửa (Polygon)

let currentLevel = 'QUỐC GIA';
let activeProvinceId = null;
let activeDistrictId = null;

// Cấu hình mốc Zoom cho các cấp
const ZOOM_LEVELS = {
  PROVINCE: 8,
  DISTRICT: 11,
  COMMUNE: 14,
  PLOT: 15
};

// --- DATA ENGINE (HIERARCHICAL) ---
// Cây dữ liệu lưu cố định trong RAM
const HIERARCHY_DATA = {
  provinces: {},
  districts: {},
  communes: {}
};

// Seeded Random Generator đơn giản (để tọa độ cố định)
function seededRandom(seed) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

// Sinh ra cây dữ liệu cho 1 Tỉnh (Gồm Huyện, Xã)
function buildDataTreeForProvince(provinceName, centerLat, centerLng, seedBase) {
  const numDistricts = 4 + Math.floor(seededRandom(seedBase) * 3); // 4 - 6 Huyện
  const provinceId = provinceName;
  const districtIds = [];

  for (let i = 0; i < numDistricts; i++) {
    const dSeed = seedBase * 10 + i;
    const dLat = centerLat + (seededRandom(dSeed) - 0.5) * 0.8;
    const dLng = centerLng + (seededRandom(dSeed + 1) - 0.5) * 0.8;
    const dId = `${provinceId}_H${i}`;
    const dName = `Huyện số ${i + 1} (${provinceName})`;
    
    const numCommunes = 3 + Math.floor(seededRandom(dSeed + 2) * 4); // 3 - 6 Xã
    const communeIds = [];
    
    let totalTemp = 0, totalHum = 0, totalAqi = 0, totalRain = 0;

    for (let j = 0; j < numCommunes; j++) {
      const cSeed = dSeed * 100 + j;
      const cLat = dLat + (seededRandom(cSeed) - 0.5) * 0.2;
      const cLng = dLng + (seededRandom(cSeed + 1) - 0.5) * 0.2;
      const cId = `${dId}_X${j}`;
      const cName = `Xã số ${j + 1} (${dName.split('(')[0].trim()})`;

      // Sinh dữ liệu vi khí hậu cho Xã
      const temp = 22 + seededRandom(cSeed + 2) * 12; // 22 - 34
      const hum = 50 + seededRandom(cSeed + 3) * 40;
      const aqi = 20 + seededRandom(cSeed + 4) * 120;
      const rain = seededRandom(cSeed + 5) * 20;

      totalTemp += temp; totalHum += hum; totalAqi += aqi; totalRain += rain;

      HIERARCHY_DATA.communes[cId] = {
        id: cId, parentId: dId, name: cName, lat: cLat, lng: cLng,
        env: { temp, humidity: hum, aqi, rainfall: rain }
      };
      communeIds.push(cId);
    }

    // Tính trung bình cho Huyện từ các Xã
    HIERARCHY_DATA.districts[dId] = {
      id: dId, parentId: provinceId, name: dName, lat: dLat, lng: dLng,
      children: communeIds,
      env: {
        temp: totalTemp / numCommunes,
        humidity: totalHum / numCommunes,
        aqi: totalAqi / numCommunes,
        rainfall: totalRain / numCommunes
      }
    };
    districtIds.push(dId);
  }

  // Tính trung bình cho Tỉnh từ các Huyện
  let pTemp = 0, pHum = 0, pAqi = 0, pRain = 0;
  districtIds.forEach(id => {
    pTemp += HIERARCHY_DATA.districts[id].env.temp;
    pHum += HIERARCHY_DATA.districts[id].env.humidity;
    pAqi += HIERARCHY_DATA.districts[id].env.aqi;
    pRain += HIERARCHY_DATA.districts[id].env.rainfall;
  });

  HIERARCHY_DATA.provinces[provinceId] = {
    id: provinceId, name: provinceName, centerLat, centerLng,
    children: districtIds,
    env: {
      temp: pTemp / numDistricts,
      humidity: pHum / numDistricts,
      aqi: pAqi / numDistricts,
      rainfall: pRain / numDistricts
    }
  };
}

// --- HELPERS ---
function getColorByTemp(temp) {
  return temp > 35 ? '#d73027' : temp > 32 ? '#fc8d59' : temp > 28 ? '#fee090' : temp > 24 ? '#e0f3f8' : temp > 20 ? '#91bfdb' : '#4575b4';
}

function getAqiColor(aqi) {
  return aqi > 100 ? '#e74c3c' : (aqi > 50 ? '#f39c12' : '#2ecc71');
}

// --- MAIN INIT ---
export function initMapView(container) {
  window.appState.updateHeader('Quản lý Môi trường Nông nghiệp Toàn diện');
  window.appState.renderBreadcrumb([
    { label: 'Hệ thống', url: '#/overview' },
    { label: 'Bản đồ Môi trường', icon: '🗺️' }
  ]);

  container.innerHTML = '<div style="display: flex; height: calc(100vh - 130px); gap: 20px;">'
    + '<div id="leaflet-container" style="flex: 1; border-radius: var(--radius-lg); overflow: hidden; z-index: 1; box-shadow: var(--shadow-sm);"></div>'
    
    // Panel thông tin cực kỳ chi tiết
    + '<div id="env-panel" class="card" style="width: 350px; display: none; flex-direction: column; gap: 15px; position: relative; overflow-y: auto;">'
    + '  <div class="card-header" style="flex-direction: column; align-items: flex-start; gap: 5px; padding-bottom: 10px; border-bottom: 1px solid var(--border-subtle);">'
    + '    <div class="text-xs font-bold text-accent" id="panel-level">CẤP QUẢN LÝ</div>'
    + '    <h3 class="card-title text-primary" id="panel-title" style="font-size: 1.3rem; line-height: 1.2;">Việt Nam</h3>'
    + '  </div>'
    
    + '  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">'
    + '    <div class="env-mini-card" style="background: var(--bg-hover); padding: 10px;"><div class="env-mini-label text-xs">🌡 Nhiệt độ TB</div><div class="font-bold text-lg" id="panel-temp">--</div></div>'
    + '    <div class="env-mini-card" style="background: var(--bg-hover); padding: 10px;"><div class="env-mini-label text-xs">💨 Độ ẩm TB</div><div class="font-bold text-lg" id="panel-humidity">--</div></div>'
    + '    <div class="env-mini-card" style="background: var(--bg-hover); padding: 10px;"><div class="env-mini-label text-xs">🌫 AQI</div><div class="font-bold text-lg" id="panel-aqi">--</div></div>'
    + '    <div class="env-mini-card" style="background: var(--bg-hover); padding: 10px;"><div class="env-mini-label text-xs">🌧 Lượng mưa</div><div class="font-bold text-lg" id="panel-rain">--</div></div>'
    + '  </div>'
    
    // Extra info cho Thửa đất
    + '  <div id="plot-extra-info" style="display: none; gap: 10px; flex-direction: column; padding-top: 10px; border-top: 1px solid var(--border-subtle);">'
    + '    <div class="text-xs font-bold text-muted">CHỈ SỐ ĐẤT TỪ SENSOR IOT</div>'
    + '    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">'
    + '       <div class="env-mini-card" style="background: rgba(139,105,20,0.1); border: 1px solid rgba(139,105,20,0.2);"><div class="env-mini-label">Độ ẩm đất</div><div class="font-bold text-md" id="panel-soil-moisture">--</div></div>'
    + '       <div class="env-mini-card" style="background: rgba(139,105,20,0.1); border: 1px solid rgba(139,105,20,0.2);"><div class="env-mini-label">pH Đất</div><div class="font-bold text-md" id="panel-soil-ph">--</div></div>'
    + '    </div>'
    + '  </div>'

    // Danh sách khu vực trực thuộc (Sub-regions)
    + '  <div id="sub-regions-container" style="display: none; flex-direction: column; gap: 10px; margin-top: 5px;">'
    + '    <div class="text-xs font-bold text-muted">DANH SÁCH KHU VỰC TRỰC THUỘC</div>'
    + '    <div id="sub-regions-list" style="display: flex; flex-direction: column; gap: 8px;"></div>'
    + '  </div>'

    + '  <div id="btn-group-nav" style="margin-top: 15px; display: flex; gap: 10px; position: sticky; bottom: 0; background: var(--bg-card); padding-top: 10px;">'
    + '    <button class="chart-btn" id="btn-zoom-out" style="flex:1;">↑ Lên 1 cấp</button>'
    + '    <button class="back-btn" id="btn-reset-map" style="flex:1; justify-content: center;">Toàn quốc</button>'
    + '  </div>'
    + '</div>'
    + '</div>';

  setTimeout(initializeMap, 100);
}

function initializeMap() {
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }

  mapInstance = L.map('leaflet-container').setView([16.16667, 107.83333], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(mapInstance);

  districtLayer = L.layerGroup().addTo(mapInstance);
  communeLayer = L.layerGroup().addTo(mapInstance);
  plotLayer = L.layerGroup().addTo(mapInstance);

  // 1. CHỦ QUYỀN
  const islands = [
    { name: "Quần đảo Hoàng Sa (Việt Nam)", lat: 16.5, lng: 111.6, icon: '🇻🇳' },
    { name: "Quần đảo Trường Sa (Việt Nam)", lat: 10.0, lng: 114.0, icon: '🇻🇳' }
  ];
  islands.forEach(island => {
    L.marker([island.lat, island.lng], {
      icon: L.divIcon({
        className: 'island-marker',
        html: `<div style="background:rgba(255,255,255,0.9); padding:4px 8px; border-radius:4px; border:1px solid #d73027; font-weight:bold; font-size:12px; white-space:nowrap; box-shadow:0 2px 4px rgba(0,0,0,0.2); pointer-events:none;"><span style="margin-right:4px;">${island.icon}</span>${island.name}</div>`,
        iconSize: [200, 30]
      })
    }).addTo(mapInstance);
  });

  // 2. LOAD VÀ XÂY DỰNG DATA TREE
  fetch('https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces.json')
    .then(res => res.json())
    .then(data => {
      let seedCounter = 100;
      // Trích xuất center để build Tree
      data.features.forEach(f => {
        const name = f.properties.Ten || f.properties.Name;
        // Lấy tọa độ trung tâm xấp xỉ từ điểm đầu tiên của polygon
        const coords = f.geometry.coordinates[0][0]; 
        let centerLat = coords[1];
        let centerLng = coords[0];
        // Tính trung bình các điểm để ra center thực hơn
        if (f.geometry.coordinates[0].length > 10) {
           const mid = Math.floor(f.geometry.coordinates[0].length / 2);
           centerLat = (coords[1] + f.geometry.coordinates[0][mid][1]) / 2;
           centerLng = (coords[0] + f.geometry.coordinates[0][mid][0]) / 2;
        }

        buildDataTreeForProvince(name, centerLat, centerLng, seedCounter++);
      });

      // Tạo Polygon
      geojsonLayer = L.geoJSON(data, {
        style: function(feature) {
          const name = feature.properties.Ten || feature.properties.Name;
          const provinceData = HIERARCHY_DATA.provinces[name];
          if (!provinceData) return {};
          return {
            fillColor: getColorByTemp(provinceData.env.temp),
            weight: 1.5, opacity: 1, color: '#ffffff', fillOpacity: 0.6
          };
        },
        onEachFeature: function(feature, layer) {
          const name = feature.properties.Ten || feature.properties.Name;
          const pData = HIERARCHY_DATA.provinces[name];
          if (!pData) return;
          
          layer.bindTooltip(`<strong>${name}</strong><br/>🌡 ${pData.env.temp.toFixed(1)}°C`, { direction: 'auto' });

          layer.on({
            mouseover: function(e) {
              if (mapInstance.getZoom() < ZOOM_LEVELS.PROVINCE) {
                e.target.setStyle({ weight: 3, fillOpacity: 0.9 }); e.target.bringToFront();
              }
            },
            mouseout: function(e) { geojsonLayer.resetStyle(e.target); },
            click: function(e) {
              if (mapInstance.getZoom() < ZOOM_LEVELS.PROVINCE) {
                activeProvinceId = name;
                mapInstance.fitBounds(e.target.getBounds());
                updateDashboard(pData, 'CẤP TỈNH / THÀNH PHỐ', HIERARCHY_DATA.districts);
                renderDistrictsOnMap(pData);
              }
            }
          });
        }
      }).addTo(mapInstance);
    });

  // 3. TÍCH HỢP LỚP THỬA ĐẤT TỪ DU-LIEU-GIS.JS
  L.geoJSON(FARM_PLOTS, {
    style: { color: '#ffffff', weight: 2, fillColor: '#10b981', fillOpacity: 0.8 },
    onEachFeature: function(feature, layer) {
      const props = feature.properties;
      layer.on('click', function() {
        const mockEnv = { temp: 24.5, humidity: 82, aqi: 45, rainfall: 2.1 };
        updateDashboard({ name: `Thửa: ${props.name} (${props.crop})`, env: mockEnv }, 'CẤP LÔ / THỬA ĐẤT', null, true);
      });
      layer.bindTooltip(`Thửa: ${props.name} <br> Cây trồng: ${props.crop}`, { direction: 'top' });
    }
  }).addTo(plotLayer);

  // 4. ZOOM LISTENER ĐỂ CHUYỂN LAYER
  mapInstance.on('zoomend', function() {
    const zoom = mapInstance.getZoom();
    if (zoom < ZOOM_LEVELS.PROVINCE) {
      if (geojsonLayer) geojsonLayer.setStyle({ fillOpacity: 0.6, weight: 1.5 });
      districtLayer.clearLayers();
      communeLayer.clearLayers();
    } else if (zoom >= ZOOM_LEVELS.PROVINCE && zoom < ZOOM_LEVELS.DISTRICT) {
      if (geojsonLayer) geojsonLayer.setStyle({ fillOpacity: 0.1, weight: 1 });
      communeLayer.clearLayers();
    } else if (zoom >= ZOOM_LEVELS.DISTRICT && zoom < ZOOM_LEVELS.COMMUNE) {
      if (geojsonLayer) geojsonLayer.setStyle({ fillOpacity: 0, weight: 0 });
      districtLayer.clearLayers();
    } else if (zoom >= ZOOM_LEVELS.COMMUNE) {
      if (geojsonLayer) geojsonLayer.setStyle({ fillOpacity: 0, weight: 0 });
      districtLayer.clearLayers();
      communeLayer.clearLayers();
      if (!plotLayer.hasLayerRendered) {
        plotLayer.hasLayerRendered = true;
      }
    }
  });

  // NÚT ĐIỀU HƯỚNG
  document.getElementById('btn-reset-map').addEventListener('click', function() {
    mapInstance.setView([16.16667, 107.83333], 6);
    document.getElementById('env-panel').style.display = 'none';
  });

  document.getElementById('btn-zoom-out').addEventListener('click', function() {
    const zoom = mapInstance.getZoom();
    if (zoom > ZOOM_LEVELS.COMMUNE) {
      mapInstance.setZoom(ZOOM_LEVELS.DISTRICT);
      if (activeDistrictId) {
         const d = HIERARCHY_DATA.districts[activeDistrictId];
         updateDashboard(d, 'CẤP QUẬN / HUYỆN', HIERARCHY_DATA.communes);
      }
    } else if (zoom > ZOOM_LEVELS.DISTRICT) {
      mapInstance.setZoom(ZOOM_LEVELS.PROVINCE);
      if (activeProvinceId) {
         const p = HIERARCHY_DATA.provinces[activeProvinceId];
         updateDashboard(p, 'CẤP TỈNH / THÀNH PHỐ', HIERARCHY_DATA.districts);
      }
    } else {
      document.getElementById('btn-reset-map').click();
    }
  });
}

// --- RENDER LAYER HELPERS ---
function renderDistrictsOnMap(provinceData) {
  districtLayer.clearLayers();
  provinceData.children.forEach(dId => {
    const dData = HIERARCHY_DATA.districts[dId];
    const markerColor = getAqiColor(dData.env.aqi); // Huyện cảnh báo theo AQI
    
    const marker = L.circleMarker([dData.lat, dData.lng], {
      radius: 12, fillColor: markerColor, color: '#fff', weight: 2, fillOpacity: 0.9
    }).addTo(districtLayer);

    marker.bindTooltip(`<strong>${dData.name}</strong><br>Nhiệt độ: ${dData.env.temp.toFixed(1)}°C<br>AQI: ${dData.env.aqi.toFixed(0)}`, { direction: 'top' });
    
    marker.on('click', function() {
      activeDistrictId = dData.id;
      mapInstance.setView([dData.lat, dData.lng], ZOOM_LEVELS.DISTRICT + 1);
      updateDashboard(dData, 'CẤP QUẬN / HUYỆN', HIERARCHY_DATA.communes);
      renderCommunesOnMap(dData);
    });
  });
}

function renderCommunesOnMap(districtData) {
  communeLayer.clearLayers();
  districtData.children.forEach(cId => {
    const cData = HIERARCHY_DATA.communes[cId];
    const markerColor = getColorByTemp(cData.env.temp); // Xã theo nhiệt độ
    
    const marker = L.circleMarker([cData.lat, cData.lng], {
      radius: 8, fillColor: markerColor, color: '#fff', weight: 2, fillOpacity: 0.9
    }).addTo(communeLayer);

    marker.bindTooltip(`<strong>${cData.name}</strong><br>Trạm quan trắc cấp Xã`, { direction: 'top' });
    
    marker.on('click', function() {
      mapInstance.setView([cData.lat, cData.lng], ZOOM_LEVELS.COMMUNE + 1);
      updateDashboard(cData, 'CẤP XÃ / PHƯỜNG', null);
      
      // MẸO DEMO: Click Xã -> Dẫn về khu Thửa Đất Nông nghiệp
      setTimeout(() => {
        if (confirm("Đi tới khu vực Thửa Đất Nông Nghiệp chi tiết (Demo ở Lâm Đồng)?")) {
           mapInstance.setView([FARM_CENTER[1], FARM_CENTER[0]], ZOOM_LEVELS.PLOT + 1);
        }
      }, 500);
    });
  });
}

// --- DASHBOARD RENDERER ---
window.triggerMapRegionClick = function(lat, lng, levelType) {
  // Hàm này được gọi từ các dòng trong Sub-regions list
  // Để mô phỏng click trên map
  if (levelType === 'district') {
     mapInstance.setView([lat, lng], ZOOM_LEVELS.DISTRICT + 1);
  } else if (levelType === 'commune') {
     mapInstance.setView([lat, lng], ZOOM_LEVELS.COMMUNE + 1);
  }
};

function updateDashboard(nodeData, levelText, childStoreToLookup, isPlot = false) {
  document.getElementById('env-panel').style.display = 'flex';
  document.getElementById('panel-title').innerText = nodeData.name;
  document.getElementById('panel-level').innerText = levelText;
  
  document.getElementById('panel-temp').innerText = nodeData.env.temp.toFixed(1) + ' °C';
  document.getElementById('panel-humidity').innerText = nodeData.env.humidity.toFixed(0) + ' %';
  
  const aqiColor = getAqiColor(nodeData.env.aqi);
  document.getElementById('panel-aqi').innerHTML = `<span style="color:${aqiColor}; font-weight:bold;">${nodeData.env.aqi.toFixed(0)}</span>`;
  document.getElementById('panel-rain').innerText = nodeData.env.rainfall.toFixed(1) + ' mm';
  
  // Extra info (Chỉ cho thửa đất)
  const plotExtra = document.getElementById('plot-extra-info');
  if (isPlot) {
    plotExtra.style.display = 'flex';
    document.getElementById('panel-soil-moisture').innerText = (Math.random() * 20 + 40).toFixed(1) + ' %';
    document.getElementById('panel-soil-ph').innerText = (Math.random() * 1.5 + 5.5).toFixed(1);
  } else {
    plotExtra.style.display = 'none';
  }

  // Danh sách khu vực trực thuộc
  const subContainer = document.getElementById('sub-regions-container');
  const subList = document.getElementById('sub-regions-list');
  
  if (nodeData.children && nodeData.children.length > 0 && childStoreToLookup) {
    subContainer.style.display = 'flex';
    let html = '';
    nodeData.children.forEach(childId => {
       const child = childStoreToLookup[childId];
       // Phân biệt Huyện và Xã cho hàm trigger
       const lvlType = levelText.includes('TỈNH') ? 'district' : 'commune';
       html += `
         <div onclick="triggerMapRegionClick(${child.lat}, ${child.lng}, '${lvlType}')" 
              style="display:flex; justify-content:space-between; padding:8px 10px; background:var(--bg-input); border-radius:4px; cursor:pointer; border:1px solid transparent;"
              onmouseover="this.style.borderColor='var(--border-accent)'"
              onmouseout="this.style.borderColor='transparent'">
            <span style="font-weight:bold; font-size:13px; color:var(--text-primary);">${child.name}</span>
            <span style="font-size:13px; color:var(--text-secondary);">🌡 ${child.env.temp.toFixed(1)}°C</span>
         </div>
       `;
    });
    subList.innerHTML = html;
  } else {
    subContainer.style.display = 'none';
  }
}
