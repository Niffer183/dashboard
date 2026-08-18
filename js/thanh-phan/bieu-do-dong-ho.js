// ============================================
// 🌱 SENSOR GAUGE COMPONENT (SVG-based)
// ============================================

import { THRESHOLDS, evaluateStatus } from '../../du-lieu/nguong-canh-bao.js';

export function renderSensorGauge(sensorData, category, sensorKey) {
  const { value, unit, label } = sensorData;
  const status = evaluateStatus(category, sensorKey, value);
  
  // Lấy màu dừa theo status
  let color = 'var(--status-ok)';
  if (status === 'warning') color = 'var(--status-warning)';
  if (status === 'critical') color = 'var(--status-critical)';

  // Calculate SVG stroke dasharray (circle circumference)
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  
  // Lấy range từ threshold để tính phần trăm hiển thị trên vòng tròn
  const threshold = THRESHOLDS[category]?.[sensorKey] || { criticalLow: 0, criticalHigh: 100 };
  const min = threshold.criticalLow !== undefined ? threshold.criticalLow * 0.8 : 0;
  const max = threshold.criticalHigh !== undefined ? threshold.criticalHigh * 1.2 : 100;
  
  let percentage = (value - min) / (max - min);
  percentage = Math.max(0, Math.min(1, percentage)); // Clamp between 0 and 1
  
  // Cắt bớt phần dưới để tạo hình bán nguyệt hoặc 3/4 hình tròn
  // Ở đây dùng 3/4 hình tròn (75%)
  const strokeDasharray = `${circumference * 0.75} ${circumference * 0.25}`;
  const strokeDashoffset = circumference * 0.75 * (1 - percentage);

  return `
    <div class="gauge-container">
      <svg class="gauge-svg" viewBox="0 0 120 120">
        <!-- Background track -->
        <circle class="gauge-circle-bg" cx="60" cy="60" r="${radius}" 
                stroke-dasharray="${circumference * 0.75} ${circumference * 0.25}" 
                transform="rotate(135 60 60)" />
        
        <!-- Value track -->
        <circle class="gauge-circle-value" cx="60" cy="60" r="${radius}" 
                stroke="${color}"
                stroke-dasharray="${circumference * 0.75} ${circumference * 0.25}" 
                style="stroke-dashoffset: ${strokeDashoffset}px;"
                transform="rotate(135 60 60)" />
                
        <!-- Center Text -->
        <text x="60" y="55" class="gauge-text">${value}</text>
        <text x="60" y="75" class="gauge-label" style="font-size: 12px;">${unit}</text>
      </svg>
      <div class="gauge-label">${label}</div>
    </div>
  `;
}
