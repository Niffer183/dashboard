// ============================================
// 🌪️ DỮ LIỆU THỜI TIẾT — Windy-style Weather Engine
// ============================================

/**
 * Xác định điều kiện thời tiết từ nhiệt độ + lượng mưa
 */
export function getWeatherCondition(temp, rainfall) {
  if (rainfall > 12) return { id: 'stormy', label: 'Giông bão', icon: '⛈', colors: ['#4A148C', '#6A1B9A'] };
  if (rainfall > 5) return { id: 'rainy', label: 'Mưa', icon: '🌧', colors: ['#1565C0', '#42A5F5'] };
  if (temp < 22 && rainfall < 2) return { id: 'foggy', label: 'Sương mù', icon: '🌫', colors: ['#546E7A', '#78909C'] };
  if (temp > 32) return { id: 'hot', label: 'Nắng nóng', icon: '☀️', colors: ['#FF6F00', '#FF8F00'] };
  if (temp > 28) return { id: 'sunny', label: 'Nắng nhẹ', icon: '🌤', colors: ['#FFB300', '#FDD835'] };
  return { id: 'cloudy', label: 'Ít mây', icon: '⛅', colors: ['#78909C', '#90A4AE'] };
}

/**
 * Trả về màu nhiệt độ liên tục (Windy-style)
 * Thang: xanh dương đậm → xanh lá → vàng → cam → đỏ
 */
export function getTemperatureColor(temp) {
  const stops = [
    { t: 16, r: 33, g: 150, b: 243 },   // #2196F3 — Lạnh
    { t: 20, r: 76, g: 175, b: 80 },    // #4CAF50 — Mát
    { t: 24, r: 139, g: 195, b: 74 },   // #8BC34A — Dễ chịu
    { t: 28, r: 255, g: 193, b: 7 },    // #FFC107 — Ấm
    { t: 32, r: 255, g: 152, b: 0 },    // #FF9800 — Nóng
    { t: 36, r: 244, g: 67, b: 54 },    // #F44336 — Rất nóng
  ];

  if (temp <= stops[0].t) return `rgb(${stops[0].r},${stops[0].g},${stops[0].b})`;
  if (temp >= stops[stops.length - 1].t) return `rgb(${stops[stops.length - 1].r},${stops[stops.length - 1].g},${stops[stops.length - 1].b})`;

  for (let i = 0; i < stops.length - 1; i++) {
    if (temp >= stops[i].t && temp < stops[i + 1].t) {
      const ratio = (temp - stops[i].t) / (stops[i + 1].t - stops[i].t);
      const r = Math.round(stops[i].r + (stops[i + 1].r - stops[i].r) * ratio);
      const g = Math.round(stops[i].g + (stops[i + 1].g - stops[i].g) * ratio);
      const b = Math.round(stops[i].b + (stops[i + 1].b - stops[i].b) * ratio);
      return `rgb(${r},${g},${b})`;
    }
  }
  return '#FFC107';
}

/**
 * Trả về màu lượng mưa (Windy-style)
 */
export function getRainfallColor(rainfall) {
  if (rainfall < 1) return 'rgba(200,200,200,0.1)';
  if (rainfall < 3) return 'rgba(100,181,246,0.4)';
  if (rainfall < 6) return 'rgba(66,165,245,0.55)';
  if (rainfall < 10) return 'rgba(30,136,229,0.7)';
  if (rainfall < 15) return 'rgba(21,101,192,0.8)';
  return 'rgba(74,20,140,0.85)';
}

/**
 * Sinh dữ liệu gió giả lập cho tỉnh
 * Trả về { angle (deg), speed (km/h) }
 */
export function generateWindForProvince(seedBase) {
  const x = Math.sin(seedBase * 7.13) * 10000;
  const rand = x - Math.floor(x);
  const angle = rand * 360; // 0-360 degrees
  const speed = 5 + rand * 35; // 5-40 km/h
  return { angle, speed };
}

/**
 * Sinh điểm heatmap dày từ dữ liệu tỉnh
 * Trả về mảng [lat, lng, intensity] cho leaflet.heat
 */
export function generateHeatmapPoints(provincesData) {
  const points = [];

  Object.values(provincesData).forEach(province => {
    const temp = province.env.temp;
    // Normalize nhiệt độ thành intensity 0-1
    const intensity = Math.max(0, Math.min(1, (temp - 16) / 20));

    // Điểm chính tại tâm tỉnh
    points.push([province.centerLat, province.centerLng, intensity]);

    // Sinh thêm điểm xung quanh để gradient mượt hơn
    const spread = 0.3;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const dist = spread * (0.5 + Math.random() * 0.5);
      points.push([
        province.centerLat + Math.sin(angle) * dist,
        province.centerLng + Math.cos(angle) * dist,
        intensity * (0.7 + Math.random() * 0.3)
      ]);
    }
  });

  return points;
}

/**
 * Sinh điểm rainfall heatmap
 */
export function generateRainfallHeatmapPoints(provincesData) {
  const points = [];

  Object.values(provincesData).forEach(province => {
    const rain = province.env.rainfall;
    if (rain < 1) return; // Bỏ qua vùng không mưa
    const intensity = Math.max(0, Math.min(1, rain / 20));

    points.push([province.centerLat, province.centerLng, intensity]);

    const spread = 0.35;
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const dist = spread * (0.4 + Math.random() * 0.6);
      points.push([
        province.centerLat + Math.sin(angle) * dist,
        province.centerLng + Math.cos(angle) * dist,
        intensity * (0.6 + Math.random() * 0.4)
      ]);
    }
  });

  return points;
}

/**
 * Sinh dữ liệu forecast 5 ngày (giả lập)
 */
export function generateForecast(baseTemp, baseRain) {
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const today = new Date().getDay();
  const forecast = [];

  for (let i = 0; i < 5; i++) {
    const dayIndex = (today + i) % 7;
    const tempVariation = (Math.random() - 0.5) * 4;
    const rainVariation = Math.random() * 8;
    const temp = baseTemp + tempVariation;
    const rain = Math.max(0, baseRain + rainVariation - 4);
    const condition = getWeatherCondition(temp, rain);

    forecast.push({
      day: i === 0 ? 'Hôm nay' : days[dayIndex],
      temp: Math.round(temp),
      tempMin: Math.round(temp - 2 - Math.random() * 2),
      rain: rain.toFixed(1),
      condition
    });
  }
  return forecast;
}

/**
 * Gradient cho legend bar
 */
export const TEMPERATURE_GRADIENT = 'linear-gradient(90deg, #2196F3, #4CAF50, #8BC34A, #FFC107, #FF9800, #F44336)';
export const RAINFALL_GRADIENT = 'linear-gradient(90deg, rgba(200,200,200,0.3), #64B5F6, #42A5F5, #1E88E5, #1565C0, #4A148C)';
export const WIND_GRADIENT = 'linear-gradient(90deg, #81C784, #66BB6A, #FFC107, #FF9800, #F44336, #B71C1C)';
