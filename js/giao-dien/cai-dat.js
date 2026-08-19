// ============================================
// 🌱 VIEW: CÀI ĐẶT HỆ THỐNG
// ============================================

import { THRESHOLDS } from '../../du-lieu/nguong-canh-bao.js';
import { AREAS, ZONES, DEVICES, ALERTS } from '../../du-lieu/du-lieu-mau.js';
import { showToast } from '../thanh-phan/hop-thoai.js';

// Lấy cài đặt từ localStorage
function getSettings() {
  const defaults = {
    theme: 'light',
    refreshInterval: 30,
    language: 'vi',
    notifications: true,
    soundAlerts: false,
    autoRefreshMap: true,
  };
  try {
    const saved = localStorage.getItem('dashboard-settings');
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  } catch {
    return defaults;
  }
}

function saveSettings(settings) {
  localStorage.setItem('dashboard-settings', JSON.stringify(settings));
}

export function initSettingsView(container) {
  window.appState.updateHeader('Cài đặt Hệ thống');
  window.appState.renderBreadcrumb([
    { label: 'Hệ thống', url: '#/overview' },
    { label: 'Cài đặt', icon: '⚙️' }
  ]);

  const settings = getSettings();
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';

  container.innerHTML = `
    <div class="grid-2 gap-6 section">

      <!-- Giao diện -->
      <div class="card animate-slide-up stagger-1">
        <div class="card-header">
          <h2 class="card-title">🎨 Giao diện</h2>
        </div>
        <div class="settings-group">
          <div class="settings-item">
            <div>
              <div class="settings-label">Chế độ màu</div>
              <div class="settings-desc">Chuyển đổi giữa giao diện sáng và tối</div>
            </div>
            <select class="filter-select" id="setting-theme" aria-label="Chế độ màu">
              <option value="light" ${currentTheme === 'light' ? 'selected' : ''}>☀️ Sáng</option>
              <option value="dark" ${currentTheme === 'dark' ? 'selected' : ''}>🌙 Tối</option>
            </select>
          </div>
          <div class="settings-item">
            <div>
              <div class="settings-label">Ngôn ngữ</div>
              <div class="settings-desc">Ngôn ngữ hiển thị giao diện</div>
            </div>
            <select class="filter-select" id="setting-lang" aria-label="Ngôn ngữ">
              <option value="vi" ${settings.language === 'vi' ? 'selected' : ''}>🇻🇳 Tiếng Việt</option>
              <option value="en" ${settings.language === 'en' ? 'selected' : ''}>🇬🇧 English</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Cập nhật dữ liệu -->
      <div class="card animate-slide-up stagger-2">
        <div class="card-header">
          <h2 class="card-title">🔄 Cập nhật dữ liệu</h2>
        </div>
        <div class="settings-group">
          <div class="settings-item">
            <div>
              <div class="settings-label">Tần suất cập nhật</div>
              <div class="settings-desc">Khoảng thời gian cập nhật dữ liệu sensor</div>
            </div>
            <select class="filter-select" id="setting-refresh" aria-label="Tần suất cập nhật">
              <option value="10" ${settings.refreshInterval === 10 ? 'selected' : ''}>10 giây</option>
              <option value="30" ${settings.refreshInterval === 30 ? 'selected' : ''}>30 giây</option>
              <option value="60" ${settings.refreshInterval === 60 ? 'selected' : ''}>1 phút</option>
              <option value="300" ${settings.refreshInterval === 300 ? 'selected' : ''}>5 phút</option>
            </select>
          </div>
          <div class="settings-item">
            <div>
              <div class="settings-label">Tự động cập nhật bản đồ</div>
              <div class="settings-desc">Refresh lại bản đồ khi dữ liệu thay đổi</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="setting-auto-map" ${settings.autoRefreshMap ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Cảnh báo -->
      <div class="card animate-slide-up stagger-3">
        <div class="card-header">
          <h2 class="card-title">🔔 Thông báo & Cảnh báo</h2>
        </div>
        <div class="settings-group">
          <div class="settings-item">
            <div>
              <div class="settings-label">Thông báo cảnh báo</div>
              <div class="settings-desc">Hiển thị popup khi có cảnh báo mới</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="setting-notifications" ${settings.notifications ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="settings-item">
            <div>
              <div class="settings-label">Âm thanh cảnh báo</div>
              <div class="settings-desc">Phát âm thanh khi có cảnh báo critical</div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="setting-sound" ${settings.soundAlerts ? 'checked' : ''}>
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Thông tin hệ thống -->
      <div class="card animate-slide-up stagger-4">
        <div class="card-header">
          <h2 class="card-title">ℹ️ Thông tin Hệ thống</h2>
        </div>
        <div class="settings-group">
          <div class="settings-item">
            <span class="settings-label">Phiên bản</span>
            <span class="text-primary font-bold">v2.0.0</span>
          </div>
          <div class="settings-item">
            <span class="settings-label">Tổng khu vực</span>
            <span class="text-primary font-bold">${AREAS.length}</span>
          </div>
          <div class="settings-item">
            <span class="settings-label">Tổng vùng trồng</span>
            <span class="text-primary font-bold">${ZONES.length}</span>
          </div>
          <div class="settings-item">
            <span class="settings-label">Tổng thiết bị IoT</span>
            <span class="text-primary font-bold">${DEVICES.length}</span>
          </div>
          <div class="settings-item">
            <span class="settings-label">Cảnh báo hiện tại</span>
            <span class="text-warning font-bold">${ALERTS.length}</span>
          </div>
          <div class="settings-item">
            <span class="settings-label">Cập nhật cuối</span>
            <span class="text-primary">${new Date().toLocaleString('vi-VN')}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- Ngưỡng cảnh báo -->
    <div class="card section animate-slide-up stagger-5">
      <div class="card-header">
        <h2 class="card-title">📊 Ngưỡng cảnh báo Sensor</h2>
        <span class="text-sm text-muted">Cấu hình ngưỡng cảnh báo cho từng loại cảm biến</span>
      </div>
      <div style="overflow-x: auto;">
        <table class="data-table">
          <thead>
            <tr>
              <th>Loại</th>
              <th>Cảm biến</th>
              <th>Đơn vị</th>
              <th class="text-critical">Ngưỡng Critical (Thấp)</th>
              <th class="text-warning">Ngưỡng Warning (Thấp)</th>
              <th class="text-ok">Tối ưu Min</th>
              <th class="text-ok">Tối ưu Max</th>
              <th class="text-warning">Ngưỡng Warning (Cao)</th>
              <th class="text-critical">Ngưỡng Critical (Cao)</th>
            </tr>
          </thead>
          <tbody>
            ${buildThresholdRows()}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Lưu -->
    <div class="section" style="display: flex; justify-content: flex-end; gap: 12px;">
      <button class="back-btn" onclick="window.location.hash='#/overview'">Quay lại Tổng quan</button>
      <button class="chart-btn modal-btn--confirm modal-btn--info" id="btn-save-settings" style="padding: 10px 24px; font-size: 14px;">
        💾 Lưu cài đặt
      </button>
    </div>
  `;

  // Event: Theme toggle
  document.getElementById('setting-theme')?.addEventListener('change', (e) => {
    const theme = e.target.value;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dashboard-theme', theme);
    showToast(`Đã chuyển sang giao diện ${theme === 'dark' ? 'tối' : 'sáng'}`, 'success');
  });

  // Event: Save settings
  document.getElementById('btn-save-settings')?.addEventListener('click', () => {
    const newSettings = {
      theme: document.getElementById('setting-theme').value,
      refreshInterval: parseInt(document.getElementById('setting-refresh').value),
      language: document.getElementById('setting-lang').value,
      notifications: document.getElementById('setting-notifications').checked,
      soundAlerts: document.getElementById('setting-sound').checked,
      autoRefreshMap: document.getElementById('setting-auto-map').checked,
    };
    saveSettings(newSettings);
    showToast('Đã lưu cài đặt thành công!', 'success');
  });
}

function buildThresholdRows() {
  const categoryLabels = {
    soil: '🌱 Đất',
    air: '🌤 Không khí',
    weather: '🌦 Thời tiết'
  };
  const sensorLabels = {
    moisture: 'Độ ẩm', temperature: 'Nhiệt độ', ph: 'pH',
    humidity: 'Độ ẩm KK', windSpeed: 'Tốc độ gió', solarRadiation: 'Bức xạ MT'
  };

  let html = '';
  for (const [cat, sensors] of Object.entries(THRESHOLDS)) {
    for (const [sensor, thresh] of Object.entries(sensors)) {
      html += `
        <tr>
          <td class="font-bold">${categoryLabels[cat] || cat}</td>
          <td>${sensorLabels[sensor] || sensor}</td>
          <td class="text-muted">${thresh.unit || '—'}</td>
          <td class="text-critical">${thresh.criticalLow ?? '—'}</td>
          <td class="text-warning">${thresh.warningLow ?? '—'}</td>
          <td class="text-ok">${thresh.optimalMin ?? '—'}</td>
          <td class="text-ok">${thresh.optimalMax ?? '—'}</td>
          <td class="text-warning">${thresh.warningHigh ?? '—'}</td>
          <td class="text-critical">${thresh.criticalHigh ?? '—'}</td>
        </tr>
      `;
    }
  }
  return html;
}
