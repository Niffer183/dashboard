// ============================================
// 🌱 APP CORE (Router & State)
// ============================================

import { renderSidebar } from './thanh-phan/thanh-dieu-huong.js';
import { renderBreadcrumb } from './thanh-phan/duong-dan.js';
import { getSystemSummary, ALERTS, AREAS, ZONES, DEVICES } from '../du-lieu/du-lieu-mau.js';

// Import views
import { initOverview } from './giao-dien/tong-quan.js';
import { initAreaList } from './giao-dien/danh-sach-khu-vuc.js';
import { initAreaDetail } from './giao-dien/chi-tiet-khu-vuc.js';
import { initZoneDetail } from './giao-dien/chi-tiet-vung-trong.js';
import { initDeviceDetail } from './giao-dien/chi-tiet-thiet-bi.js';
import { initMapView } from './giao-dien/ban-do.js';
import { initAlertsView } from './giao-dien/canh-bao.js';
import { initDeviceList } from './giao-dien/danh-sach-thiet-bi.js';
import { initSettingsView } from './giao-dien/cai-dat.js';
import { initZoneList } from './giao-dien/danh-sach-vung-trong.js';
import { initPlotList } from './giao-dien/danh-sach-thua-dat.js';

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
  '#/zones': { view: initZoneList, navId: 'areas' },
  '#/zone/': { view: initZoneDetail, navId: 'areas', isParam: true },
  '#/plots': { view: initPlotList, navId: 'areas' },
  '#/device/': { view: initDeviceDetail, navId: 'devices', isParam: true },
  '#/devices': { view: initDeviceList, navId: 'devices' },
  '#/alerts': { view: initAlertsView, navId: 'alerts' },
  '#/settings': { view: initSettingsView, navId: 'settings' },
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

// --- SEARCH FUNCTIONALITY ---
function buildSearchIndex() {
  const items = [];
  AREAS.forEach(a => items.push({ type: 'area', label: a.name, sublabel: `📍 ${a.location} • ${a.area_hectares} ha`, url: `#/area/${a.id}` }));
  ZONES.forEach(z => {
    const area = AREAS.find(a => a.id === z.areaId);
    items.push({ type: 'zone', label: `${z.name} — ${z.crop}`, sublabel: `🌱 ${area ? area.name : ''}`, url: `#/zone/${z.id}` });
  });
  DEVICES.forEach(d => {
    const zone = ZONES.find(z => z.id === d.zoneId);
    items.push({ type: 'device', label: `${d.id} — ${d.type}`, sublabel: `📡 ${zone ? zone.name : ''} • ${d.online ? 'Online' : 'Offline'}`, url: `#/device/${d.id}` });
  });
  ALERTS.forEach(a => items.push({ type: 'alert', label: a.title, sublabel: `⚠️ ${a.areaName} > ${a.zoneName}`, url: `#/zone/${a.zoneId}` }));
  return items;
}

function initSearch() {
  const searchInput = document.getElementById('global-search');
  const resultsContainer = document.getElementById('search-results');
  if (!searchInput || !resultsContainer) return;

  const searchIndex = buildSearchIndex();

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (query.length < 2) {
      resultsContainer.classList.add('hidden');
      return;
    }

    const results = searchIndex.filter(item => 
      item.label.toLowerCase().includes(query) || 
      item.sublabel.toLowerCase().includes(query)
    ).slice(0, 8);

    if (results.length === 0) {
      resultsContainer.innerHTML = '<div class="search-result-item text-muted">Không tìm thấy kết quả</div>';
    } else {
      resultsContainer.innerHTML = results.map(r => `
        <a href="${r.url}" class="search-result-item" data-route>
          <div class="search-result-label">${r.label}</div>
          <div class="search-result-sublabel">${r.sublabel}</div>
        </a>
      `).join('');
    }
    resultsContainer.classList.remove('hidden');
  });

  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length >= 2) {
      resultsContainer.classList.remove('hidden');
    }
  });

  // Click kết quả → đóng dropdown
  resultsContainer.addEventListener('click', () => {
    resultsContainer.classList.add('hidden');
    searchInput.value = '';
  });

  // Click ra ngoài → đóng dropdown
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
      resultsContainer.classList.add('hidden');
    }
  });

  // ESC đóng
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      resultsContainer.classList.add('hidden');
      searchInput.blur();
    }
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
      backBtn.classList.add('hidden');
    } else {
      backBtn.classList.remove('hidden');
    }
  }

  // Cập nhật UI
  const criticalAlertCount = ALERTS.filter(a => a.severity === 'critical').length;
  renderSidebar('sidebar-container', route.navId, criticalAlertCount);

  // Loading state
  const pageContainer = document.getElementById('page-content');
  pageContainer.innerHTML = `
    <div class="loading-overlay">
      <div class="spinner"></div>
    </div>
  `;

  // Simulate tiny delay for loading effect then execute view
  requestAnimationFrame(() => {
    pageContainer.innerHTML = '';
    if (route.view) {
      route.view(pageContainer, state.params);
    }
  });
}

// --- THEME MANAGEMENT ---
function initTheme() {
  const savedTheme = localStorage.getItem('dashboard-theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

// App Initialization
export function initApp() {
  console.log('🌱 Khởi động Dashboard...');
  
  // Apply theme
  initTheme();
  
  // Render structure
  document.getElementById('app').innerHTML = `
    <aside id="sidebar-container" class="sidebar" role="navigation" aria-label="Menu chính"></aside>
    <main class="main-content" role="main">
      <header class="header" role="banner">
        <div class="header-left">
          <button id="global-back-btn" class="header-back-btn hidden" aria-label="Quay lại">
            ← Quay lại
          </button>
          <div id="header-title" class="header-title">Tổng quan hệ thống</div>
        </div>
        <div class="header-right">
          <div class="search-wrapper">
            <input type="text" id="global-search" class="search-input" placeholder="🔍 Tìm khu vực, thiết bị..." aria-label="Tìm kiếm" autocomplete="off">
            <div id="search-results" class="search-results hidden"></div>
          </div>
          <div id="header-time" class="header-time"></div>
          <div class="status-badge status-badge--ok">
            <span class="header-status-dot"></span> System Online
          </div>
        </div>
      </header>
      <div id="breadcrumb-container" class="breadcrumb" role="navigation" aria-label="Breadcrumb"></div>
      <div id="page-content" class="page-content"></div>
    </main>
  `;

  // Back button event
  document.getElementById('global-back-btn').addEventListener('click', () => window.history.back());

  // Start clock
  updateClock();
  setInterval(updateClock, 1000);

  // Setup search
  initSearch();

  // Setup routing
  window.addEventListener('hashchange', handleRoute);
  
  // Initial route
  if (!window.location.hash) {
    window.location.hash = '#/overview';
  } else {
    handleRoute();
  }
}

// Expose updateHeader globally so views can update it
window.appState = {
  updateHeader,
  renderBreadcrumb: (paths) => renderBreadcrumb('breadcrumb-container', paths)
};
