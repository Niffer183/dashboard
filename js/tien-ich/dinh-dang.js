// ============================================
// 🌱 FORMATTERS — Agriculture Management Dashboard
// Các hàm định dạng hiển thị
// ============================================

/**
 * Format số lượng có dấu phẩy phân cách hàng nghìn
 */
export function formatNumber(num) {
  return new Intl.NumberFormat('vi-VN').format(num);
}

/**
 * Format ngày tháng năm (DD/MM/YYYY)
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Format giờ phút (HH:mm)
 */
export function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format ngày giờ (DD/MM/YYYY HH:mm)
 */
export function formatDateTime(dateString) {
  return `${formatDate(dateString)} ${formatTime(dateString)}`;
}

/**
 * Thời gian tương đối (VD: 5 phút trước, 2 giờ trước)
 */
export function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' năm trước';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' tháng trước';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' ngày trước';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' giờ trước';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' phút trước';
  
  return 'Vừa xong';
}

/**
 * Lấy icon cho từng loại cảm biến
 */
export function getSensorIcon(sensorKey) {
  const icons = {
    moisture: '💧',
    temperature: '🌡',
    ph: '⚗️',
    humidity: '💨',
    rainfall: '🌧',
    solarRadiation: '☀️',
    windSpeed: '🌬'
  };
  return icons[sensorKey] || '📊';
}

/**
 * Translate label status to Vietnamese
 */
export function translateStatus(status) {
  const map = {
    ok: 'Bình thường',
    warning: 'Cần theo dõi',
    critical: 'Cảnh báo',
    offline: 'Mất kết nối'
  };
  return map[status] || status;
}
