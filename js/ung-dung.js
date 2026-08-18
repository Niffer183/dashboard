// ============================================
// 🌱 APP CORE (Router & State)
// ============================================

import { renderSidebar } from './thanh-phan/thanh-dieu-huong.js';
import { renderBreadcrumb } from './thanh-phan/duong-dan.js';
import { getSystemSummary, ALERTS } from '../du-lieu/du-lieu-mau.js';

// Import views
import { initOverview } from './giao-dien/tong-quan.js';
import { initAreaList } from './giao-dien/danh-sach-khu-vuc.js';
import { initAreaDetail } from './giao-dien/chi-tiet-khu-vuc.js';
import { initZoneDetail } from './giao-dien/chi-tiet-vung-trong.js';
import { initDeviceDetail } from './giao-dien/chi-tiet-thiet-bi.js';
import { initMapView } from './giao-dien/ban-do.js';
import { initAlertsView } from './giao-dien/canh-bao.js';

// Global State
const state = {
  currentRoute: '',
  params: {},
};

const ROUTES = {
  '#/overview': { view: initOverview, navId: 'overview' },
  '#/map': { view: initMapView, navId: 'map' },
  '#/areas': { view: initAreaList, navId: 'areas' },
  '#/area/': { view: initAreaDetail, navId: 'areas', isParam: true },
  '#/zone/': { view: initZoneDetail, navId: 'areas', isParam: true },
  '#/device/': { view: initDeviceDetail, navId: 'devices', isParam: true },
  '#/devices': { view: () => { /* TBD: Device List View */ }, navId: 'devices' },
  '#/alerts': { view: initAlertsView, navId: 'alerts' },
};

function updateHeader(title) {
  document.getElementById('header-title').textContent = title;
}

function updateClock() {
  const timeEl = document.getElementById('header-time');
  if (!timeEl) return;
  const now = new Date();
  timeEl.textContent = now.toLocaleString('vi-VN', {
    weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
}

function handleRoute() {
  let hash = window.location.hash || '#/overview';
  
  // Parse params
  let routeKey = hash;
  let paramId = null;
  
  if (hash.startsWith('#/area/')) { routeKey = '#/area/'; paramId = hash.replace('#/area/', ''); }
  else if (hash.startsWith('#/zone/')) { routeKey = '#/zone/'; paramId = hash.replace('#/zone/', ''); }
  else if (hash.startsWith('#/device/')) { routeKey = '#/device/'; paramId = hash.replace('#/device/', ''); }

  const route = ROUTES[routeKey] || ROUTES['#/overview'];
  state.currentRoute = routeKey;
  state.params.id = paramId;

  // Xử lý hiển thị nút quay lại
  const backBtn = document.getElementById('global-back-btn');
  if (backBtn) {
    if (hash === '#/overview' || hash === '' || hash === '#/map') {
      backBtn.style.display = 'none';
    } else {
      backBtn.style.display = 'flex';
    }
  }

  // Cập nhật UI
  const criticalAlertCount = ALERTS.filter(a => a.severity === 'critical').length;
  renderSidebar('sidebar-container', route.navId, criticalAlertCount);

  // Clear page content
  const pageContainer = document.getElementById('page-content');
  pageContainer.innerHTML = '';

  // Execute view logic
  if (route.view) {
    route.view(pageContainer, state.params);
  }
}

// App Initialization
export function initApp() {
  console.log('🌱 Khởi động Dashboard...');
  
  // Render structure
  document.getElementById('app').innerHTML = `
    <aside id="sidebar-container" class="sidebar"></aside>
    <main class="main-content">
      <header class="header">
        <div class="header-left" style="display:flex; align-items:center; gap: 15px;">
          <button id="global-back-btn" onclick="window.history.back()" style="background:var(--bg-hover); border:1px solid var(--border-default); color:var(--text-primary); padding:6px 12px; border-radius:4px; cursor:pointer; font-weight:bold; font-size:14px; transition:all 0.2s; display: none; align-items: center; gap: 5px;" onmouseover="this.style.background='var(--bg-input)'" onmouseout="this.style.background='var(--bg-hover)'">
            ← Quay lại
          </button>
          <div id="header-title" class="header-title">Tổng quan hệ thống</div>
        </div>
        <div class="header-right">
          <div id="header-time" class="header-time"></div>
          <div class="status-badge status-badge--ok">
            <span class="header-status-dot"></span> System Online
          </div>
        </div>
      </header>
      <div id="breadcrumb-container" class="breadcrumb"></div>
      <div id="page-content" class="page-content"></div>
    </main>
  `;

  // Start clock
  updateClock();
  setInterval(updateClock, 1000);

  // Setup routing
  window.addEventListener('hashchange', handleRoute);
  
  // Initial route
  if (!window.location.hash) {
    window.location.hash = '#/map';
  } else {
    handleRoute();
  }
}

// Expose updateHeader globally so views can update it
window.appState = {
  updateHeader,
  renderBreadcrumb: (paths) => renderBreadcrumb('breadcrumb-container', paths)
};
