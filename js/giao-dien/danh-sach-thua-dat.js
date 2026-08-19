// ============================================
// 🌱 VIEW: PLOT LIST (THỬA ĐẤT)
// ============================================

import { getAllPlots } from '../../du-lieu/du-lieu-mau.js';
import { renderStatusBadge } from '../thanh-phan/nhan-trang-thai.js';
import { exportToCSV, renderExportButtons } from '../tien-ich/xuat-du-lieu.js';

export function initPlotList(container) {
  window.appState.updateHeader('Danh sách Thửa đất');
  window.appState.renderBreadcrumb([
    { label: 'Hệ thống', url: '#/overview' },
    { label: 'Thửa đất', icon: '🌱' }
  ]);

  let html = `
    <div class="filter-bar animate-in">
      <select class="filter-select" id="filter-plot-status" aria-label="Lọc theo trạng thái">
        <option value="all">Tất cả trạng thái</option>
        <option value="ok">Bình thường</option>
        <option value="warning">Cần theo dõi</option>
        <option value="critical">Cảnh báo</option>
        <option value="offline">Mất kết nối</option>
      </select>
      <select class="filter-select" id="filter-plot-crop" aria-label="Lọc theo cây trồng">
        <option value="all">Tất cả cây trồng</option>
        <option value="Lúa">Lúa</option>
        <option value="Cà chua">Cà chua</option>
        <option value="Cải bắp">Cải bắp</option>
        <option value="Cam">Cam</option>
        <option value="Chè">Chè</option>
      </select>
      ${renderExportButtons('plot-export')}
    </div>

    <div class="card section animate-slide-up stagger-1">
      <div style="overflow-x: auto; max-height: 600px;">
        <table class="data-table" id="plot-table" style="position: relative;">
          <thead style="position: sticky; top: 0; background: var(--bg-card); z-index: 10;">
            <tr>
              <th>ID Thửa</th>
              <th>Thuộc Vùng</th>
              <th>Thuộc Khu vực</th>
              <th>Cây trồng</th>
              <th>Trạng thái</th>
              <th>Diện tích (ha)</th>
              <th>Bản đồ</th>
            </tr>
          </thead>
          <tbody id="plot-tbody">
            <!-- Rendered by JS -->
          </tbody>
        </table>
      </div>
    </div>
  `;

  container.innerHTML = html;

  const allPlots = getAllPlots();

  function renderTable(plotsToRender) {
    const tbody = document.getElementById('plot-tbody');
    if (plotsToRender.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-8">Không tìm thấy thửa đất phù hợp</td></tr>`;
      return;
    }

    tbody.innerHTML = plotsToRender.map(plot => `
      <tr onclick="window.location.hash='#/zone/${plot.zoneId}'">
        <td class="font-bold text-primary">${plot.name}</td>
        <td>${plot.zoneName}</td>
        <td>${plot.areaName}</td>
        <td>🌱 ${plot.crop}</td>
        <td>${renderStatusBadge(plot.status)}</td>
        <td>${plot.area_hectares}</td>
        <td class="text-accent">Mở bản đồ ↗</td>
      </tr>
    `).join('');
  }

  function handleFilter() {
    const statusVal = document.getElementById('filter-plot-status').value;
    const cropVal = document.getElementById('filter-plot-crop').value;

    let filtered = allPlots;
    if (statusVal !== 'all') {
      filtered = filtered.filter(p => p.status === statusVal);
    }
    if (cropVal !== 'all') {
      filtered = filtered.filter(p => p.crop.includes(cropVal));
    }
    
    renderTable(filtered);
    window.currentFilteredPlots = filtered;
  }

  document.getElementById('filter-plot-status').addEventListener('change', handleFilter);
  document.getElementById('filter-plot-crop').addEventListener('change', handleFilter);

  // Setup Export
  window.currentFilteredPlots = allPlots;
  document.getElementById('btn-export-csv-plot-export').addEventListener('click', () => {
    const dataToExport = window.currentFilteredPlots.map(p => ({
      ID: p.id,
      TenThua: p.name,
      Vung: p.zoneName,
      KhuVuc: p.areaName,
      CayTrong: p.crop,
      DienTichHa: p.area_hectares,
      TrangThai: p.status
    }));
    exportToCSV(dataToExport, 'danh-sach-thua-dat');
  });

  document.getElementById('btn-print-plot-export').addEventListener('click', () => {
    window.print();
  });

  // Initial render
  renderTable(allPlots);
}
