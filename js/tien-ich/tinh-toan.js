// ============================================
// 🌱 CALCULATIONS — Agriculture Management Dashboard
// Các chỉ số tính toán & phân tích
// ============================================

import { evaluateStatus } from '../../du-lieu/nguong-canh-bao.js';

/**
 * Tính toán xu hướng từ time series data
 * @param {Array} timeSeries Mảng dữ liệu {time, value}
 * @returns {Object} { trend: 'up'|'down'|'stable', percentageChange }
 */
export function calculateTrend(timeSeries) {
  if (!timeSeries || timeSeries.length < 2) return { trend: 'stable', percentageChange: 0 };
  
  const current = timeSeries[timeSeries.length - 1].value;
  const previous = timeSeries[0].value; // So sánh với điểm bắt đầu
  
  const diff = current - previous;
  const percentageChange = previous !== 0 ? (diff / previous) * 100 : 0;
  
  let trend = 'stable';
  if (percentageChange > 5) trend = 'up';
  else if (percentageChange < -5) trend = 'down';
  
  return {
    trend,
    percentageChange: +percentageChange.toFixed(1),
    diff: +diff.toFixed(1)
  };
}

/**
 * Tổng hợp trạng thái từ danh sách các giá trị
 */
export function aggregateStatus(statuses) {
  if (statuses.includes('critical')) return 'critical';
  if (statuses.includes('offline')) return 'offline';
  if (statuses.includes('warning')) return 'warning';
  return 'ok';
}

/**
 * Đánh giá trạng thái tổng thể của một thiết bị (dựa trên pin và signal)
 */
export function evaluateDeviceStatus(device) {
  if (!device.online) return 'offline';
  if (device.battery < 15 || device.signal < -90) return 'critical';
  if (device.battery < 30 || device.signal < -80) return 'warning';
  return 'ok';
}

/**
 * Đánh giá trạng thái của một khu trồng (Plot/Zone)
 * dựa trên tất cả các cảm biến của nó.
 */
export function evaluateZoneHealth(sensorReadings) {
  const statuses = [];
  
  // Kiểm tra soil
  if (sensorReadings.soil) {
    statuses.push(evaluateStatus('soil', 'moisture', sensorReadings.soil.moisture.value));
    statuses.push(evaluateStatus('soil', 'temperature', sensorReadings.soil.temperature.value));
    statuses.push(evaluateStatus('soil', 'ph', sensorReadings.soil.ph.value));
  }
  
  // Kiểm tra air
  if (sensorReadings.air) {
    statuses.push(evaluateStatus('air', 'temperature', sensorReadings.air.temperature.value));
    statuses.push(evaluateStatus('air', 'humidity', sensorReadings.air.humidity.value));
  }
  
  return aggregateStatus(statuses);
}
