// ============================================
// 🌱 VIEW: DEVICE LIST
// ============================================

import { DEVICES, ZONES, AREAS } from '../../du-lieu/du-lieu-mau.js';
import { renderStatusBadge } from '../thanh-phan/nhan-trang-thai.js';
import { renderKpiCard } from '../thanh-phan/the-thong-ke.js';
import { timeAgo } from '../tien-ich/dinh-dang.js';
import { exportToCSV, renderExportButtons } from '../tien-ich/xuat-du-lieu.js';

export function initDeviceList(container) {
  window.appState.updateHeader('Quản lý Thiết bị IoT');
  window.appState.renderBreadcrumb([
    { label: 'Hệ thống', url: '#/overview' },
    { label: 'Thiết bị', icon: '📡' }
  ]);

  const onlineDevices = DEVICES.filter(d => d.online);
  const offlineDevices = DEVICES.filter(d => !d.online);
  const lowBattery = DEVICES.filter(d => d.battery < 20);

  let html = `
    <!-- KPI Cards -->
    <div class="grid-4 section">
      <div id="kpi-total-devices"></div>
      <div id="kpi-online-devices"></div>
      <div id="kpi-offline-devices"></div>
      <div id="kpi-low-battery"></div>
    </div>

    <!-- Filter & Export Bar -->
    <div class="filter-bar animate-in">
      <select class="filter-select" id="filter-device-status" aria-label="Lọc theo trạng thái">
        <option value="all">Tất cả trạng thái</option>
        <option value="online">Online</option>
        <option value="offline">Offline</option>
      </select>
      <select class="filter-select" id="filter-device-type" aria-label="Lọc theo loại">
        <option value="all">Tất cả loại</option>
        <option value="Cảm biến đất">Cảm biến đất</option>
        <option value="Cảm biến không khí">Cảm biến không khí</option>
        <option value="Trạm thời tiết">Trạm thời tiết</option>
      </select>
      <select class="filter-select" id="filter-device-zone" aria-label="Lọc theo khu vực">
        <option value="all">Tất cả khu vực</option>
        ${AREAS.map(a => `<option value="${a.id}">${a.name}</option>`).join('')}
      </select>
      ${renderExportButtons('device-export')}
    </div>

    <!-- Device Table -->
    <div class="card section animate-slide-up stagger-1">
      <div class="card-header">
        <h2 class="card-title">Danh sách Thiết bị (<span id="device-count">${DEVICES.length}</span>)</h2>
      </div>
      <div style="overflow-x: auto;">
        <table class="data-table" id="device-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Loại thiết bị</th>
              <th>Vùng trồng</th>
              <th>Trạng thái</th>
              <th>Pin</th>
              <th>Tín hiệu</th>
              <th>Chất lượng DL</th>
              <th>Cập nhật cuối</th>
            </tr>
          </thead>
          <tbody id="device-table-body">
          </tbody>
        </table>
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Render KPIs
  document.getElementById('kpi-total-devices').innerHTML = renderKpiCard('devices', DEVICES.length, 'Tổng thiết bị');
  document.getElementById('kpi-online-devices').innerHTML = `
    <div class="kpi-card animate-slide-up" style="border-left: 3px solid var(--status-ok);">
      <div class="kpi-icon" style="background: var(--status-ok-bg); color: var(--status-ok);">📶</div>
      <div class="kpi-value">${onlineDevices.length}</div>
      <div class="kpi-label">Online</div>
    </div>
  `;
  document.getElementById('kpi-offline-devices').innerHTML = `
    <div class="kpi-card animate-slide-up" style="border-left: 3px solid var(--status-critical);">
      <div class="kpi-icon" style="background: var(--status-critical-bg); color: var(--status-critical);">🔴</div>
      <div class="kpi-value">${offlineDevices.length}</div>
      <div class="kpi-label">Offline</div>
    </div>
  `;
  document.getElementById('kpi-low-battery').innerHTML = `
    <div class="kpi-card animate-slide-up" style="border-left: 3px solid var(--status-warning);">
      <div class="kpi-icon" style="background: var(--status-warning-bg); color: var(--status-warning);">🔋</div>
      <div class="kpi-value">${lowBattery.length}</div>
      <div class="kpi-label">Pin yếu (<20%)</div>
    </div>
  `;

  // Hàm render bảng
  function renderDeviceTable(devices) {
    const tbody = document.getElementById('device-table-body');
    document.getElementById('device-count').textContent = devices.length;

    if (devices.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted" style="padding: 40px;">Không có thiết bị phù hợp</td></tr>`;
      return;
    }

    tbody.innerHTML = devices.map((device, index) => {
      const zone = ZONES.find(z => z.id === device.zoneId);
      const area = zone ? AREAS.find(a => a.id === zone.areaId) : null;
      const statusClass = device.online ? 'ok' : 'offline';
      const batteryClass = device.battery < 20 ? 'text-critical' : device.battery < 30 ? 'text-warning' : 'text-primary';
      const signalClass = device.signal < -90 ? 'text-critical' : device.signal < -80 ? 'text-warning' : 'text-primary';

      return `
        <tr class="animate-in stagger-${(index % 6) + 1}" onclick="window.location.hash='#/device/${device.id}'" style="cursor:pointer;">
          <td class="font-bold text-primary">${device.id}</td>
          <td>${device.type}</td>
          <td>
            <div>${zone ? zone.name : '—'}</div>
            <div class="text-xs text-muted">${area ? area.name : ''}</div>
          </td>
          <td>${renderStatusBadge(statusClass)}</td>
          <td class="${batteryClass} font-bold">${device.battery}% 🔋</td>
          <td class="${signalClass} font-bold">${device.signal} dBm</td>
          <td>${device.dataQuality}</td>
          <td>
            <div>${timeAgo(device.lastSeen)}</div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Render initial
  renderDeviceTable(DEVICES);

  // Filter logic
  function applyFilters() {
    const statusFilter = document.getElementById('filter-device-status').value;
    const typeFilter = document.getElementById('filter-device-type').value;
    const zoneFilter = document.getElementById('filter-device-zone').value;

    let filtered = [...DEVICES];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(d => statusFilter === 'online' ? d.online : !d.online);
    }
    if (typeFilter !== 'all') {
      filtered = filtered.filter(d => d.type === typeFilter);
    }
    if (zoneFilter !== 'all') {
      const areaZones = ZONES.filter(z => z.areaId === zoneFilter).map(z => z.id);
      filtered = filtered.filter(d => areaZones.includes(d.zoneId));
    }

    renderDeviceTable(filtered);
  }

  document.getElementById('filter-device-status').addEventListener('change', applyFilters);
  document.getElementById('filter-device-type').addEventListener('change', applyFilters);
  document.getElementById('filter-device-zone').addEventListener('change', applyFilters);

  // Export CSV
  document.getElementById('device-export')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;

    if (btn.dataset.action === 'csv') {
      const csvData = DEVICES.map(d => {
        const zone = ZONES.find(z => z.id === d.zoneId);
        return {
          id: d.id,
          type: d.type,
          zone: zone ? zone.name : '',
          status: d.online ? 'Online' : 'Offline',
          battery: d.battery + '%',
          signal: d.signal + ' dBm',
          quality: d.dataQuality,
          lastSeen: d.lastSeen,
          firmware: d.firmware
        };
      });
      exportToCSV(csvData, 'thiet-bi-iot', {
        id: 'ID', type: 'Loại', zone: 'Vùng trồng', status: 'Trạng thái',
        battery: 'Pin', signal: 'Tín hiệu', quality: 'Chất lượng DL',
        lastSeen: 'Cập nhật cuối', firmware: 'Firmware'
      });
    } else if (btn.dataset.action === 'print') {
      window.print();
    }
  });
}
