// ============================================
// 🌱 SIDEBAR COMPONENT
// ============================================

export const MENU_ITEMS = [
  { id: 'overview', icon: `<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>`, label: 'Tổng quan', path: '#/overview' },
  { id: 'map', icon: `<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line>`, label: 'Bản đồ', path: '#/map' },
  { id: 'areas', icon: `<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>`, label: 'Khu vực', path: '#/areas' },
  { id: 'devices', icon: `<rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line>`, label: 'Thiết bị', path: '#/devices' },
  { id: 'alerts', icon: `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>`, label: 'Cảnh báo', path: '#/alerts', hasBadge: true },
  { id: 'settings', icon: `<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>`, label: 'Cài đặt', path: '#/settings' },
];

export function renderSidebar(containerId, activeId, alertCount = 0) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';

  let html = `
    <div class="sidebar-logo" aria-label="Dashboard Nông Nghiệp">🌱</div>
    <div class="sidebar-nav" role="menubar">
  `;

  MENU_ITEMS.forEach(item => {
    const isActive = item.id === activeId ? 'active' : '';
    const badgeHtml = (item.hasBadge && alertCount > 0) 
      ? `<div class="sidebar-badge" aria-label="${alertCount} cảnh báo">${alertCount > 99 ? '99+' : alertCount}</div>` 
      : '';

    html += `
      <a href="${item.path}" class="sidebar-nav-item ${isActive}" data-route role="menuitem" aria-label="${item.label}" tabindex="0">
        <div class="sidebar-nav-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
            ${item.icon}
          </svg>
          ${badgeHtml}
        </div>
        <span class="sidebar-nav-label">${item.label}</span>
      </a>
    `;
  });

  html += `</div>`;

  // Theme toggle button ở bottom
  html += `
    <div class="sidebar-footer">
      <button class="sidebar-nav-item theme-toggle-btn" id="theme-toggle" 
              aria-label="Chuyển đổi giao diện ${currentTheme === 'dark' ? 'sáng' : 'tối'}" 
              tabindex="0" title="Chuyển ${currentTheme === 'dark' ? 'sáng' : 'tối'}">
        <div class="sidebar-nav-icon">
          <span class="theme-toggle-icon">${currentTheme === 'dark' ? '☀️' : '🌙'}</span>
        </div>
        <span class="sidebar-nav-label">${currentTheme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối'}</span>
      </button>
    </div>
  `;

  container.innerHTML = html;

  // Theme toggle event
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('dashboard-theme', next);
    // Re-render sidebar to update icon
    renderSidebar(containerId, activeId, alertCount);
  });
}
