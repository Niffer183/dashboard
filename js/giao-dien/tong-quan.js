// ============================================
// 🌱 VIEW: OVERVIEW
// ============================================

import { getSystemSummary, getEnvironmentOverview, ALERTS } from '../../du-lieu/du-lieu-mau.js';
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
      <div id="kpi-areas" onclick="window.location.hash='#/areas'" style="cursor:pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'"></div>
      <div id="kpi-zones" onclick="window.location.hash='#/areas'" style="cursor:pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'"></div>
      <div id="kpi-plots" onclick="window.location.hash='#/areas'" style="cursor:pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'"></div>
      <div id="kpi-devices" onclick="window.location.hash='#/alerts'" style="cursor:pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'"></div>
    </div>

    <!-- 2. Status Summary -->
    <div class="section">
      <div class="section-header">
        <h2 class="section-title">Trạng thái hệ thống</h2>
      </div>
      <div class="status-summary animate-slide-up stagger-1">
        <div class="status-summary-item w-full" onclick="window.location.hash='#/areas'" style="cursor:pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
          <span class="status-dot status-dot--ok"></span>
          <div>
            <div class="status-summary-count text-primary">${summary.statusCount.ok || 0} khu vực</div>
            <div class="status-summary-label">Bình thường</div>
          </div>
        </div>
        <div class="status-summary-item w-full" onclick="window.location.hash='#/alerts'" style="cursor:pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
          <span class="status-dot status-dot--warning"></span>
          <div>
            <div class="status-summary-count text-warning">${summary.statusCount.warning || 0} khu vực</div>
            <div class="status-summary-label">Cần theo dõi</div>
          </div>
        </div>
        <div class="status-summary-item w-full" onclick="window.location.hash='#/alerts'" style="cursor:pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
          <span class="status-dot status-dot--critical"></span>
          <div>
            <div class="status-summary-count text-critical">${summary.statusCount.critical || 0} khu vực</div>
            <div class="status-summary-label">Đang cảnh báo</div>
          </div>
        </div>
        <div class="status-summary-item w-full" onclick="window.location.hash='#/alerts'" style="cursor:pointer; transition: transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
          <span class="status-dot status-dot--offline"></span>
          <div>
            <div class="status-summary-count text-muted">${summary.statusCount.offline || 0} khu vực</div>
            <div class="status-summary-label">Mất kết nối</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid-2 gap-6 section">
      <!-- 3. Mini Map Placeholder (Static SVG for demo overview) -->
      <div class="card animate-slide-up stagger-2">
        <div class="card-header">
          <h2 class="card-title">🗺️ Bản đồ phân bổ</h2>
          <a href="#/map" class="section-action">Xem chi tiết ↗</a>
        </div>
        <div class="map-container" style="min-height: 300px; display:flex; align-items:center; justify-content:center; background:var(--bg-input);">
           <div class="text-center">
             <div style="font-size: 3rem; opacity:0.5; margin-bottom: 1rem;">🗺️</div>
             <div class="text-muted">Interactive map loading...</div>
           </div>
        </div>
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
  document.getElementById('kpi-plots').innerHTML = renderKpiCard('plots', summary.totalPlots, 'Khu trồng');
  document.getElementById('kpi-devices').innerHTML = renderKpiCard('devices', summary.totalDevices, 'Thiết bị IoT');

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
}
