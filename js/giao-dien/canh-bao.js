// ============================================
// 🌱 VIEW: ALERTS VIEW
// ============================================

import { ALERTS } from '../../du-lieu/du-lieu-mau.js';
import { renderAlertList } from '../thanh-phan/danh-sach-canh-bao.js';

export function initAlertsView(container) {
  window.appState.updateHeader('Quản lý Cảnh báo');
  window.appState.renderBreadcrumb([
    { label: 'Hệ thống', url: '#/overview' },
    { label: 'Cảnh báo', icon: '⚠️' }
  ]);

  let html = `
    <div class="filter-bar animate-in">
      <select class="filter-select" id="filter-severity">
        <option value="all">Tất cả mức độ</option>
        <option value="critical">Cảnh báo (Critical)</option>
        <option value="warning">Cần theo dõi (Warning)</option>
        <option value="info">Thông tin (Info)</option>
      </select>
      <select class="filter-select" id="filter-type">
        <option value="all">Tất cả loại</option>
        <option value="soil">Môi trường Đất</option>
        <option value="air">Môi trường Không khí</option>
        <option value="device">Trạng thái Thiết bị</option>
      </select>
    </div>

    <div class="card section animate-slide-up stagger-1">
      <div class="card-header">
        <h2 class="card-title">Danh sách Cảnh báo (${ALERTS.length})</h2>
      </div>
      <div id="full-alerts-list"></div>
    </div>
  `;

  container.innerHTML = html;

  // Render list alerts
  renderAlertList('full-alerts-list', ALERTS);

  // Note: For a real app, we would add event listeners to filters to re-render the list based on selection.
  // We'll keep it simple for the demo.
  document.getElementById('filter-severity')?.addEventListener('change', (e) => {
    const val = e.target.value;
    const filtered = val === 'all' ? ALERTS : ALERTS.filter(a => a.severity === val);
    renderAlertList('full-alerts-list', filtered);
  });
}
