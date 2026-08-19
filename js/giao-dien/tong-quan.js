// ============================================
// 🌱 VIEW: OVERVIEW
// ============================================

import { getSystemSummary, getEnvironmentOverview, ALERTS, AREAS } from '../../du-lieu/du-lieu-mau.js';
import { renderKpiCard } from '../thanh-phan/the-thong-ke.js';
import { renderAlertList } from '../thanh-phan/danh-sach-canh-bao.js';

export function initOverview(container) {
  window.appState.updateHeader('Tổng Quan Hệ Thống');
  window.appState.renderBreadcrumb([{ label: 'Hệ thống', icon: '🏠' }]);

  const summary = getSystemSummary();
  const envOverview = getEnvironmentOverview();

  container.innerHTML = `
    <!-- 1. KPI Cards -->
    <div class="grid-4 section">
      <div id="kpi-areas" class="kpi-card-wrapper" data-nav="#/areas"></div>
      <div id="kpi-zones" class="kpi-card-wrapper" data-nav="#/areas"></div>
      <div id="kpi-plots" class="kpi-card-wrapper" data-nav="#/areas"></div>
      <div id="kpi-devices" class="kpi-card-wrapper" data-nav="#/devices"></div>
    </div>

    <!-- 2. Status Summary -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">Trạng thái hệ thống</h2>
      </div>
      <div class="status-summary animate-slide-up stagger-1">
        <div class="status-summary-item status-summary-item-clickable w-full" data-nav="#/areas">
          <span class="status-dot status-dot--ok"></span>
          <div>
            <div class="status-summary-count text-primary">${summary.statusCount.ok || 0} khu vực</div>
            <div class="status-summary-label">Bình thường</div>
          </div>
        </div>
        <div class="status-summary-item status-summary-item-clickable w-full" data-nav="#/alerts">
          <span class="status-dot status-dot--warning"></span>
          <div>
            <div class="status-summary-count text-warning">${summary.statusCount.warning || 0} khu vực</div>
            <div class="status-summary-label">Cần theo dõi</div>
          </div>
        </div>
        <div class="status-summary-item status-summary-item-clickable w-full" data-nav="#/alerts">
          <span class="status-dot status-dot--critical"></span>
          <div>
            <div class="status-summary-count text-critical">${summary.statusCount.critical || 0} khu vực</div>
            <div class="status-summary-label">Đang cảnh báo</div>
          </div>
        </div>
        <div class="status-summary-item status-summary-item-clickable w-full" data-nav="#/alerts">
          <span class="status-dot status-dot--offline"></span>
          <div>
            <div class="status-summary-count text-muted">${summary.statusCount.offline || 0} khu vực</div>
            <div class="status-summary-label">Mất kết nối</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid-2 gap-6 section">
      <!-- 3. Mini Map (Leaflet) -->
      <div class="card animate-slide-up stagger-2">
        <div class="card-header">
          <h2 class="card-title">🗺️ Bản đồ phân bổ</h2>
          <a href="#/map" class="section-action">Xem chi tiết ↗</a>
        </div>
        <div id="overview-mini-map" class="map-container" style="min-height: 300px; cursor: pointer;"></div>
      </div>

      <!-- 4. Top Alerts -->
      <div class="card animate-slide-up stagger-3">
        <div class="card-header">
          <h2 class="card-title text-critical">⚠️ Cảnh báo quan trọng</h2>
          <a href="#/alerts" class="section-action">Xem tất cả ↗</a>
        </div>
        <div id="overview-alerts"></div>
      </div>
    </div>

    <!-- 5. Environment Overview -->
    <div class="section animate-slide-up stagger-4">
      <div class="section-header">
        <h2 class="section-title">📊 Tổng quan môi trường</h2>
      </div>
      <div class="env-overview-grid" id="env-overview-grid">
        <!-- Rendered by JS -->
      </div>
    </div>
  `;

  // Render KPIs
  document.getElementById('kpi-areas').innerHTML = renderKpiCard('areas', summary.totalAreas, 'Khu vực');
  document.getElementById('kpi-zones').innerHTML = renderKpiCard('zones', summary.totalZones, 'Vùng trồng');
  document.getElementById('kpi-plots').innerHTML = renderKpiCard('plots', summary.totalPlots, 'Thửa đất');
  document.getElementById('kpi-devices').innerHTML = renderKpiCard('devices', summary.totalDevices, 'Thiết bị IoT');

  // Event delegation cho tất cả click navigations (thay vì inline onclick)
  container.addEventListener('click', (e) => {
    const navItem = e.target.closest('[data-nav]');
    if (navItem) {
      window.location.hash = navItem.dataset.nav;
    }
  });

  // Render Alerts
  const criticalAlerts = ALERTS.filter(a => a.severity === 'critical' || a.severity === 'warning');
  renderAlertList('overview-alerts', criticalAlerts, 4);

  // Render Env Overview
  let envHtml = '';
  for (const [key, data] of Object.entries(envOverview)) {
    const rangeStr = `${data.min} - ${data.max}`;
    const pct = Math.min(100, (data.avg / data.max) * 100);
    envHtml += `
      <div class="env-mini-card">
        <div class="flex items-center justify-between">
          <span class="env-mini-label">${data.icon} ${data.label}</span>
        </div>
        <div class="env-mini-value">${data.avg} <span class="text-sm font-normal text-muted">${data.unit}</span></div>
        <div class="env-mini-range">Range: ${rangeStr}</div>
        <div class="env-mini-bar mt-2">
          <div class="env-mini-bar-fill" style="width: ${pct}%; background: var(--accent-primary)"></div>
        </div>
      </div>
    `;
  }
  document.getElementById('env-overview-grid').innerHTML = envHtml;

  // Render Mini Map (Leaflet thật thay vì placeholder)
  setTimeout(() => initMiniMap(), 200);
}

// Mini Map — hiển thị markers cho các khu vực
function initMiniMap() {
  const mapContainer = document.getElementById('overview-mini-map');
  if (!mapContainer) return;

  // Kiểm tra nếu Leaflet đã load
  if (typeof L === 'undefined') {
    mapContainer.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:center; height:100%; flex-direction:column; gap:8px;">
        <div style="font-size:2rem; opacity:0.5;">🗺️</div>
        <a href="#/map" class="text-muted" style="font-size:13px;">Nhấn để xem bản đồ chi tiết</a>
      </div>
    `;
    return;
  }

  const statusColors = {
    ok: '#10b981',
    warning: '#f59e0b',
    critical: '#ef4444',
    offline: '#64748b'
  };

  try {
    const miniMap = L.map(mapContainer, {
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
    }).setView([20.5, 106.0], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: ''
    }).addTo(miniMap);

    // Thêm markers cho các khu vực
    const { AREAS } = await_import_areas();
    AREAS.forEach(area => {
      const color = statusColors[area.status] || statusColors.ok;
      L.circleMarker([area.gps.lat, area.gps.lng], {
        radius: 8,
        fillColor: color,
        color: '#fff',
        weight: 2,
        fillOpacity: 0.9
      })
      .bindTooltip(`<strong>${area.name}</strong><br>${area.totalZones} vùng • ${area.totalDevices} thiết bị`, { direction: 'top' })
      .addTo(miniMap);
    });

    // Click map → navigate to full map
    mapContainer.addEventListener('click', () => {
      window.location.hash = '#/map';
    });
  } catch (err) {
    console.warn('Mini map init failed:', err);
    mapContainer.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:center; height:100%; flex-direction:column; gap:8px;">
        <div style="font-size:2rem; opacity:0.5;">🗺️</div>
        <a href="#/map" class="text-muted" style="font-size:13px;">Nhấn để xem bản đồ chi tiết</a>
      </div>
    `;
  }
}

// Helper: lấy AREAS (đã import ở trên)
function await_import_areas() {
  return { AREAS };
}
