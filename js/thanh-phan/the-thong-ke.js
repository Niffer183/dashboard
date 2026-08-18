// ============================================
// 🌱 KPI CARD COMPONENT
// ============================================

import { formatNumber } from '../tien-ich/dinh-dang.js';

export function renderKpiCard(type, value, label) {
  return `
    <div class="kpi-card kpi-card--${type} animate-slide-up">
      <div class="kpi-icon kpi-icon--${type}">
        ${getKpiIcon(type)}
      </div>
      <div class="kpi-value">${formatNumber(value)}</div>
      <div class="kpi-label">${label}</div>
    </div>
  `;
}

function getKpiIcon(type) {
  const icons = {
    areas: '🗺️',
    zones: '📍',
    plots: '🌱',
    devices: '📡'
  };
  return icons[type] || '📊';
}
