// ============================================
// 🌱 VIEW: ZONE LIST
// ============================================

import { ZONES, AREAS } from '../../du-lieu/du-lieu-mau.js';
import { renderStatusBadge } from '../thanh-phan/nhan-trang-thai.js';
import { exportToCSV, renderExportButtons } from '../tien-ich/xuat-du-lieu.js';

export function initZoneList(container) {
  window.appState.updateHeader('Danh sách Vùng trồng');
  window.appState.renderBreadcrumb([
    { label: 'Hệ thống', url: '#/overview' },
    { label: 'Vùng trồng', icon: '🌱' }
  ]);

  let html = `
    <div class="filter-bar animate-in">
      <select class="filter-select" id="filter-zone-status" aria-label="Lọc theo trạng thái">
        <option value="all">Tất cả trạng thái</option>
        <option value="ok">Bình thường</option>
        <option value="warning">Cần theo dõi</option>
        <option value="critical">Cảnh báo</option>
        <option value="offline">Mất kết nối</option>
      </select>
      <select class="filter-select" id="filter-zone-crop" aria-label="Lọc theo cây trồng">
        <option value="all">Tất cả cây trồng</option>
        <option value="Lúa">Lúa</option>
        <option value="Cà chua">Cà chua</option>
        <option value="Cải bắp">Cải bắp</option>
        <option value="Cam">Cam</option>
        <option value="Chè">Chè</option>
      </select>
      ${renderExportButtons('zone-export')}
    </div>

    <div class="card section animate-slide-up stagger-1">
      <div style="overflow-x: auto;">
        <table class="data-table" id="zone-table">
          <thead>
            <tr>
              <th>Tên Vùng</th>
              <th>Thuộc Khu vực</th>
              <th>Cây trồng</th>
              <th>Trạng thái</th>
              <th>Diện tích (ha)</th>
              <th>Số Thửa</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody id="zone-tbody">
            <!-- Rendered by JS -->
          </tbody>
        </table>
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Enrich zone data with Area Name
  const enrichedZones = ZONES.map(z => {
    const area = AREAS.find(a => a.id === z.areaId);
    return {
      ...z,
      areaName: area ? area.name : 'Không xác định'
    };
  });

  function renderTable(zonesToRender) {
    const tbody = document.getElementById('zone-tbody');
    if (zonesToRender.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-8">Không tìm thấy vùng trồng phù hợp</td></tr>`;
      return;
    }

    tbody.innerHTML = zonesToRender.map(zone => `
      <tr onclick="window.location.hash='#/zone/${zone.id}'">
        <td class="font-bold text-primary">${zone.name}</td>
        <td>${zone.areaName}</td>
        <td>🌱 ${zone.crop}</td>
        <td>${renderStatusBadge(zone.status)}</td>
        <td>${zone.area_hectares}</td>
        <td>${zone.plotCount}</td>
        <td class="text-accent">Chi tiết ↗</td>
      </tr>
    `).join('');
  }

  function handleFilter() {
    const statusVal = document.getElementById('filter-zone-status').value;
    const cropVal = document.getElementById('filter-zone-crop').value;

    let filtered = enrichedZones;
    if (statusVal !== 'all') {
      filtered = filtered.filter(z => z.status === statusVal);
    }
    if (cropVal !== 'all') {
      filtered = filtered.filter(z => z.crop.includes(cropVal));
    }
    
    renderTable(filtered);
    window.currentFilteredZones = filtered; // Lưu để export
  }

  document.getElementById('filter-zone-status').addEventListener('change', handleFilter);
  document.getElementById('filter-zone-crop').addEventListener('change', handleFilter);

  // Setup Export
  window.currentFilteredZones = enrichedZones;
  document.getElementById('btn-export-csv-zone-export').addEventListener('click', () => {
    const dataToExport = window.currentFilteredZones.map(z => ({
      ID: z.id,
      TenVung: z.name,
      KhuVuc: z.areaName,
      CayTrong: z.crop,
      DienTichHa: z.area_hectares,
      SoThuaDat: z.plotCount,
      TrangThai: z.status
    }));
    exportToCSV(dataToExport, 'danh-sach-vung-trong');
  });

  document.getElementById('btn-print-zone-export').addEventListener('click', () => {
    window.print();
  });

  // Initial render
  renderTable(enrichedZones);
}
