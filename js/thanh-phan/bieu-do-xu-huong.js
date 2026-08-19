// ============================================
// 🌱 TREND CHART COMPONENT (Canvas-based)
// ============================================

import { THRESHOLDS } from '../../du-lieu/nguong-canh-bao.js';

// Helper: đọc CSS variable từ DOM để hỗ trợ Light/Dark mode
function getCSSVar(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

export function renderTrendChart(containerId, data, category, sensorKey) {
  const container = document.getElementById(containerId);
  if (!container || !data || data.length === 0) return;

  // Xóa nội dung cũ
  container.innerHTML = `
    <div class="chart-container">
      <canvas id="${containerId}-canvas" class="chart-canvas"></canvas>
      <div id="${containerId}-tooltip" class="chart-tooltip hidden"></div>
    </div>
  `;

  const canvas = document.getElementById(`${containerId}-canvas`);
  const tooltip = document.getElementById(`${containerId}-tooltip`);
  const ctx = canvas.getContext('2d');

  // Set physical pixel resolution
  const rect = canvas.parentElement.getBoundingClientRect();
  canvas.width = rect.width * window.devicePixelRatio;
  canvas.height = rect.height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const width = rect.width;
  const height = rect.height;
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };

  // Đọc màu từ CSS variables (hỗ trợ cả light và dark mode)
  const textMutedColor = getCSSVar('--text-muted') || '#64748b';
  const gridLineColor = getCSSVar('--border-subtle') || 'rgba(0,0,0,0.06)';
  const accentColor = getCSSVar('--accent-primary') || '#10b981';
  const textPrimaryColor = getCSSVar('--text-primary') || '#0f172a';

  // Find min/max values for scaling
  let minVal = Math.min(...data.map(d => d.value));
  let maxVal = Math.max(...data.map(d => d.value));

  // Add some margin to the Y axis based on thresholds if available
  const threshold = THRESHOLDS[category]?.[sensorKey];
  if (threshold) {
    if (threshold.criticalLow !== undefined) minVal = Math.min(minVal, threshold.criticalLow - 5);
    if (threshold.criticalHigh !== undefined) maxVal = Math.max(maxVal, threshold.criticalHigh + 5);
  } else {
    const margin = (maxVal - minVal) * 0.2;
    minVal -= margin;
    maxVal += margin;
  }
  
  // Tránh chia cho 0
  if (maxVal === minVal) { maxVal += 1; minVal -= 1; }

  // Draw background grid & thresholds
  ctx.clearRect(0, 0, width, height);
  
  // Y-axis labels and grid lines
  ctx.fillStyle = textMutedColor;
  ctx.font = '11px Inter, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  
  const steps = 4;
  for (let i = 0; i <= steps; i++) {
    const val = minVal + (maxVal - minVal) * (i / steps);
    const y = height - padding.bottom - (i / steps) * (height - padding.top - padding.bottom);
    
    // Grid line — dùng CSS variable thay vì hardcode
    ctx.beginPath();
    ctx.strokeStyle = gridLineColor;
    ctx.lineWidth = 1;
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    
    // Text
    ctx.fillText(Math.round(val), padding.left - 8, y);
  }

  // X-axis labels (hiển thị vài mốc thời gian)
  ctx.fillStyle = textMutedColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  const xLabelInterval = Math.max(1, Math.floor(data.length / 6));
  for (let i = 0; i < data.length; i += xLabelInterval) {
    const x = padding.left + (i / (data.length - 1)) * (width - padding.left - padding.right);
    const timeStr = new Date(data[i].time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    ctx.fillText(timeStr, x, height - padding.bottom + 8);
  }

  // Draw Threshold lines
  if (threshold) {
    const drawThreshLine = (val, color) => {
      if (val === undefined || val < minVal || val > maxVal) return;
      const y = height - padding.bottom - ((val - minVal) / (maxVal - minVal)) * (height - padding.top - padding.bottom);
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    drawThreshLine(threshold.warningLow, 'rgba(245, 158, 11, 0.5)');
    drawThreshLine(threshold.warningHigh, 'rgba(245, 158, 11, 0.5)');
    drawThreshLine(threshold.criticalLow, 'rgba(239, 68, 68, 0.5)');
    drawThreshLine(threshold.criticalHigh, 'rgba(239, 68, 68, 0.5)');
  }

  // Draw Data Line — dùng accent color từ CSS
  ctx.beginPath();
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;
  
  const points = [];
  data.forEach((point, i) => {
    const x = padding.left + (i / (data.length - 1)) * (width - padding.left - padding.right);
    const y = height - padding.bottom - ((point.value - minVal) / (maxVal - minVal)) * (height - padding.top - padding.bottom);
    points.push({x, y, data: point});
    
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Draw Area under line
  ctx.lineTo(points[points.length-1].x, height - padding.bottom);
  ctx.lineTo(points[0].x, height - padding.bottom);
  ctx.closePath();
  
  const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
  gradient.addColorStop(0, accentColor.startsWith('#') 
    ? accentColor + '33' // ~20% opacity for hex
    : 'rgba(16, 185, 129, 0.2)');
  gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
  ctx.fillStyle = gradient;
  ctx.fill();

  // Interactive Tooltip (Hover effect)
  canvas.addEventListener('mousemove', (e) => {
    const canvasRect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - canvasRect.left;
    
    if (mouseX < padding.left || mouseX > width - padding.right) {
      tooltip.classList.add('hidden');
      return;
    }

    // Find closest point
    let closest = points[0];
    let minDist = Math.abs(mouseX - points[0].x);
    for (let i = 1; i < points.length; i++) {
      const dist = Math.abs(mouseX - points[i].x);
      if (dist < minDist) {
        minDist = dist;
        closest = points[i];
      }
    }

    tooltip.innerHTML = `
      <div class="font-bold">${closest.data.value}</div>
      <div class="text-muted">${new Date(closest.data.time).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</div>
    `;
    tooltip.style.left = `${closest.x + 10}px`;
    tooltip.style.top = `${closest.y - 20}px`;
    tooltip.classList.remove('hidden');
  });

  canvas.addEventListener('mouseleave', () => {
    tooltip.classList.add('hidden');
  });
}
