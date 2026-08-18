// ============================================
// 🌱 ALERT LIST COMPONENT
// ============================================

import { timeAgo, getSensorIcon } from '../tien-ich/dinh-dang.js';

export function renderAlertList(containerId, alerts, limit = null) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!alerts || alerts.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">✅</div>
        <div class="empty-state-title">Không có cảnh báo</div>
        <div class="empty-state-desc">Hệ thống đang hoạt động bình thường</div>
      </div>
    `;
    return;
  }

  const displayAlerts = limit ? alerts.slice(0, limit) : alerts;
  
  let html = '<div class="flex-col gap-3">';
  
  displayAlerts.forEach((alert, index) => {
    let icon = '⚠️';
    if (alert.sensorType === 'device') icon = '📡';
    else if (alert.sensorType === 'crop') icon = '🌱';
    else icon = getSensorIcon(alert.sensorType.split('_')[1] || alert.sensorType);

    html += `
      <div class="alert-item alert-item--${alert.severity} animate-in stagger-${(index % 6) + 1}" 
           onclick="window.location.hash='#/zone/${alert.zoneId}'">
        <div class="alert-icon">${icon}</div>
        <div class="alert-content">
          <div class="alert-title">${alert.title}</div>
          <div class="alert-desc">${alert.description}</div>
          <div class="alert-meta">
            ${alert.areaName} > ${alert.zoneName} • ${timeAgo(alert.timestamp)}
          </div>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
}
