// ============================================
// 🌱 VIEW: AREA DETAIL
// ============================================

import { AREAS, getZonesByArea, getAlertsByArea } from '../../du-lieu/du-lieu-mau.js';
import { renderStatusBadge, renderStatusDot } from '../thanh-phan/nhan-trang-thai.js';
import { renderAlertList } from '../thanh-phan/danh-sach-canh-bao.js';

export function initAreaDetail(container, params) {
  const areaId = params.id;
  const area = AREAS.find(a => a.id === areaId);
  
  if (!area) {
    container.innerHTML = `<div class="empty-state">Khu vực không tồn tại</div>`;
    return;
  }

  const zones = getZonesByArea(areaId);
  const alerts = getAlertsByArea(areaId);

  window.appState.updateHeader(`Khu vực: ${area.name}`);
  window.appState.renderBreadcrumb([
    { label: 'Hệ thống', url: '#/overview' },
    { label: 'Khu vực', url: '#/areas' },
    { label: area.name, icon: '📍' }
  ]);

  let html = `
    <button class="back-btn" onclick="window.history.back()">
      ← Quay lại
    </button>

    <div class="grid-3 gap-6 section">
      
      <!-- Area Summary Card -->
      <div class="card col-span-1 animate-slide-up stagger-1">
        <div class="card-header">
          <h2 class="card-title">Thông tin chung</h2>
          ${renderStatusBadge(area.status)}
        </div>
        <div class="flex-col gap-3 mt-4">
          <div class="flex justify-between border-b border-subtle pb-2">
            <span class="text-secondary">Vị trí</span>
            <span class="text-primary font-bold">${area.location}</span>
          </div>
          <div class="flex justify-between border-b border-subtle pb-2">
            <span class="text-secondary">Tọa độ</span>
            <span class="text-primary font-bold">${area.gps.lat}, ${area.gps.lng}</span>
          </div>
          <div class="flex justify-between border-b border-subtle pb-2">
            <span class="text-secondary">Tổng diện tích</span>
            <span class="text-primary font-bold">${area.area_hectares} ha</span>
          </div>
          <div class="flex justify-between border-b border-subtle pb-2">
            <span class="text-secondary">Tổng số vùng trồng</span>
            <span class="text-primary font-bold">${area.totalZones}</span>
          </div>
        </div>
      </div>

      <!-- Area Map View (Mock) -->
      <div class="card col-span-2 animate-slide-up stagger-2">
        <div class="card-header">
          <h2 class="card-title">Bản đồ phân lô</h2>
        </div>
        <div class="map-container" style="height: 200px; display:flex; align-items:center; justify-content:center;">
          <span class="text-muted text-sm">Sơ đồ không gian khu vực ${area.name}</span>
        </div>
      </div>
    </div>

    <!-- Zones Table -->
    <div class="card section animate-slide-up stagger-3">
      <div class="card-header">
        <h2 class="card-title">Danh sách Vùng trồng (${zones.length})</h2>
      </div>
      <div style="overflow-x: auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Tên Vùng</th>
              <th>Trạng thái</th>
              <th>Loại cây trồng</th>
              <th>Diện tích</th>
              <th>Số khu trồng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            ${zones.map(zone => `
              <tr onclick="window.location.hash='#/zone/${zone.id}'">
                <td class="font-bold text-primary">${zone.name}</td>
                <td>${renderStatusBadge(zone.status)}</td>
                <td>🌱 ${zone.crop}</td>
                <td>${zone.area_hectares} ha</td>
                <td>${zone.plotCount}</td>
                <td class="text-accent">Chi tiết ↗</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Area Alerts -->
    <div class="card section animate-slide-up stagger-4">
      <div class="card-header">
        <h2 class="card-title">Cảnh báo khu vực</h2>
      </div>
      <div id="area-alerts"></div>
    </div>
  `;

  // Thêm utility class cho grid layout nếu chưa có trong css
  // Để đơn giản, ta dùng inline CSS hoặc thêm vào stylesheet
  // `col-span-1` and `col-span-2` might need to be added to CSS if strictly using grids

  container.innerHTML = html;

  // Render Alerts
  renderAlertList('area-alerts', alerts);
}
