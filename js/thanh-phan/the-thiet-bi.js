// ============================================
// 🌱 DEVICE CARD COMPONENT
// ============================================

import { timeAgo } from '../tien-ich/dinh-dang.js';

export function renderDeviceCard(device) {
  const statusClass = device.online ? 'online' : 'offline';
  const statusText = device.online ? 'Online' : 'Offline';
  
  return `
    <div class="device-card" onclick="window.location.hash='#/device/${device.id}'">
      <div class="device-status-indicator device-status-indicator--${statusClass}"></div>
      
      <div class="device-info">
        <div class="device-name">${device.type}</div>
        <div class="device-meta">
          <span>ID: ${device.id}</span>
          <span>•</span>
          <span>${device.online ? `Tín hiệu: ${device.signal}dBm` : `Last seen: ${timeAgo(device.lastSeen)}`}</span>
        </div>
      </div>
      
      <div class="device-battery-info">
        <div class="text-sm font-bold ${device.battery < 20 ? 'text-critical' : 'text-primary'}">
          ${device.battery}% 🔋
        </div>
        <div class="text-xs text-muted mt-1">${statusText}</div>
      </div>
    </div>
  `;
}
