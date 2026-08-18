// ============================================
// 🌱 MOCK DATA — Agriculture Management Dashboard
// 5 nhóm dữ liệu mô phỏng
// ============================================

export const ORGANIZATION = {
  name: 'Tập đoàn Nông nghiệp Xanh',
  code: 'NAX',
};

// ──────────────────────────────────────────
// NHÓM 1: Dữ liệu Tổ chức / Không gian
// ──────────────────────────────────────────
export const AREAS = [
  {
    id: 'area-01',
    name: 'Khu vực Hải Phòng',
    location: 'Hải Phòng',
    gps: { lat: 20.8449, lng: 106.6881 },
    totalZones: 5,
    totalPlots: 14,
    totalDevices: 42,
    area_hectares: 120,
    status: 'ok',
  },
  {
    id: 'area-02',
    name: 'Khu vực Hà Nam',
    location: 'Hà Nam',
    gps: { lat: 20.5835, lng: 105.9230 },
    totalZones: 4,
    totalPlots: 11,
    totalDevices: 33,
    area_hectares: 95,
    status: 'warning',
  },
  {
    id: 'area-03',
    name: 'Khu vực Ninh Bình',
    location: 'Ninh Bình',
    gps: { lat: 20.2506, lng: 105.9745 },
    totalZones: 3,
    totalPlots: 8,
    totalDevices: 24,
    area_hectares: 75,
    status: 'ok',
  },
  {
    id: 'area-04',
    name: 'Khu vực Thái Bình',
    location: 'Thái Bình',
    gps: { lat: 20.4463, lng: 106.3366 },
    totalZones: 4,
    totalPlots: 12,
    totalDevices: 36,
    area_hectares: 110,
    status: 'critical',
  },
  {
    id: 'area-05',
    name: 'Khu vực Nam Định',
    location: 'Nam Định',
    gps: { lat: 20.4388, lng: 106.1621 },
    totalZones: 3,
    totalPlots: 9,
    totalDevices: 27,
    area_hectares: 85,
    status: 'ok',
  },
  {
    id: 'area-06',
    name: 'Khu vực Hưng Yên',
    location: 'Hưng Yên',
    gps: { lat: 20.6464, lng: 106.0511 },
    totalZones: 3,
    totalPlots: 10,
    totalDevices: 30,
    area_hectares: 70,
    status: 'ok',
  },
  {
    id: 'area-07',
    name: 'Khu vực Bắc Ninh',
    location: 'Bắc Ninh',
    gps: { lat: 21.1861, lng: 106.0763 },
    totalZones: 2,
    totalPlots: 6,
    totalDevices: 18,
    area_hectares: 50,
    status: 'warning',
  },
  {
    id: 'area-08',
    name: 'Khu vực Vĩnh Phúc',
    location: 'Vĩnh Phúc',
    gps: { lat: 21.3609, lng: 105.5474 },
    totalZones: 3,
    totalPlots: 9,
    totalDevices: 27,
    area_hectares: 80,
    status: 'ok',
  },
  {
    id: 'area-09',
    name: 'Khu vực Hải Dương',
    location: 'Hải Dương',
    gps: { lat: 20.9373, lng: 106.3146 },
    totalZones: 4,
    totalPlots: 11,
    totalDevices: 33,
    area_hectares: 90,
    status: 'ok',
  },
  {
    id: 'area-10',
    name: 'Khu vực Thanh Hoá',
    location: 'Thanh Hoá',
    gps: { lat: 19.8067, lng: 105.7852 },
    totalZones: 5,
    totalPlots: 15,
    totalDevices: 45,
    area_hectares: 130,
    status: 'ok',
  },
  {
    id: 'area-11',
    name: 'Khu vực Nghệ An',
    location: 'Nghệ An',
    gps: { lat: 18.6733, lng: 105.6922 },
    totalZones: 4,
    totalPlots: 10,
    totalDevices: 30,
    area_hectares: 100,
    status: 'offline',
  },
  {
    id: 'area-12',
    name: 'Khu vực Phú Thọ',
    location: 'Phú Thọ',
    gps: { lat: 21.4225, lng: 105.2300 },
    totalZones: 4,
    totalPlots: 11,
    totalDevices: 33,
    area_hectares: 88,
    status: 'ok',
  },
];

// ──────────────────────────────────────────
// ZONES (Vùng trồng)
// ──────────────────────────────────────────
export const ZONES = [
  // === Khu vực Hải Phòng ===
  { id: 'zone-hp-01', areaId: 'area-01', name: 'Vùng A', crop: 'Lúa', status: 'ok', area_hectares: 28, plotCount: 3 },
  { id: 'zone-hp-02', areaId: 'area-01', name: 'Vùng B', crop: 'Rau xanh', status: 'ok', area_hectares: 22, plotCount: 3 },
  { id: 'zone-hp-03', areaId: 'area-01', name: 'Vùng C', crop: 'Cà chua', status: 'critical', area_hectares: 24, plotCount: 3 },
  { id: 'zone-hp-04', areaId: 'area-01', name: 'Vùng D', crop: 'Dưa hấu', status: 'ok', area_hectares: 26, plotCount: 3 },
  { id: 'zone-hp-05', areaId: 'area-01', name: 'Vùng E', crop: 'Ngô', status: 'warning', area_hectares: 20, plotCount: 2 },

  // === Khu vực Hà Nam ===
  { id: 'zone-hn-01', areaId: 'area-02', name: 'Vùng A', crop: 'Lúa', status: 'ok', area_hectares: 25, plotCount: 3 },
  { id: 'zone-hn-02', areaId: 'area-02', name: 'Vùng B', crop: 'Khoai lang', status: 'warning', area_hectares: 22, plotCount: 3 },
  { id: 'zone-hn-03', areaId: 'area-02', name: 'Vùng C', crop: 'Rau muống', status: 'ok', area_hectares: 24, plotCount: 3 },
  { id: 'zone-hn-04', areaId: 'area-02', name: 'Vùng D', crop: 'Đậu tương', status: 'warning', area_hectares: 24, plotCount: 2 },

  // === Khu vực Ninh Bình ===
  { id: 'zone-nb-01', areaId: 'area-03', name: 'Vùng A', crop: 'Lúa', status: 'ok', area_hectares: 30, plotCount: 3 },
  { id: 'zone-nb-02', areaId: 'area-03', name: 'Vùng B', crop: 'Ngô', status: 'ok', area_hectares: 25, plotCount: 3 },
  { id: 'zone-nb-03', areaId: 'area-03', name: 'Vùng C', crop: 'Dưa lê', status: 'ok', area_hectares: 20, plotCount: 2 },

  // === Khu vực Thái Bình ===
  { id: 'zone-tb-01', areaId: 'area-04', name: 'Vùng A', crop: 'Lúa', status: 'ok', area_hectares: 30, plotCount: 3 },
  { id: 'zone-tb-02', areaId: 'area-04', name: 'Vùng B', crop: 'Hành', status: 'critical', area_hectares: 28, plotCount: 3 },
  { id: 'zone-tb-03', areaId: 'area-04', name: 'Vùng C', crop: 'Cải bắp', status: 'warning', area_hectares: 26, plotCount: 3 },
  { id: 'zone-tb-04', areaId: 'area-04', name: 'Vùng D', crop: 'Bí ngô', status: 'ok', area_hectares: 26, plotCount: 3 },

  // === Khu vực Nam Định ===
  { id: 'zone-nd-01', areaId: 'area-05', name: 'Vùng A', crop: 'Lúa', status: 'ok', area_hectares: 30, plotCount: 3 },
  { id: 'zone-nd-02', areaId: 'area-05', name: 'Vùng B', crop: 'Lạc', status: 'ok', area_hectares: 28, plotCount: 3 },
  { id: 'zone-nd-03', areaId: 'area-05', name: 'Vùng C', crop: 'Khoai tây', status: 'ok', area_hectares: 27, plotCount: 3 },

  // === Khu vực Hưng Yên ===
  { id: 'zone-hy-01', areaId: 'area-06', name: 'Vùng A', crop: 'Nhãn', status: 'ok', area_hectares: 25, plotCount: 3 },
  { id: 'zone-hy-02', areaId: 'area-06', name: 'Vùng B', crop: 'Vải', status: 'ok', area_hectares: 23, plotCount: 4 },
  { id: 'zone-hy-03', areaId: 'area-06', name: 'Vùng C', crop: 'Cam', status: 'warning', area_hectares: 22, plotCount: 3 },

  // === Khu vực Bắc Ninh ===
  { id: 'zone-bn-01', areaId: 'area-07', name: 'Vùng A', crop: 'Lúa', status: 'warning', area_hectares: 28, plotCount: 3 },
  { id: 'zone-bn-02', areaId: 'area-07', name: 'Vùng B', crop: 'Rau', status: 'ok', area_hectares: 22, plotCount: 3 },

  // === Khu vực Vĩnh Phúc ===
  { id: 'zone-vp-01', areaId: 'area-08', name: 'Vùng A', crop: 'Chè', status: 'ok', area_hectares: 28, plotCount: 3 },
  { id: 'zone-vp-02', areaId: 'area-08', name: 'Vùng B', crop: 'Thanh long', status: 'ok', area_hectares: 26, plotCount: 3 },
  { id: 'zone-vp-03', areaId: 'area-08', name: 'Vùng C', crop: 'Bưởi', status: 'ok', area_hectares: 26, plotCount: 3 },

  // === Khu vực Hải Dương ===
  { id: 'zone-hd-01', areaId: 'area-09', name: 'Vùng A', crop: 'Vải thiều', status: 'ok', area_hectares: 24, plotCount: 3 },
  { id: 'zone-hd-02', areaId: 'area-09', name: 'Vùng B', crop: 'Lúa', status: 'ok', area_hectares: 22, plotCount: 3 },
  { id: 'zone-hd-03', areaId: 'area-09', name: 'Vùng C', crop: 'Cà rốt', status: 'ok', area_hectares: 22, plotCount: 2 },
  { id: 'zone-hd-04', areaId: 'area-09', name: 'Vùng D', crop: 'Hành tây', status: 'ok', area_hectares: 22, plotCount: 3 },

  // === Khu vực Thanh Hoá ===
  { id: 'zone-th-01', areaId: 'area-10', name: 'Vùng A', crop: 'Mía', status: 'ok', area_hectares: 28, plotCount: 3 },
  { id: 'zone-th-02', areaId: 'area-10', name: 'Vùng B', crop: 'Lúa', status: 'ok', area_hectares: 26, plotCount: 3 },
  { id: 'zone-th-03', areaId: 'area-10', name: 'Vùng C', crop: 'Ngô', status: 'ok', area_hectares: 26, plotCount: 3 },
  { id: 'zone-th-04', areaId: 'area-10', name: 'Vùng D', crop: 'Sắn', status: 'ok', area_hectares: 26, plotCount: 3 },
  { id: 'zone-th-05', areaId: 'area-10', name: 'Vùng E', crop: 'Cam', status: 'ok', area_hectares: 24, plotCount: 3 },

  // === Khu vực Nghệ An ===
  { id: 'zone-na-01', areaId: 'area-11', name: 'Vùng A', crop: 'Cam', status: 'offline', area_hectares: 28, plotCount: 3 },
  { id: 'zone-na-02', areaId: 'area-11', name: 'Vùng B', crop: 'Chè', status: 'offline', area_hectares: 24, plotCount: 2 },
  { id: 'zone-na-03', areaId: 'area-11', name: 'Vùng C', crop: 'Lúa', status: 'ok', area_hectares: 24, plotCount: 3 },
  { id: 'zone-na-04', areaId: 'area-11', name: 'Vùng D', crop: 'Lạc', status: 'ok', area_hectares: 24, plotCount: 2 },

  // === Khu vực Phú Thọ ===
  { id: 'zone-pt-01', areaId: 'area-12', name: 'Vùng A', crop: 'Chè', status: 'ok', area_hectares: 24, plotCount: 3 },
  { id: 'zone-pt-02', areaId: 'area-12', name: 'Vùng B', crop: 'Bưởi', status: 'ok', area_hectares: 22, plotCount: 3 },
  { id: 'zone-pt-03', areaId: 'area-12', name: 'Vùng C', crop: 'Lúa', status: 'ok', area_hectares: 22, plotCount: 2 },
  { id: 'zone-pt-04', areaId: 'area-12', name: 'Vùng D', crop: 'Ngô', status: 'ok', area_hectares: 20, plotCount: 3 },
];

// ──────────────────────────────────────────
// NHÓM 2: Dữ liệu Cây trồng
// ──────────────────────────────────────────
export const CROP_DETAILS = {
  'zone-hp-01': { cropType: 'Lúa', variety: 'BC15', season: 'Vụ Mùa 2026', plantDate: '15/06/2026', expectedHarvest: '20/10/2026', area: 28, growthStage: 'Đẻ nhánh', stageProgress: 40 },
  'zone-hp-02': { cropType: 'Rau xanh', variety: 'Cải ngọt F1', season: 'Liên tục', plantDate: '01/08/2026', expectedHarvest: '15/09/2026', area: 22, growthStage: 'Sinh trưởng', stageProgress: 55 },
  'zone-hp-03': { cropType: 'Cà chua', variety: 'Savior F1', season: 'Vụ Thu 2026', plantDate: '01/07/2026', expectedHarvest: '15/10/2026', area: 24, growthStage: 'Ra hoa', stageProgress: 60 },
  'zone-hp-04': { cropType: 'Dưa hấu', variety: 'Hắc Mỹ Nhân', season: 'Vụ Hè 2026', plantDate: '20/05/2026', expectedHarvest: '10/08/2026', area: 26, growthStage: 'Quả chín', stageProgress: 90 },
  'zone-hp-05': { cropType: 'Ngô', variety: 'NK7328', season: 'Vụ Hè Thu', plantDate: '10/06/2026', expectedHarvest: '20/09/2026', area: 20, growthStage: 'Trổ cờ', stageProgress: 65 },
  'zone-hn-01': { cropType: 'Lúa', variety: 'Bắc Thơm 7', season: 'Vụ Mùa 2026', plantDate: '20/06/2026', expectedHarvest: '25/10/2026', area: 25, growthStage: 'Đẻ nhánh', stageProgress: 35 },
  'zone-hn-02': { cropType: 'Khoai lang', variety: 'Nhật Bản', season: 'Vụ Đông', plantDate: '15/07/2026', expectedHarvest: '15/11/2026', area: 22, growthStage: 'Phát triển củ', stageProgress: 30 },
  'zone-hn-03': { cropType: 'Rau muống', variety: 'Hạt trắng', season: 'Liên tục', plantDate: '01/08/2026', expectedHarvest: '25/08/2026', area: 24, growthStage: 'Thu hoạch', stageProgress: 95 },
  'zone-hn-04': { cropType: 'Đậu tương', variety: 'DT84', season: 'Vụ Hè', plantDate: '01/06/2026', expectedHarvest: '15/09/2026', area: 24, growthStage: 'Ra hoa', stageProgress: 55 },
  'zone-tb-01': { cropType: 'Lúa', variety: 'TBR225', season: 'Vụ Mùa 2026', plantDate: '10/06/2026', expectedHarvest: '15/10/2026', area: 30, growthStage: 'Đứng cái', stageProgress: 50 },
  'zone-tb-02': { cropType: 'Hành', variety: 'Hành tím', season: 'Vụ Đông', plantDate: '01/07/2026', expectedHarvest: '01/10/2026', area: 28, growthStage: 'Phình củ', stageProgress: 70 },
  'zone-tb-03': { cropType: 'Cải bắp', variety: 'KK Cross', season: 'Vụ Đông', plantDate: '20/07/2026', expectedHarvest: '20/10/2026', area: 26, growthStage: 'Cuốn bắp', stageProgress: 45 },
  'zone-tb-04': { cropType: 'Bí ngô', variety: 'Bí đỏ Nhật', season: 'Vụ Hè Thu', plantDate: '01/06/2026', expectedHarvest: '01/09/2026', area: 26, growthStage: 'Quả lớn', stageProgress: 80 },
};

// ──────────────────────────────────────────
// NHÓM 3: Dữ liệu IoT (Sensor Readings)
// ──────────────────────────────────────────
function generateSensorData(baseValues, variance) {
  const result = {};
  for (const [key, base] of Object.entries(baseValues)) {
    result[key] = +(base + (Math.random() - 0.5) * variance * 2).toFixed(1);
  }
  return result;
}

function generateTimeSeries(baseValue, variance, points = 24) {
  const data = [];
  const now = Date.now();
  let val = baseValue;
  for (let i = points - 1; i >= 0; i--) {
    val += (Math.random() - 0.5) * variance;
    val = Math.max(0, val);
    data.push({
      time: new Date(now - i * 3600000).toISOString(),
      value: +val.toFixed(1),
    });
  }
  return data;
}

export function getSensorReadings(zoneId) {
  const profiles = {
    'zone-hp-03': { soil_moisture: 34.5, soil_temp: 28.1, soil_ph: 6.2, air_temp: 32.5, air_humidity: 78, rainfall: 0, solar_radiation: 640, wind_speed: 2.8 },
    'zone-tb-02': { soil_moisture: 28.0, soil_temp: 31.5, soil_ph: 5.8, air_temp: 35.2, air_humidity: 65, rainfall: 0, solar_radiation: 780, wind_speed: 3.5 },
    'zone-hp-05': { soil_moisture: 42.0, soil_temp: 26.5, soil_ph: 6.5, air_temp: 30.0, air_humidity: 72, rainfall: 2.5, solar_radiation: 520, wind_speed: 2.0 },
  };

  const base = profiles[zoneId] || {
    soil_moisture: 45 + Math.random() * 15,
    soil_temp: 25 + Math.random() * 4,
    soil_ph: 6.0 + Math.random() * 0.8,
    air_temp: 28 + Math.random() * 5,
    air_humidity: 70 + Math.random() * 15,
    rainfall: Math.random() > 0.7 ? +(Math.random() * 10).toFixed(1) : 0,
    solar_radiation: 400 + Math.random() * 300,
    wind_speed: 1 + Math.random() * 4,
  };

  return {
    soil: {
      moisture: { value: +base.soil_moisture.toFixed(1), unit: '%', label: 'Độ ẩm đất' },
      temperature: { value: +base.soil_temp.toFixed(1), unit: '°C', label: 'Nhiệt độ đất' },
      ph: { value: +base.soil_ph.toFixed(1), unit: '', label: 'pH' },
    },
    air: {
      temperature: { value: +base.air_temp.toFixed(1), unit: '°C', label: 'Nhiệt độ' },
      humidity: { value: +base.air_humidity.toFixed(1), unit: '%', label: 'Độ ẩm' },
    },
    weather: {
      rainfall: { value: +base.rainfall.toFixed(1), unit: 'mm', label: 'Lượng mưa' },
      solarRadiation: { value: +base.solar_radiation.toFixed(0), unit: 'W/m²', label: 'Bức xạ mặt trời' },
      windSpeed: { value: +base.wind_speed.toFixed(1), unit: 'm/s', label: 'Tốc độ gió' },
    },
    timestamp: new Date().toISOString(),
  };
}

export function getSensorTimeSeries(zoneId, sensorType) {
  const baseMap = {
    soil_moisture: { base: 45, variance: 3 },
    soil_temp: { base: 27, variance: 1.5 },
    soil_ph: { base: 6.3, variance: 0.2 },
    air_temp: { base: 30, variance: 2 },
    air_humidity: { base: 75, variance: 5 },
    rainfall: { base: 1, variance: 2 },
    solar_radiation: { base: 550, variance: 80 },
    wind_speed: { base: 2.5, variance: 1 },
  };
  const cfg = baseMap[sensorType] || { base: 50, variance: 5 };
  return generateTimeSeries(cfg.base, cfg.variance);
}

// ──────────────────────────────────────────
// NHÓM 4: Dữ liệu Vận hành
// ──────────────────────────────────────────
export const OPERATIONS = [
  { id: 'op-001', type: 'irrigation', zoneId: 'zone-hp-03', date: '18/08/2026 06:30', details: 'Tưới nhỏ giọt 30 phút', quantity: '15m³', method: 'Nhỏ giọt' },
  { id: 'op-002', type: 'fertilizer', zoneId: 'zone-hp-03', date: '15/08/2026 07:00', details: 'Bón NPK 20-20-15', quantity: '50kg/ha', method: 'Rải gốc' },
  { id: 'op-003', type: 'pesticide', zoneId: 'zone-hp-03', date: '12/08/2026 16:00', details: 'Phun thuốc trừ sâu Amitraz', quantity: '2L/ha', method: 'Phun' },
  { id: 'op-004', type: 'irrigation', zoneId: 'zone-hp-01', date: '18/08/2026 05:00', details: 'Tưới tràn ruộng lúa', quantity: '200m³', method: 'Tưới tràn' },
  { id: 'op-005', type: 'fertilizer', zoneId: 'zone-tb-02', date: '17/08/2026 06:30', details: 'Bón Kali 60', quantity: '30kg/ha', method: 'Rải gốc' },
  { id: 'op-006', type: 'harvest', zoneId: 'zone-hp-04', date: '10/08/2026 07:00', details: 'Thu hoạch dưa hấu đợt 1', quantity: '12 tấn', method: 'Thủ công' },
  { id: 'op-007', type: 'irrigation', zoneId: 'zone-hn-02', date: '17/08/2026 17:00', details: 'Tưới phun mưa', quantity: '25m³', method: 'Phun mưa' },
  { id: 'op-008', type: 'fertilizer', zoneId: 'zone-hp-02', date: '16/08/2026 06:00', details: 'Bón phân hữu cơ vi sinh', quantity: '100kg/ha', method: 'Rải đều' },
];

// ──────────────────────────────────────────
// NHÓM 5: Trạng thái Thiết bị
// ──────────────────────────────────────────
let deviceCounter = 0;
function createDevice(zoneId, type, online, extras = {}) {
  deviceCounter++;
  const id = `DEV-${String(deviceCounter).padStart(4, '0')}`;
  return {
    id,
    type,
    zoneId,
    gateway: `GW-${zoneId.split('-')[1].toUpperCase()}`,
    online,
    lastSeen: online
      ? new Date(Date.now() - Math.floor(Math.random() * 300000)).toISOString()
      : new Date(Date.now() - Math.floor(Math.random() * 86400000 * 3)).toISOString(),
    battery: online ? Math.floor(60 + Math.random() * 40) : Math.floor(5 + Math.random() * 30),
    signal: online ? Math.floor(-45 - Math.random() * 30) : Math.floor(-85 - Math.random() * 15),
    firmware: 'v2.4.1',
    calibrationDate: '01/07/2026',
    dataQuality: online ? (Math.random() > 0.15 ? 'Tốt' : 'Trung bình') : 'Không xác định',
    ...extras,
  };
}

export const DEVICES = [
  // zone-hp-03 (Cà chua - critical)
  createDevice('zone-hp-03', 'Cảm biến đất', true),
  createDevice('zone-hp-03', 'Cảm biến không khí', true),
  createDevice('zone-hp-03', 'Trạm thời tiết', false, { lastSeen: '2026-08-16T10:32:15Z', battery: 12, signal: -92, dataQuality: 'Không xác định' }),

  // zone-hp-01
  createDevice('zone-hp-01', 'Cảm biến đất', true),
  createDevice('zone-hp-01', 'Cảm biến không khí', true),
  createDevice('zone-hp-01', 'Trạm thời tiết', true),

  // zone-hp-02
  createDevice('zone-hp-02', 'Cảm biến đất', true),
  createDevice('zone-hp-02', 'Cảm biến không khí', true),
  createDevice('zone-hp-02', 'Trạm thời tiết', true),

  // zone-hp-04
  createDevice('zone-hp-04', 'Cảm biến đất', true),
  createDevice('zone-hp-04', 'Cảm biến không khí', true),
  createDevice('zone-hp-04', 'Trạm thời tiết', true),

  // zone-hp-05
  createDevice('zone-hp-05', 'Cảm biến đất', true),
  createDevice('zone-hp-05', 'Cảm biến không khí', true),

  // zone-tb-02 (Hành - critical)
  createDevice('zone-tb-02', 'Cảm biến đất', true),
  createDevice('zone-tb-02', 'Cảm biến không khí', true),
  createDevice('zone-tb-02', 'Trạm thời tiết', true),

  // zone-hn-02 (warning)
  createDevice('zone-hn-02', 'Cảm biến đất', true),
  createDevice('zone-hn-02', 'Cảm biến không khí', false, { lastSeen: '2026-08-17T22:10:00Z', battery: 8, signal: -95 }),

  // zone-na-01 (offline)
  createDevice('zone-na-01', 'Cảm biến đất', false, { lastSeen: '2026-08-15T08:00:00Z', battery: 3, signal: -98 }),
  createDevice('zone-na-01', 'Cảm biến không khí', false, { lastSeen: '2026-08-15T08:05:00Z', battery: 5, signal: -96 }),
  createDevice('zone-na-01', 'Trạm thời tiết', false, { lastSeen: '2026-08-15T07:50:00Z', battery: 2, signal: -99 }),
];

// ──────────────────────────────────────────
// ALERTS (Cảnh báo) - Generated from data
// ──────────────────────────────────────────
export const ALERTS = [
  { id: 'alert-01', severity: 'critical', zoneId: 'zone-hp-03', zoneName: 'Vùng C', areaName: 'Hải Phòng', title: 'Độ ẩm đất thấp — 34.5%', description: 'Độ ẩm đất dưới ngưỡng tối thiểu (40%). Cần tưới ngay cho khu vực Cà chua.', timestamp: '2026-08-18T10:30:00Z', sensorType: 'soil_moisture' },
  { id: 'alert-02', severity: 'critical', zoneId: 'zone-tb-02', zoneName: 'Vùng B', areaName: 'Thái Bình', title: 'Nhiệt độ không khí cao — 35.2°C', description: 'Nhiệt độ vượt ngưỡng an toàn (33°C). Ảnh hưởng đến hành tím đang phình củ.', timestamp: '2026-08-18T10:15:00Z', sensorType: 'air_temp' },
  { id: 'alert-03', severity: 'critical', zoneId: 'zone-na-01', zoneName: 'Vùng A', areaName: 'Nghệ An', title: '3 thiết bị mất kết nối', description: 'Toàn bộ sensor tại Vùng A - Nghệ An đã offline hơn 72 giờ.', timestamp: '2026-08-15T08:00:00Z', sensorType: 'device' },
  { id: 'alert-04', severity: 'warning', zoneId: 'zone-hp-05', zoneName: 'Vùng E', areaName: 'Hải Phòng', title: 'pH đất thấp — 5.6', description: 'pH đất giảm dưới ngưỡng tối ưu (6.0). Cần kiểm tra và bón vôi.', timestamp: '2026-08-18T09:45:00Z', sensorType: 'soil_ph' },
  { id: 'alert-05', severity: 'warning', zoneId: 'zone-hn-02', zoneName: 'Vùng B', areaName: 'Hà Nam', title: 'Sensor không khí mất dữ liệu', description: 'Cảm biến không khí (DEV-0019) tại Vùng B đã offline 14 giờ.', timestamp: '2026-08-17T22:10:00Z', sensorType: 'device' },
  { id: 'alert-06', severity: 'warning', zoneId: 'zone-tb-03', zoneName: 'Vùng C', areaName: 'Thái Bình', title: 'Độ ẩm không khí cao — 88%', description: 'Độ ẩm không khí cao, nguy cơ nấm bệnh cho cải bắp.', timestamp: '2026-08-18T08:20:00Z', sensorType: 'air_humidity' },
  { id: 'alert-07', severity: 'warning', zoneId: 'zone-hy-03', zoneName: 'Vùng C', areaName: 'Hưng Yên', title: 'Bức xạ mặt trời yếu liên tục 3 ngày', description: 'Bức xạ mặt trời trung bình dưới 350 W/m². Ảnh hưởng quang hợp cam.', timestamp: '2026-08-18T07:00:00Z', sensorType: 'solar_radiation' },
  { id: 'alert-08', severity: 'warning', zoneId: 'zone-bn-01', zoneName: 'Vùng A', areaName: 'Bắc Ninh', title: 'Lượng mưa tích lũy cao — 85mm/3 ngày', description: 'Lượng mưa tích lũy 3 ngày đã vượt 80mm. Kiểm tra ngập úng ruộng lúa.', timestamp: '2026-08-18T06:30:00Z', sensorType: 'rainfall' },
  { id: 'alert-09', severity: 'info', zoneId: 'zone-hp-04', zoneName: 'Vùng D', areaName: 'Hải Phòng', title: 'Dưa hấu sắp đến kỳ thu hoạch', description: 'Giai đoạn Quả chín (90%). Dự kiến thu hoạch 10/08/2026.', timestamp: '2026-08-18T06:00:00Z', sensorType: 'crop' },
];

// ──────────────────────────────────────────
// SUMMARY HELPERS
// ──────────────────────────────────────────
export function getSystemSummary() {
  const totalAreas = AREAS.length;
  const totalZones = ZONES.length;
  const totalPlots = ZONES.reduce((sum, z) => sum + z.plotCount, 0);
  const totalDevices = DEVICES.length;

  const statusCount = { ok: 0, warning: 0, critical: 0, offline: 0 };
  ZONES.forEach(z => { statusCount[z.status] = (statusCount[z.status] || 0) + 1; });

  const onlineDevices = DEVICES.filter(d => d.online).length;
  const offlineDevices = totalDevices - onlineDevices;

  const totalHectares = AREAS.reduce((sum, a) => sum + a.area_hectares, 0);

  return {
    totalAreas,
    totalZones,
    totalPlots,
    totalDevices,
    statusCount,
    onlineDevices,
    offlineDevices,
    totalHectares,
    criticalAlerts: ALERTS.filter(a => a.severity === 'critical').length,
    warningAlerts: ALERTS.filter(a => a.severity === 'warning').length,
  };
}

export function getZonesByArea(areaId) {
  return ZONES.filter(z => z.areaId === areaId);
}

export function getDevicesByZone(zoneId) {
  return DEVICES.filter(d => d.zoneId === zoneId);
}

export function getOperationsByZone(zoneId) {
  return OPERATIONS.filter(o => o.zoneId === zoneId);
}

export function getAlertsByZone(zoneId) {
  return ALERTS.filter(a => a.zoneId === zoneId);
}

export function getAlertsByArea(areaId) {
  const zoneIds = ZONES.filter(z => z.areaId === areaId).map(z => z.id);
  return ALERTS.filter(a => zoneIds.includes(a.zoneId));
}

// ──────────────────────────────────────────
// ENV OVERVIEW AVERAGES
// ──────────────────────────────────────────
export function getEnvironmentOverview() {
  return {
    soilMoisture: { avg: 47.2, min: 28.0, max: 68.5, unit: '%', label: 'Độ ẩm đất', icon: '💧' },
    soilTemp: { avg: 27.4, min: 24.0, max: 31.5, unit: '°C', label: 'Nhiệt độ đất', icon: '🌡' },
    soilPH: { avg: 6.3, min: 5.6, max: 7.1, unit: '', label: 'pH đất', icon: '⚗️' },
    airTemp: { avg: 31.0, min: 27.5, max: 35.2, unit: '°C', label: 'Nhiệt độ KK', icon: '🌡' },
    airHumidity: { avg: 74.5, min: 62.0, max: 88.0, unit: '%', label: 'Độ ẩm KK', icon: '💨' },
    rainfall: { avg: 2.8, min: 0, max: 12.5, unit: 'mm', label: 'Lượng mưa', icon: '🌧' },
    solarRadiation: { avg: 560, min: 280, max: 780, unit: 'W/m²', label: 'Bức xạ MT', icon: '☀️' },
    windSpeed: { avg: 2.6, min: 0.8, max: 4.5, unit: 'm/s', label: 'Tốc độ gió', icon: '🌬' },
  };
}
