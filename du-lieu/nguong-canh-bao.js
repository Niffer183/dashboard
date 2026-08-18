// ============================================
// 🌱 THRESHOLDS — Agriculture Management Dashboard
// Ngưỡng cảnh báo cho các loại cảm biến
// ============================================

export const THRESHOLDS = {
  soil: {
    moisture: {
      unit: '%',
      criticalLow: 30, // Cảnh báo đỏ (quá khô)
      warningLow: 40,  // Cảnh báo vàng (cần theo dõi)
      optimalMin: 45,  // Xanh (tối ưu)
      optimalMax: 70,  // Xanh (tối ưu)
      warningHigh: 80, // Cảnh báo vàng (hơi ướt)
      criticalHigh: 90 // Cảnh báo đỏ (ngập úng)
    },
    temperature: {
      unit: '°C',
      criticalLow: 15,
      warningLow: 20,
      optimalMin: 22,
      optimalMax: 30,
      warningHigh: 33,
      criticalHigh: 38
    },
    ph: {
      unit: '',
      criticalLow: 5.0,
      warningLow: 5.5,
      optimalMin: 6.0,
      optimalMax: 6.8,
      warningHigh: 7.5,
      criticalHigh: 8.0
    }
  },
  air: {
    temperature: {
      unit: '°C',
      criticalLow: 10,
      warningLow: 18,
      optimalMin: 20,
      optimalMax: 32,
      warningHigh: 35,
      criticalHigh: 40
    },
    humidity: {
      unit: '%',
      criticalLow: 40,
      warningLow: 50,
      optimalMin: 60,
      optimalMax: 80,
      warningHigh: 85,
      criticalHigh: 95
    }
  },
  weather: {
    windSpeed: {
      unit: 'm/s',
      warningHigh: 10,
      criticalHigh: 15
    },
    solarRadiation: {
      unit: 'W/m²',
      warningLow: 300,
      warningHigh: 1000
    }
  }
};

/**
 * Đánh giá trạng thái của một giá trị dựa trên ngưỡng
 * @param {string} category (soil, air, weather)
 * @param {string} sensor (moisture, temperature, ...)
 * @param {number} value Giá trị cần đánh giá
 * @returns {string} 'ok', 'warning', 'critical'
 */
export function evaluateStatus(category, sensor, value) {
  const threshold = THRESHOLDS[category]?.[sensor];
  if (!threshold) return 'ok';

  if (threshold.criticalLow !== undefined && value <= threshold.criticalLow) return 'critical';
  if (threshold.criticalHigh !== undefined && value >= threshold.criticalHigh) return 'critical';
  
  if (threshold.warningLow !== undefined && value <= threshold.warningLow) return 'warning';
  if (threshold.warningHigh !== undefined && value >= threshold.warningHigh) return 'warning';

  return 'ok';
}
