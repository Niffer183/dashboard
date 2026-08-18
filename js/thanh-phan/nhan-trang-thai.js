// ============================================
// 🌱 STATUS BADGE COMPONENT
// ============================================

import { translateStatus } from '../tien-ich/dinh-dang.js';

export function renderStatusBadge(status) {
  return `
    <div class="status-badge status-badge--${status}">
      <span class="status-dot status-dot--${status}"></span>
      ${translateStatus(status)}
    </div>
  `;
}

export function renderStatusDot(status) {
  return `<span class="status-dot status-dot--${status}" title="${translateStatus(status)}"></span>`;
}
