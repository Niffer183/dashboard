// ============================================
// 🌱 VIEW: DEVICE DETAIL
// ============================================

import { DEVICES, ZONES } from '../../du-lieu/du-lieu-mau.js';
import { renderStatusBadge } from '../thanh-phan/nhan-trang-thai.js';
import { formatDateTime, timeAgo } from '../tien-ich/dinh-dang.js';

export function initDeviceDetail(container, params) {
  const deviceId = params.id;
  const device = DEVICES.find(d => d.id === deviceId);
  
  if (!device) {
    container.innerHTML = `<div class="empty-state">Thiết bị không tồn tại</div>`;
    return;
  }

  const zone = ZONES.find(z => z.id === device.zoneId);

  window.appState.updateHeader(`Thiết bị: ${device.id}`);
  window.appState.renderBreadcrumb([
    { label: 'Hệ thống', url: '#/overview' },
    { label: zone ? zone.name : 'Unknown Zone', url: `#/zone/${device.zoneId}` },
    { label: device.id, icon: '📡' }
  ]);

  const statusClass = device.online ? 'ok' : 'offline';

  let html = `
    <button class="back-btn" onclick="window.history.back()">
      ← Quay lại
    </button>

    <div class="grid-2 gap-6 section">
      
      <!-- Device Info -->
      <div class="card animate-slide-up stagger-1">
        <div class="card-header">
          <h2 class="card-title">Thông tin Thiết bị</h2>
          ${renderStatusBadge(statusClass)}
        </div>
        
        <div class="flex-col gap-3 mt-4">
          <div class="flex justify-between border-b border-subtle pb-2">
            <span class="text-secondary">Loại thiết bị</span>
            <span class="text-primary font-bold">${device.type}</span>
          </div>
          <div class="flex justify-between border-b border-subtle pb-2">
            <span class="text-secondary">Gateway</span>
            <span class="text-primary">${device.gateway}</span>
          </div>
          <div class="flex justify-between border-b border-subtle pb-2">
            <span class="text-secondary">Firmware</span>
            <span class="text-primary">${device.firmware}</span>
          </div>
          <div class="flex justify-between border-b border-subtle pb-2">
            <span class="text-secondary">Ngày hiệu chuẩn</span>
            <span class="text-primary">${device.calibrationDate}</span>
          </div>
        </div>
      </div>

      <!-- Network & Power -->
      <div class="card animate-slide-up stagger-2">
        <div class="card-header">
          <h2 class="card-title">Mạng & Năng lượng</h2>
        </div>
        
        <div class="flex-col gap-3 mt-4">
          <div class="flex justify-between border-b border-subtle pb-2">
            <span class="text-secondary">Cập nhật cuối</span>
            <span class="text-primary">${timeAgo(device.lastSeen)} <span class="text-muted text-xs">(${formatDateTime(device.lastSeen)})</span></span>
          </div>
          <div class="flex justify-between border-b border-subtle pb-2">
            <span class="text-secondary">Mức pin</span>
            <span class="font-bold ${device.battery < 20 ? 'text-critical' : 'text-primary'}">
              ${device.battery}% 🔋
            </span>
          </div>
          <div class="flex justify-between border-b border-subtle pb-2">
            <span class="text-secondary">Tín hiệu (RSSI)</span>
            <span class="font-bold ${device.signal < -90 ? 'text-critical' : 'text-primary'}">
              ${device.signal} dBm 📶
            </span>
          </div>
          <div class="flex justify-between border-b border-subtle pb-2">
            <span class="text-secondary">Chất lượng dữ liệu</span>
            <span class="text-primary">${device.dataQuality}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;
}
