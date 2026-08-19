// ============================================
// 🌪️ VIEW: BẢN ĐỒ THỜI TIẾT — WINDY STYLE
// ============================================

import { generatePlotsForCoordinate } from '../../du-lieu/du-lieu-gis.js';
import { showModal, showToast } from '../thanh-phan/hop-thoai.js';
import {
  getWeatherCondition,
  getTemperatureColor,
  getRainfallColor,
  generateWindForProvince,
  generateHeatmapPoints,
  generateRainfallHeatmapPoints,
  generateForecast,
  TEMPERATURE_GRADIENT,
  RAINFALL_GRADIENT,
  WIND_GRADIENT
} from '../../du-lieu/du-lieu-thoi-tiet.js';

let mapInstance = null;
let geojsonLayer = null;
let districtLayer = null;
let communeLayer = null;
let plotLayer = null;
let heatLayer = null;
let tempMarkerLayer = null;
let windAnimationId = null;
let rainAnimationId = null;

let currentLevel = 'QUỐC GIA';
let activeProvinceId = null;
let activeDistrictId = null;
let activeWeatherLayer = 'temp'; // 'temp' | 'rain' | 'wind' | 'cloud'

const ZOOM_LEVELS = {
  PROVINCE: 8,
  DISTRICT: 11,
  COMMUNE: 14,
  PLOT: 15
};

// --- DATA ENGINE ---
const HIERARCHY_DATA = {
  provinces: {},
  districts: {},
  communes: {}
};

function seededRandom(seed) {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function buildDataTreeForProvince(provinceName, centerLat, centerLng, seedBase) {
  const numDistricts = 4 + Math.floor(seededRandom(seedBase) * 3);
  const provinceId = provinceName;
  const districtIds = [];

  for (let i = 0; i < numDistricts; i++) {
    const dSeed = seedBase * 10 + i;
    const dLat = centerLat + (seededRandom(dSeed) - 0.5) * 0.8;
    const dLng = centerLng + (seededRandom(dSeed + 1) - 0.5) * 0.8;
    const dId = `${provinceId}_H${i}`;
    const dName = `Huyện số ${i + 1} (${provinceName})`;

    const numCommunes = 3 + Math.floor(seededRandom(dSeed + 2) * 4);
    const communeIds = [];

    let totalTemp = 0, totalHum = 0, totalAqi = 0, totalRain = 0;

    for (let j = 0; j < numCommunes; j++) {
      const cSeed = dSeed * 100 + j;
      const cLat = dLat + (seededRandom(cSeed) - 0.5) * 0.2;
      const cLng = dLng + (seededRandom(cSeed + 1) - 0.5) * 0.2;
      const cId = `${dId}_X${j}`;
      const cName = `Xã số ${j + 1} (${dName.split('(')[0].trim()})`;

      const temp = 22 + seededRandom(cSeed + 2) * 12;
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
      temp: pTemp / districtIds.length,
      humidity: pHum / districtIds.length,
      aqi: pAqi / districtIds.length,
      rainfall: pRain / districtIds.length
    }
  };
}

// --- COLOR HELPERS ---
function getColorByTemp(temp) {
  return temp > 35 ? '#d73027' : temp > 32 ? '#fc8d59' : temp > 28 ? '#fee090' : temp > 24 ? '#e0f3f8' : temp > 20 ? '#91bfdb' : '#4575b4';
}

function getAqiColor(aqi) {
  return aqi > 100 ? '#e74c3c' : (aqi > 50 ? '#f39c12' : '#2ecc71');
}

function getProvinceWeatherFillColor(provinceData) {
  if (activeWeatherLayer === 'rain') {
    return getRainfallColor(provinceData.env.rainfall);
  }
  if (activeWeatherLayer === 'wind') {
    const wind = generateWindForProvince(provinceData.name.length * 7);
    const speed = wind.speed;
    if (speed > 30) return 'rgba(244,67,54,0.5)';
    if (speed > 20) return 'rgba(255,152,0,0.5)';
    if (speed > 10) return 'rgba(255,193,7,0.4)';
    return 'rgba(129,199,132,0.3)';
  }
  // Default: temperature
  return getTemperatureColor(provinceData.env.temp);
}

// =======================================
// MAIN INIT
// =======================================
export function initMapView(container) {
  window.appState.updateHeader('Bản đồ Thời tiết — Windy');
  window.appState.renderBreadcrumb([
    { label: 'Hệ thống', url: '#/overview' },
    { label: 'Bản đồ Thời tiết', icon: '🌪️' }
  ]);

  container.innerHTML = `
    <div style="display: flex; height: calc(100vh - 130px); gap: 20px;">
      <!-- Map Area -->
      <div class="weather-map-wrapper" style="flex: 1; border-radius: var(--radius-lg); overflow: hidden; position: relative; border: 1px solid var(--border-subtle); box-shadow: var(--shadow-sm);">
        <div id="leaflet-container" style="width: 100%; height: 100%;"></div>
        
        <!-- Nav buttons (top-left) -->
        <div class="weather-nav-buttons">
          <button class="weather-nav-btn" id="btn-zoom-out">↑ Lên 1 cấp</button>
          <button class="weather-nav-btn" id="btn-reset-map">🏠 Toàn quốc</button>
        </div>

        <!-- Wind Canvas -->
        <canvas class="wind-canvas-overlay" id="wind-canvas"></canvas>
        <!-- Rain Canvas -->
        <canvas class="rain-canvas-overlay" id="rain-canvas"></canvas>

        <!-- Bottom Control Bar -->
        <div class="weather-bottom-bar">
          <div class="weather-layer-tabs">
            <button class="weather-layer-btn active" data-layer="temp">
              <span class="btn-icon">🌡</span> Nhiệt độ
            </button>
            <button class="weather-layer-btn" data-layer="rain">
              <span class="btn-icon">🌧</span> Mưa
            </button>
            <button class="weather-layer-btn" data-layer="wind">
              <span class="btn-icon">💨</span> Gió
            </button>
          </div>
          <div class="weather-gradient-container">
            <div class="weather-gradient-bar" id="gradient-bar" style="background: ${TEMPERATURE_GRADIENT};"></div>
          </div>
          <div class="weather-gradient-labels" id="gradient-labels">
            <span class="weather-gradient-label">16°C</span>
            <span class="weather-gradient-label">20°C</span>
            <span class="weather-gradient-label">24°C</span>
            <span class="weather-gradient-label">28°C</span>
            <span class="weather-gradient-label">32°C</span>
            <span class="weather-gradient-label">36°C</span>
          </div>
        </div>
      </div>

      <!-- Weather Info Panel (Side) -->
      <div class="card weather-info-panel" id="weather-info-panel" style="width: 350px; display: none; flex-direction: column; padding: 0; overflow-y: auto;">
        <div class="weather-panel-header">
          <div class="weather-panel-header-info">
            <div class="weather-panel-level" id="wp-level">CẤP QUỐC GIA</div>
            <div class="weather-panel-title" id="wp-title">Việt Nam</div>
          </div>
          <button class="weather-panel-close" id="wp-close">✕</button>
        </div>
        <div class="weather-panel-hero" id="wp-hero">
          <div class="weather-hero-icon floating" id="wp-icon">🌤</div>
          <div>
            <div class="weather-hero-temp" id="wp-temp">--<span class="temp-unit">°C</span></div>
            <div class="weather-hero-condition" id="wp-condition">--</div>
          </div>
        </div>
        <div class="weather-panel-stats" id="wp-stats">
          <div class="weather-stat-item">
            <div class="weather-stat-label">💧 Độ ẩm</div>
            <div class="weather-stat-value" id="wp-humidity">--%</div>
          </div>
          <div class="weather-stat-item">
            <div class="weather-stat-label">🌧 Lượng mưa</div>
            <div class="weather-stat-value" id="wp-rain">-- mm</div>
          </div>
          <div class="weather-stat-item">
            <div class="weather-stat-label">🌫 AQI</div>
            <div class="weather-stat-value" id="wp-aqi">--</div>
          </div>
          <div class="weather-stat-item">
            <div class="weather-stat-label">💨 Gió</div>
            <div class="weather-stat-value" id="wp-wind">-- km/h</div>
          </div>
        </div>
        <div class="weather-panel-forecast" id="wp-forecast">
          <div class="weather-forecast-title">Dự báo 5 ngày</div>
        </div>
      </div>
    </div>
  `;

  setTimeout(initializeMap, 100);
}

// =======================================
// MAP INIT
// =======================================
function initializeMap() {
  if (mapInstance) {
    mapInstance.remove();
    mapInstance = null;
  }

  // Standard OpenStreetMap tiles
  mapInstance = L.map('leaflet-container', {
    zoomControl: false
  }).setView([16.16667, 107.83333], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
    maxZoom: 19
  }).addTo(mapInstance);

  // Add zoom control to top-left below nav buttons
  L.control.zoom({ position: 'bottomleft' }).addTo(mapInstance);

  districtLayer = L.layerGroup().addTo(mapInstance);
  communeLayer = L.layerGroup().addTo(mapInstance);
  plotLayer = L.layerGroup().addTo(mapInstance);
  tempMarkerLayer = L.layerGroup().addTo(mapInstance);

  // Sovereignty markers
  const islands = [
    { name: "Quần đảo Hoàng Sa (Việt Nam)", lat: 16.5, lng: 111.6, icon: '🇻🇳' },
    { name: "Quần đảo Trường Sa (Việt Nam)", lat: 10.0, lng: 114.0, icon: '🇻🇳' }
  ];
  islands.forEach(island => {
    L.marker([island.lat, island.lng], {
      icon: L.divIcon({
        className: 'island-marker',
        html: `<div style="background:var(--bg-card); padding:4px 10px; border-radius:8px; border:1px solid var(--border-default); font-weight:bold; font-size:11px; white-space:nowrap; box-shadow:var(--shadow-sm); pointer-events:none; color:var(--text-primary);"><span style="margin-right:4px;">${island.icon}</span>${island.name}</div>`,
        iconSize: [200, 30]
      })
    }).addTo(mapInstance);
  });

  // Load province data
  loadProvinceData();

  // Zoom listener
  mapInstance.on('zoomend', function () {
    const zoom = mapInstance.getZoom();
    if (zoom < ZOOM_LEVELS.PROVINCE) {
      if (geojsonLayer) geojsonLayer.setStyle(f => {
        const name = f.properties.Ten || f.properties.Name;
        const pData = HIERARCHY_DATA.provinces[name];
        if (!pData) return {};
        return {
          fillColor: getProvinceWeatherFillColor(pData),
          fillOpacity: 0.65,
          weight: 1.5,
          color: 'rgba(255,255,255,0.6)'
        };
      });
      districtLayer.clearLayers();
      communeLayer.clearLayers();
      // Show temp markers
      updateTempMarkers();
    } else if (zoom >= ZOOM_LEVELS.PROVINCE && zoom < ZOOM_LEVELS.DISTRICT) {
      if (geojsonLayer) geojsonLayer.setStyle({ fillOpacity: 0.15, weight: 0.5 });
      communeLayer.clearLayers();
      tempMarkerLayer.clearLayers();
    } else if (zoom >= ZOOM_LEVELS.DISTRICT && zoom < ZOOM_LEVELS.COMMUNE) {
      if (geojsonLayer) geojsonLayer.setStyle({ fillOpacity: 0, weight: 0 });
      districtLayer.clearLayers();
      tempMarkerLayer.clearLayers();
    } else if (zoom >= ZOOM_LEVELS.COMMUNE) {
      if (geojsonLayer) geojsonLayer.setStyle({ fillOpacity: 0, weight: 0 });
      districtLayer.clearLayers();
      communeLayer.clearLayers();
      tempMarkerLayer.clearLayers();
    }
    // Update canvas sizes
    resizeCanvases();
  });

  mapInstance.on('move', () => resizeCanvases());
  mapInstance.on('resize', () => resizeCanvases());

  // Event listeners
  setupEventListeners();
}

// =======================================
// EVENT LISTENERS
// =======================================
function setupEventListeners() {
  // Reset map
  document.getElementById('btn-reset-map').addEventListener('click', function () {
    mapInstance.setView([16.16667, 107.83333], 6);
    hideInfoPanel();
    updateTempMarkers();
  });

  // Zoom out
  document.getElementById('btn-zoom-out').addEventListener('click', function () {
    const zoom = mapInstance.getZoom();
    if (zoom > ZOOM_LEVELS.COMMUNE) {
      mapInstance.setZoom(ZOOM_LEVELS.DISTRICT);
      if (activeDistrictId) {
        const d = HIERARCHY_DATA.districts[activeDistrictId];
        showWeatherInfoPanel(d, 'CẤP QUẬN / HUYỆN');
      }
    } else if (zoom > ZOOM_LEVELS.DISTRICT) {
      mapInstance.setZoom(ZOOM_LEVELS.PROVINCE);
      if (activeProvinceId) {
        const p = HIERARCHY_DATA.provinces[activeProvinceId];
        showWeatherInfoPanel(p, 'CẤP TỈNH / THÀNH PHỐ');
      }
    } else {
      document.getElementById('btn-reset-map').click();
    }
  });

  // Close panel
  document.getElementById('wp-close').addEventListener('click', hideInfoPanel);

  // Layer tabs
  document.querySelectorAll('.weather-layer-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.weather-layer-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      activeWeatherLayer = this.dataset.layer;
      updateMapLayer();
    });
  });
}

// =======================================
// LAYER SWITCHING
// =======================================
function updateMapLayer() {
  const gradientBar = document.getElementById('gradient-bar');
  const gradientLabels = document.getElementById('gradient-labels');

  // Update gradient bar
  if (activeWeatherLayer === 'temp') {
    gradientBar.style.background = TEMPERATURE_GRADIENT;
    gradientLabels.innerHTML = ['16°C', '20°C', '24°C', '28°C', '32°C', '36°C']
      .map(l => `<span class="weather-gradient-label">${l}</span>`).join('');
  } else if (activeWeatherLayer === 'rain') {
    gradientBar.style.background = RAINFALL_GRADIENT;
    gradientLabels.innerHTML = ['0mm', '3mm', '6mm', '10mm', '15mm', '20mm']
      .map(l => `<span class="weather-gradient-label">${l}</span>`).join('');
  } else if (activeWeatherLayer === 'wind') {
    gradientBar.style.background = WIND_GRADIENT;
    gradientLabels.innerHTML = ['0', '10', '15', '20', '30', '40+ km/h']
      .map(l => `<span class="weather-gradient-label">${l}</span>`).join('');
  }

  // Update polygon colors
  if (geojsonLayer) {
    geojsonLayer.setStyle(function (feature) {
      const name = feature.properties.Ten || feature.properties.Name;
      const pData = HIERARCHY_DATA.provinces[name];
      if (!pData) return {};
      return {
        fillColor: getProvinceWeatherFillColor(pData),
        weight: 1.5,
        opacity: 1,
        color: 'rgba(255,255,255,0.3)',
        fillOpacity: 0.55
      };
    });
  }

  // Update heatmap
  if (heatLayer) {
    mapInstance.removeLayer(heatLayer);
    heatLayer = null;
  }

  if (activeWeatherLayer === 'temp') {
    const heatPoints = generateHeatmapPoints(HIERARCHY_DATA.provinces);
    heatLayer = L.heatLayer(heatPoints, {
      radius: 35,
      blur: 25,
      maxZoom: 8,
      max: 1.0,
      gradient: {
        0.0: '#2196F3',
        0.2: '#4CAF50',
        0.4: '#8BC34A',
        0.6: '#FFC107',
        0.8: '#FF9800',
        1.0: '#F44336'
      }
    }).addTo(mapInstance);
  } else if (activeWeatherLayer === 'rain') {
    const rainPoints = generateRainfallHeatmapPoints(HIERARCHY_DATA.provinces);
    heatLayer = L.heatLayer(rainPoints, {
      radius: 40,
      blur: 30,
      maxZoom: 8,
      max: 1.0,
      gradient: {
        0.0: 'rgba(200,200,200,0.05)',
        0.2: '#90CAF9',
        0.4: '#64B5F6',
        0.6: '#42A5F5',
        0.8: '#1E88E5',
        1.0: '#4A148C'
      }
    }).addTo(mapInstance);
  }

  // Update temp markers
  updateTempMarkers();

  // Wind & Rain animations
  stopAnimations();
  if (activeWeatherLayer === 'wind') {
    startWindAnimation();
  } else if (activeWeatherLayer === 'rain') {
    startRainAnimation();
  }
}

// =======================================
// TEMP MARKERS ON MAP
// =======================================
function updateTempMarkers() {
  tempMarkerLayer.clearLayers();
  if (mapInstance.getZoom() > ZOOM_LEVELS.PROVINCE) return;

  Object.values(HIERARCHY_DATA.provinces).forEach(province => {
    const weather = getWeatherCondition(province.env.temp, province.env.rainfall);
    const tempColor = getTemperatureColor(province.env.temp);

    let displayValue = '';
    if (activeWeatherLayer === 'temp') {
      displayValue = `${province.env.temp.toFixed(0)}°`;
    } else if (activeWeatherLayer === 'rain') {
      displayValue = `${province.env.rainfall.toFixed(0)}mm`;
    } else if (activeWeatherLayer === 'wind') {
      const wind = generateWindForProvince(province.name.length * 7);
      displayValue = `${wind.speed.toFixed(0)}km/h`;
    }

    const marker = L.marker([province.centerLat, province.centerLng], {
      icon: L.divIcon({
        className: '',
        html: `<div class="weather-temp-marker">
          <span class="temp-icon">${weather.icon}</span>
          <span class="temp-value" style="color:${activeWeatherLayer === 'temp' ? tempColor : 'var(--text-primary)'}">${displayValue}</span>
        </div>`,
        iconSize: [90, 30],
        iconAnchor: [45, 15]
      }),
      interactive: false
    }).addTo(tempMarkerLayer);
  });
}

// =======================================
// WIND PARTICLE ANIMATION
// =======================================
function startWindAnimation() {
  const canvas = document.getElementById('wind-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  resizeCanvases();

  const particles = [];
  const MAX_PARTICLES = 180;

  // Initialize particles
  for (let i = 0; i < MAX_PARTICLES; i++) {
    particles.push(createWindParticle(canvas));
  }

  function animateWind() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      // Draw trail
      ctx.beginPath();
      ctx.moveTo(p.x - p.dx * 6, p.y - p.dy * 6);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = `rgba(120, 200, 255, ${p.opacity * 0.6})`;
      ctx.lineWidth = p.size;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Draw head
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(160, 220, 255, ${p.opacity})`;
      ctx.fill();

      // Move
      p.x += p.dx;
      p.y += p.dy;
      p.life--;

      // Reset when off-screen or dead
      if (p.life <= 0 || p.x < -20 || p.x > canvas.width + 20 || p.y < -20 || p.y > canvas.height + 20) {
        Object.assign(p, createWindParticle(canvas));
      }
    });

    windAnimationId = requestAnimationFrame(animateWind);
  }

  animateWind();
}

function createWindParticle(canvas) {
  const angle = (Math.random() * 40 + 200) * (Math.PI / 180); // NE wind generally
  const speed = 1.5 + Math.random() * 3;
  return {
    x: Math.random() * (canvas.width + 100) - 50,
    y: Math.random() * (canvas.height + 100) - 50,
    dx: Math.cos(angle) * speed,
    dy: Math.sin(angle) * speed,
    size: 0.8 + Math.random() * 1.2,
    opacity: 0.15 + Math.random() * 0.4,
    life: 80 + Math.floor(Math.random() * 120)
  };
}

// =======================================
// RAIN ANIMATION
// =======================================
function startRainAnimation() {
  const canvas = document.getElementById('rain-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  resizeCanvases();

  const drops = [];
  const MAX_DROPS = 200;

  for (let i = 0; i < MAX_DROPS; i++) {
    drops.push(createRainDrop(canvas));
  }

  function animateRain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drops.forEach(d => {
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x - d.windOffset, d.y + d.length);
      ctx.strokeStyle = `rgba(100, 180, 255, ${d.opacity})`;
      ctx.lineWidth = d.width;
      ctx.lineCap = 'round';
      ctx.stroke();

      d.y += d.speed;
      d.x -= d.windOffset * 0.3;

      if (d.y > canvas.height) {
        // Splash effect
        ctx.beginPath();
        ctx.arc(d.x, canvas.height - 2, 2, 0, Math.PI, true);
        ctx.strokeStyle = `rgba(100, 180, 255, ${d.opacity * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        Object.assign(d, createRainDrop(canvas));
        d.y = -10 - Math.random() * 50;
      }
    });

    rainAnimationId = requestAnimationFrame(animateRain);
  }

  animateRain();
}

function createRainDrop(canvas) {
  return {
    x: Math.random() * canvas.width * 1.2,
    y: -10 - Math.random() * canvas.height,
    length: 10 + Math.random() * 18,
    speed: 6 + Math.random() * 10,
    width: 0.5 + Math.random() * 1.2,
    opacity: 0.1 + Math.random() * 0.35,
    windOffset: 1 + Math.random() * 2
  };
}

// =======================================
// CANVAS UTILITIES
// =======================================
function resizeCanvases() {
  const wrapper = document.querySelector('.weather-map-wrapper');
  if (!wrapper) return;
  ['wind-canvas', 'rain-canvas'].forEach(id => {
    const canvas = document.getElementById(id);
    if (canvas) {
      canvas.width = wrapper.clientWidth;
      canvas.height = wrapper.clientHeight;
    }
  });
}

function stopAnimations() {
  if (windAnimationId) {
    cancelAnimationFrame(windAnimationId);
    windAnimationId = null;
    const wc = document.getElementById('wind-canvas');
    if (wc) wc.getContext('2d').clearRect(0, 0, wc.width, wc.height);
  }
  if (rainAnimationId) {
    cancelAnimationFrame(rainAnimationId);
    rainAnimationId = null;
    const rc = document.getElementById('rain-canvas');
    if (rc) rc.getContext('2d').clearRect(0, 0, rc.width, rc.height);
  }
}

// =======================================
// LOAD PROVINCE DATA
// =======================================
function loadProvinceData() {
  fetch('./du-lieu/vn-provinces.json')
    .then(res => {
      if (!res.ok) throw new Error('Local file not found');
      return res.json();
    })
    .catch(() => {
      showToast('Đang tải dữ liệu bản đồ từ server...', 'info');
      return fetch('https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces.json')
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        });
    })
    .then(data => {
      processProvinceData(data);
    })
    .catch(err => {
      console.error('Không thể tải dữ liệu bản đồ:', err);
      showToast('Không thể tải dữ liệu bản đồ tỉnh/thành. Kiểm tra kết nối mạng.', 'error', 5000);
    });
}

function processProvinceData(data) {
  let seedCounter = 100;
  data.features.forEach(f => {
    const name = f.properties.Ten || f.properties.Name;
    const coords = f.geometry.coordinates[0][0];
    let centerLat = coords[1];
    let centerLng = coords[0];
    if (f.geometry.coordinates[0].length > 10) {
      const mid = Math.floor(f.geometry.coordinates[0].length / 2);
      centerLat = (coords[1] + f.geometry.coordinates[0][mid][1]) / 2;
      centerLng = (coords[0] + f.geometry.coordinates[0][mid][0]) / 2;
    }
    buildDataTreeForProvince(name, centerLat, centerLng, seedCounter++);
  });

  // Province polygons with weather coloring
  geojsonLayer = L.geoJSON(data, {
    style: function (feature) {
      const name = feature.properties.Ten || feature.properties.Name;
      const pData = HIERARCHY_DATA.provinces[name];
      if (!pData) return {};
      return {
        fillColor: getProvinceWeatherFillColor(pData),
        weight: 1.5,
        opacity: 1,
        color: 'rgba(255,255,255,0.3)',
        fillOpacity: 0.55
      };
    },
    onEachFeature: function (feature, layer) {
      const name = feature.properties.Ten || feature.properties.Name;
      const pData = HIERARCHY_DATA.provinces[name];
      if (!pData) return;

      const weather = getWeatherCondition(pData.env.temp, pData.env.rainfall);
      const wind = generateWindForProvince(name.length * 7);

      // Windy-style tooltip
      layer.bindTooltip(`
        <div class="weather-tooltip-title">${name}</div>
        <div class="weather-tooltip-row"><span class="tt-icon">${weather.icon}</span> ${weather.label}</div>
        <div class="weather-tooltip-row"><span class="tt-icon">🌡</span> ${pData.env.temp.toFixed(1)}°C</div>
        <div class="weather-tooltip-row"><span class="tt-icon">🌧</span> ${pData.env.rainfall.toFixed(1)} mm</div>
        <div class="weather-tooltip-row"><span class="tt-icon">💨</span> ${wind.speed.toFixed(0)} km/h</div>
      `, {
        direction: 'auto',
        className: 'weather-tooltip',
        offset: [0, -5]
      });

      layer.on({
        mouseover: function (e) {
          if (mapInstance.getZoom() < ZOOM_LEVELS.PROVINCE) {
            e.target.setStyle({ weight: 2.5, fillOpacity: 0.75 });
            e.target.bringToFront();
          }
        },
        mouseout: function (e) {
          geojsonLayer.resetStyle(e.target);
        },
        click: function (e) {
          if (mapInstance.getZoom() < ZOOM_LEVELS.PROVINCE) {
            activeProvinceId = name;
            mapInstance.fitBounds(e.target.getBounds());
            showWeatherInfoPanel(pData, 'CẤP TỈNH / THÀNH PHỐ');
            renderDistrictsOnMap(pData);
          }
        }
      });
    }
  }).addTo(mapInstance);

  // Initial weather overlay
  updateMapLayer();
}

// =======================================
// RENDER LAYERS
// =======================================
function renderDistrictsOnMap(provinceData) {
  districtLayer.clearLayers();
  provinceData.children.forEach(dId => {
    const dData = HIERARCHY_DATA.districts[dId];
    const weather = getWeatherCondition(dData.env.temp, dData.env.rainfall);
    const tempColor = getTemperatureColor(dData.env.temp);

    const marker = L.circleMarker([dData.lat, dData.lng], {
      radius: 14,
      fillColor: tempColor,
      color: 'rgba(255,255,255,0.5)',
      weight: 2,
      fillOpacity: 0.85
    }).addTo(districtLayer);

    marker.bindTooltip(`
      <div class="weather-tooltip-title">${dData.name}</div>
      <div class="weather-tooltip-row"><span class="tt-icon">${weather.icon}</span> ${weather.label}</div>
      <div class="weather-tooltip-row"><span class="tt-icon">🌡</span> ${dData.env.temp.toFixed(1)}°C</div>
      <div class="weather-tooltip-row"><span class="tt-icon">🌧</span> ${dData.env.rainfall.toFixed(1)} mm</div>
    `, { direction: 'top', className: 'weather-tooltip' });

    marker.on('click', function () {
      activeDistrictId = dData.id;
      mapInstance.setView([dData.lat, dData.lng], ZOOM_LEVELS.DISTRICT + 1);
      showWeatherInfoPanel(dData, 'CẤP QUẬN / HUYỆN');
      renderCommunesOnMap(dData);
    });
  });
}

function renderCommunesOnMap(districtData) {
  communeLayer.clearLayers();
  districtData.children.forEach(cId => {
    const cData = HIERARCHY_DATA.communes[cId];
    const weather = getWeatherCondition(cData.env.temp, cData.env.rainfall);
    const tempColor = getTemperatureColor(cData.env.temp);

    const marker = L.circleMarker([cData.lat, cData.lng], {
      radius: 10,
      fillColor: tempColor,
      color: 'rgba(255,255,255,0.4)',
      weight: 2,
      fillOpacity: 0.85
    }).addTo(communeLayer);

    marker.bindTooltip(`
      <div class="weather-tooltip-title">${cData.name}</div>
      <div class="weather-tooltip-row"><span class="tt-icon">${weather.icon}</span> ${weather.label}</div>
      <div class="weather-tooltip-row"><span class="tt-icon">🌡</span> ${cData.env.temp.toFixed(1)}°C</div>
    `, { direction: 'top', className: 'weather-tooltip' });

    marker.on('click', function () {
      mapInstance.setView([cData.lat, cData.lng], ZOOM_LEVELS.COMMUNE + 1);
      showWeatherInfoPanel(cData, 'CẤP XÃ / PHƯỜNG');

      setTimeout(async () => {
        const confirmed = await showModal({
          title: 'Xem khu vực Thửa Đất chi tiết',
          message: `Bạn có muốn xem chi tiết bản đồ phân lô Thửa Đất tại ${cData.name}?`,
          confirmText: 'Đi tới',
          cancelText: 'Ở lại',
          type: 'map'
        });
        if (confirmed) {
          plotLayer.clearLayers();
          const dynamicPlots = generatePlotsForCoordinate(cData.lat, cData.lng, cData.name);

          L.geoJSON(dynamicPlots, {
            style: { color: 'rgba(255,255,255,0.7)', weight: 2, fillColor: '#10b981', fillOpacity: 0.5 },
            onEachFeature: function (feature, layer) {
              const props = feature.properties;

              layer.on('mouseover', e => e.target.setStyle({ fillOpacity: 0.85, weight: 3 }));
              layer.on('mouseout', e => e.target.setStyle({ fillOpacity: 0.5, weight: 2 }));

              layer.on('click', function () {
                showWeatherInfoPanel(
                  { name: `${props.name} (${props.crop})`, env: cData.env },
                  'CẤP LÔ / THỬA ĐẤT'
                );
              });

              layer.bindTooltip(`
                <div class="weather-tooltip-title">${props.name}</div>
                <div class="weather-tooltip-row"><span class="tt-icon">🌱</span> ${props.crop}</div>
                <div class="weather-tooltip-row"><span class="tt-icon">📐</span> ${props.area}</div>
                <div class="weather-tooltip-row"><span class="tt-icon">${props.status === 'ok' ? '✅' : '⚠️'}</span> ${props.status === 'ok' ? 'Bình thường' : 'Cần chú ý'}</div>
              `, { direction: 'top', className: 'weather-tooltip' });
            }
          }).addTo(plotLayer);

          mapInstance.setView([cData.lat, cData.lng], ZOOM_LEVELS.PLOT);
        }
      }, 500);
    });
  });
}

// =======================================
// WEATHER INFO PANEL
// =======================================
function showWeatherInfoPanel(nodeData, levelText) {
  const panel = document.getElementById('weather-info-panel');
  panel.classList.add('visible');

  // Header
  document.getElementById('wp-level').textContent = levelText;
  document.getElementById('wp-title').textContent = nodeData.name;

  // Hero section
  const weather = getWeatherCondition(nodeData.env.temp, nodeData.env.rainfall);
  const iconEl = document.getElementById('wp-icon');
  iconEl.textContent = weather.icon;
  iconEl.className = 'weather-hero-icon';
  if (weather.id === 'hot' || weather.id === 'sunny') iconEl.classList.add('sunny');
  else if (weather.id === 'stormy') iconEl.classList.add('stormy');
  else iconEl.classList.add('floating');

  document.getElementById('wp-temp').innerHTML = `${nodeData.env.temp.toFixed(0)}<span class="temp-unit">°C</span>`;
  document.getElementById('wp-condition').textContent = weather.label;

  // Stats
  document.getElementById('wp-humidity').textContent = `${nodeData.env.humidity.toFixed(0)}%`;
  document.getElementById('wp-rain').textContent = `${nodeData.env.rainfall.toFixed(1)} mm`;

  const aqiVal = nodeData.env.aqi.toFixed(0);
  const aqiColor = getAqiColor(nodeData.env.aqi);
  document.getElementById('wp-aqi').innerHTML = `<span style="color:${aqiColor}">${aqiVal}</span>`;

  const wind = generateWindForProvince((nodeData.name || '').length * 7);
  document.getElementById('wp-wind').textContent = `${wind.speed.toFixed(0)} km/h`;

  // Forecast
  const forecastContainer = document.getElementById('wp-forecast');
  const forecast = generateForecast(nodeData.env.temp, nodeData.env.rainfall);
  forecastContainer.innerHTML = `
    <div class="weather-forecast-title">Dự báo 5 ngày</div>
    ${forecast.map(f => `
      <div class="weather-forecast-row">
        <span class="weather-forecast-day">${f.day}</span>
        <span class="weather-forecast-icon">${f.condition.icon}</span>
        <div class="weather-forecast-temps">
          <span class="weather-forecast-high">${f.temp}°</span>
          <span class="weather-forecast-low">${f.tempMin}°</span>
        </div>
        <span class="weather-forecast-rain">${f.rain > 0 ? f.rain + 'mm' : '—'}</span>
      </div>
    `).join('')}
  `;
}

function hideInfoPanel() {
  const panel = document.getElementById('weather-info-panel');
  if (panel) panel.classList.remove('visible');
}
