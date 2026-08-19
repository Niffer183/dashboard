// ============================================
// 🌱 VIEW: AREA LIST
// ============================================

import { AREAS } from '../../du-lieu/du-lieu-mau.js';
import { renderStatusDot } from '../thanh-phan/nhan-trang-thai.js';
import { exportToCSV, renderExportButtons } from '../tien-ich/xuat-du-lieu.js';

export function initAreaList(container) {
  window.appState.updateHeader('Quản lý Khu vực');
  window.appState.renderBreadcrumb([
    { label: 'Hệ thống', url: '#/overview' },
    { label: 'Khu vực', icon: '📍' }
  ]);

  let html = `
    <div class="filter-bar animate-in">
      <select class="filter-select" id="filter-area-status" aria-label="Lọc theo trạng thái">
        <option value="all">Tất cả trạng thái</option>
        <option value="ok">Bình thường</option>
        <option value="warning">Cần theo dõi</option>
        <option value="critical">Cảnh báo</option>
        <option value="offline">Mất kết nối</option>
      </select>
      <select class="filter-select" id="filter-area-sort" aria-label="Sắp xếp">
        <option value="name">Sắp xếp: Tên (A-Z)</option>
        <option value="name-desc">Sắp xếp: Tên (Z-A)</option>
        <option value="status">Sắp xếp: Trạng thái</option>
        <option value="area">Sắp xếp: Diện tích (lớn → nhỏ)</option>
        <option value="devices">Sắp xếp: Thiết bị (nhiều → ít)</option>
      </select>
      ${renderExportButtons('area-export')}
    </div>

    <div class="grid-auto section" id="area-grid">
    </div>
  `;

  container.innerHTML = html;

  // Hàm render danh sách khu vực
  function renderAreaGrid(areas) {
    const grid = document.getElementById('area-grid');
    if (areas.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon">🔍</div>
          <div class="empty-state-title">Không tìm thấy khu vực</div>
          <div class="empty-state-desc">Thử thay đổi bộ lọc để xem kết quả khác</div>
        </div>
      `;
      return;
    }

    grid.innerHTML = areas.map((area, index) => `
      <div class="card card-clickable animate-slide-up stagger-${(index % 6) + 1}" 
           data-area-id="${area.id}">
        <div class="card-header">
          <div class="card-title">
            ${renderStatusDot(area.status)}
            ${area.name}
          </div>
        </div>
        
        <div class="text-sm text-secondary mb-4">
          📍 ${area.location} • ${area.area_hectares} ha
        </div>
        
        <div class="flex justify-between items-center text-sm" style="border-top: 1px solid var(--border-subtle); padding-top: 12px;">
          <div><span class="text-primary font-bold">${area.totalZones}</span> Vùng</div>
          <div><span class="text-primary font-bold">${area.totalPlots}</span> Thửa đất</div>
          <div><span class="text-primary font-bold">${area.totalDevices}</span> Thiết bị</div>
        </div>
      </div>
    `).join('');
  }

  // Hàm filter + sort
  function applyFilters() {
    const statusFilter = document.getElementById('filter-area-status').value;
    const sortFilter = document.getElementById('filter-area-sort').value;

    let filtered = [...AREAS];

    // Filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    // Sort
    const statusOrder = { critical: 0, warning: 1, offline: 2, ok: 3 };
    switch (sortFilter) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name, 'vi'));
        break;
      case 'status':
        filtered.sort((a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9));
        break;
      case 'area':
        filtered.sort((a, b) => b.area_hectares - a.area_hectares);
        break;
      case 'devices':
        filtered.sort((a, b) => b.totalDevices - a.totalDevices);
        break;
    }

    renderAreaGrid(filtered);
  }

  // Initial render
  renderAreaGrid(AREAS);

  // Event delegation cho click card → navigate
  document.getElementById('area-grid').addEventListener('click', (e) => {
    const card = e.target.closest('[data-area-id]');
    if (card) {
      window.location.hash = `#/area/${card.dataset.areaId}`;
    }
  });

  // Filter events
  document.getElementById('filter-area-status').addEventListener('change', applyFilters);
  document.getElementById('filter-area-sort').addEventListener('change', applyFilters);

  // Export CSV
  document.getElementById('area-export')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    if (btn.dataset.action === 'csv') {
      exportToCSV(AREAS.map(a => ({
        name: a.name, location: a.location, status: a.status,
        area: a.area_hectares + ' ha', zones: a.totalZones,
        plots: a.totalPlots, devices: a.totalDevices
      })), 'khu-vuc', {
        name: 'Tên', location: 'Vị trí', status: 'Trạng thái',
        area: 'Diện tích', zones: 'Vùng trồng', plots: 'Thửa đất', devices: 'Thiết bị'
      });
    } else if (btn.dataset.action === 'print') {
      window.print();
    }
  });
}
