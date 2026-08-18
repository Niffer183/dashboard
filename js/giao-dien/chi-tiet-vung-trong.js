// ============================================
// 🌱 VIEW: ZONE DETAIL
// ============================================

import { ZONES, AREAS, CROP_DETAILS, getSensorReadings, getSensorTimeSeries, getOperationsByZone, getDevicesByZone } from '../../du-lieu/du-lieu-mau.js';
import { renderStatusBadge } from '../thanh-phan/nhan-trang-thai.js';
import { renderSensorGauge } from '../thanh-phan/bieu-do-dong-ho.js';
import { renderTrendChart } from '../thanh-phan/bieu-do-xu-huong.js';
import { renderDeviceCard } from '../thanh-phan/the-thiet-bi.js';
import { formatDateTime } from '../tien-ich/dinh-dang.js';

export function initZoneDetail(container, params) {
  const zoneId = params.id;
  const zone = ZONES.find(z => z.id === zoneId);
  
  if (!zone) {
    container.innerHTML = `<div class="empty-state">Vùng trồng không tồn tại</div>`;
    return;
  }

  const area = AREAS.find(a => a.id === zone.areaId);
  const cropInfo = CROP_DETAILS[zone.id] || { 
    cropType: zone.crop, variety: 'Đang cập nhật', season: 'Đang cập nhật', 
    plantDate: 'Đang cập nhật', expectedHarvest: 'Đang cập nhật', area: zone.area_hectares, 
    growthStage: 'Đang cập nhật', stageProgress: 0 
  };
  
  const sensorReadings = getSensorReadings(zone.id);
  const operations = getOperationsByZone(zone.id);
  const devices = getDevicesByZone(zone.id);

  window.appState.updateHeader(`Vùng trồng: ${zone.name}`);
  window.appState.renderBreadcrumb([
    { label: 'Hệ thống', url: '#/overview' },
    { label: area.name, url: `#/area/${area.id}` },
    { label: zone.name, icon: '🌱' }
  ]);

  let html = `
    <button class="back-btn" onclick="window.history.back()">
      ← Quay lại ${area.name}
    </button>

    <div class="grid-3 gap-6 section">
      
      <!-- CROP INFO CARD -->
      <div class="card col-span-1 animate-slide-up stagger-1" style="grid-column: span 3;">
        <div class="card-header">
          <h2 class="card-title">🌱 Thông tin cây trồng — ${cropInfo.cropType}</h2>
          ${renderStatusBadge(zone.status)}
        </div>
        
        <div class="crop-info">
          <div class="crop-info-item">
            <span class="crop-info-label">Giống</span>
            <span class="crop-info-value">${cropInfo.variety}</span>
          </div>
          <div class="crop-info-item">
            <span class="crop-info-label">Diện tích</span>
            <span class="crop-info-value">${cropInfo.area} ha</span>
          </div>
          <div class="crop-info-item">
            <span class="crop-info-label">Mùa vụ</span>
            <span class="crop-info-value">${cropInfo.season}</span>
          </div>
          <div class="crop-info-item">
            <span class="crop-info-label">Ngày gieo/trồng</span>
            <span class="crop-info-value">${cropInfo.plantDate}</span>
          </div>
          <div class="crop-info-item">
            <span class="crop-info-label">Dự kiến thu hoạch</span>
            <span class="crop-info-value">${cropInfo.expectedHarvest}</span>
          </div>
        </div>

        <div class="growth-progress">
          <div class="flex justify-between items-end">
            <span class="crop-info-label">Giai đoạn sinh trưởng: <span class="text-primary font-bold ml-1">${cropInfo.growthStage}</span></span>
            <span class="text-sm font-bold text-primary">${cropInfo.stageProgress}%</span>
          </div>
          <div class="growth-progress-bar">
            <div class="growth-progress-fill" style="width: ${cropInfo.stageProgress}%"></div>
          </div>
          <div class="growth-stages">
            <span class="growth-stage ${cropInfo.stageProgress < 25 ? 'active' : ''}">Gieo hạt</span>
            <span class="growth-stage ${cropInfo.stageProgress >= 25 && cropInfo.stageProgress < 50 ? 'active' : ''}">Sinh trưởng</span>
            <span class="growth-stage ${cropInfo.stageProgress >= 50 && cropInfo.stageProgress < 80 ? 'active' : ''}">Ra hoa/Đậu quả</span>
            <span class="growth-stage ${cropInfo.stageProgress >= 80 ? 'active' : ''}">Thu hoạch</span>
          </div>
        </div>
      </div>
      
    </div>

    <!-- SENSORS ROW -->
    <div class="grid-2 gap-6 section">
      
      <!-- ĐẤT -->
      <div class="sensor-group sensor-group--soil animate-slide-up stagger-2">
        <div class="sensor-group-title">🌱 Môi trường Đất</div>
        <div class="flex justify-between items-center mb-4">
          ${renderSensorGauge(sensorReadings.soil.moisture, 'soil', 'moisture')}
          ${renderSensorGauge(sensorReadings.soil.temperature, 'soil', 'temperature')}
          ${renderSensorGauge(sensorReadings.soil.ph, 'soil', 'ph')}
        </div>
        <div class="mt-4">
          <div class="text-sm font-bold text-secondary mb-2">Biểu đồ Độ ẩm đất (24h)</div>
          <div id="chart-soil-moisture"></div>
        </div>
      </div>

      <!-- KHÔNG KHÍ & THỜI TIẾT -->
      <div class="flex-col gap-6 animate-slide-up stagger-3">
        <div class="sensor-group sensor-group--air">
          <div class="sensor-group-title">🌤 Không khí</div>
          <div class="grid-2 gap-4">
             <div>${renderSensorGauge(sensorReadings.air.temperature, 'air', 'temperature')}</div>
             <div>${renderSensorGauge(sensorReadings.air.humidity, 'air', 'humidity')}</div>
          </div>
        </div>
        
        <div class="sensor-group sensor-group--weather">
          <div class="sensor-group-title">🌦 Thời tiết</div>
          <div class="sensor-reading">
            <span class="sensor-label">Lượng mưa</span>
            <div>
              <span class="sensor-value">${sensorReadings.weather.rainfall.value}</span>
              <span class="sensor-unit">${sensorReadings.weather.rainfall.unit}</span>
            </div>
          </div>
          <div class="sensor-reading">
            <span class="sensor-label">Bức xạ mặt trời</span>
            <div>
              <span class="sensor-value">${sensorReadings.weather.solarRadiation.value}</span>
              <span class="sensor-unit">${sensorReadings.weather.solarRadiation.unit}</span>
            </div>
          </div>
          <div class="sensor-reading">
            <span class="sensor-label">Tốc độ gió</span>
            <div>
              <span class="sensor-value">${sensorReadings.weather.windSpeed.value}</span>
              <span class="sensor-unit">${sensorReadings.weather.windSpeed.unit}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid-2 gap-6 section">
      
      <!-- DEVICES -->
      <div class="card animate-slide-up stagger-4">
        <div class="card-header">
          <h2 class="card-title">📡 Trạng thái Thiết bị (${devices.length})</h2>
          <a href="#/devices" class="section-action">Quản lý thiết bị ↗</a>
        </div>
        <div class="flex-col gap-3">
          ${devices.length > 0 ? devices.map(d => renderDeviceCard(d)).join('') : '<div class="text-muted text-sm">Không có thiết bị</div>'}
        </div>
      </div>

      <!-- OPERATIONS -->
      <div class="card animate-slide-up stagger-5">
        <div class="card-header">
          <h2 class="card-title">🚜 Lịch sử Vận hành</h2>
          <span class="section-action">Thêm hoạt động +</span>
        </div>
        <div class="timeline mt-4">
          ${operations.length > 0 ? operations.map(op => `
            <div class="timeline-item">
              <div class="timeline-dot timeline-dot--${op.type}"></div>
              <div class="timeline-date">${op.date}</div>
              <div class="timeline-content">${op.details}</div>
              <div class="timeline-detail">Khối lượng: ${op.quantity} • PP: ${op.method}</div>
            </div>
          `).join('') : '<div class="text-muted text-sm">Chưa có hoạt động nào</div>'}
        </div>
      </div>

    </div>
  `;

  container.innerHTML = html;

  // Xử lý render biểu đồ (sau khi DOM đã được mount)
  setTimeout(() => {
    const tsData = getSensorTimeSeries(zone.id, 'soil_moisture');
    renderTrendChart('chart-soil-moisture', tsData, 'soil', 'moisture');
  }, 100);
}
