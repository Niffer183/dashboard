// ============================================
// 🌱 VIEW: AREA LIST
// ============================================

import { AREAS } from '../../du-lieu/du-lieu-mau.js';
import { renderStatusDot } from '../thanh-phan/nhan-trang-thai.js';

export function initAreaList(container) {
  window.appState.updateHeader('Quản lý Khu vực');
  window.appState.renderBreadcrumb([
    { label: 'Hệ thống', url: '#/overview' },
    { label: 'Khu vực', icon: '📍' }
  ]);

  let html = `
    <div class="filter-bar animate-in">
      <select class="filter-select">
        <option value="all">Tất cả trạng thái</option>
        <option value="ok">Bình thường</option>
        <option value="warning">Cần theo dõi</option>
        <option value="critical">Cảnh báo</option>
      </select>
      <select class="filter-select">
        <option value="name">Sắp xếp: Tên (A-Z)</option>
        <option value="status">Sắp xếp: Trạng thái</option>
      </select>
    </div>

    <div class="grid-auto section">
  `;

  AREAS.forEach((area, index) => {
    html += `
      <div class="card card-clickable animate-slide-up stagger-${(index % 6) + 1}" 
           onclick="window.location.hash='#/area/${area.id}'">
        <div class="card-header">
          <div class="card-title">
            ${renderStatusDot(area.status)}
            ${area.name}
          </div>
        </div>
        
        <div class="text-sm text-secondary mb-4">
          📍 ${area.location} • ${area.area_hectares} ha
        </div>
        
        <div class="flex justify-between items-center text-sm border-t border-subtle pt-3" style="border-top-color: var(--border-subtle)">
          <div><span class="text-primary font-bold">${area.totalZones}</span> Vùng</div>
          <div><span class="text-primary font-bold">${area.totalPlots}</span> Khu trồng</div>
          <div><span class="text-primary font-bold">${area.totalDevices}</span> Thiết bị</div>
        </div>
      </div>
    `;
  });

  html += `</div>`;
  container.innerHTML = html;
}
