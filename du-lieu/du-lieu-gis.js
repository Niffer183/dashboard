// ============================================
// 🌱 DỮ LIỆU GIS NÔNG NGHIỆP — Precision Agriculture
// ============================================

// 1. Dữ liệu lô thửa (Farm Plots) - GeoJSON
export const FARM_PLOTS = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "plot-1",
        name: "Lô A1 - Trà xanh",
        area: "1.2 ha",
        crop: "Trà xanh (Oolong)",
        plantDate: "15/02/2026",
        status: "ok",
        history: [
          { date: "10/08/2026", action: "Bón phân hữu cơ", amount: "500kg" },
          { date: "01/08/2026", action: "Tưới nhỏ giọt", amount: "15m³" }
        ]
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [108.0051, 11.9405],
          [108.0062, 11.9405],
          [108.0062, 11.9396],
          [108.0051, 11.9396],
          [108.0051, 11.9405]
        ]]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "plot-2",
        name: "Lô A2 - Cà phê",
        area: "2.4 ha",
        crop: "Cà phê Robusta",
        plantDate: "10/04/2025",
        status: "warning",
        history: [
          { date: "12/08/2026", action: "Phun thuốc nấm", amount: "2L" },
          { date: "05/08/2026", action: "Tưới phun mưa", amount: "30m³" }
        ]
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [108.0065, 11.9405],
          [108.0080, 11.9405],
          [108.0080, 11.9390],
          [108.0065, 11.9390],
          [108.0065, 11.9405]
        ]]
      }
    }
  ]
};

// 2. Dữ liệu điểm đo Nông hóa (Soil Samples for Heatmap) - Tọa độ quanh Đà Lạt
// Giả lập điểm đo độ pH
export const SOIL_SAMPLES = {
  type: "FeatureCollection",
  features: []
};

// Tạo 50 điểm đo ngẫu nhiên trong phạm vi lô thửa để làm heatmap
for (let i = 0; i < 50; i++) {
  const lng = 108.005 + Math.random() * 0.003;
  const lat = 11.939 + Math.random() * 0.002;
  // Giả lập vùng phía Tây (lng nhỏ) pH thấp (tính axit cao)
  const isWest = lng < 108.0065;
  const phValue = isWest ? 4.5 + Math.random() : 6.0 + Math.random();

  SOIL_SAMPLES.features.push({
    type: "Feature",
    properties: {
      pH: phValue,
      // Tính weight cho heatmap: pH thấp (axit) sẽ có màu nóng báo động (weight cao), pH chuẩn (6-7) weight thấp
      weight: phValue < 5.5 ? 1.0 : 0.2 
    },
    geometry: {
      type: "Point",
      coordinates: [lng, lat]
    }
  });
}

// 3. Tọa độ trung tâm trang trại (Đà Lạt - Đồi chè Cầu Đất để có địa hình đồi núi rõ)
export const FARM_CENTER = [108.006, 11.9398]; 

// Ảnh NDVI giả lập (Sức khỏe cây trồng)
// URL ảnh giả lập phủ lên lô A1
export const NDVI_OVERLAY = {
  url: 'https://docs.mapbox.com/mapbox-gl-js/assets/radar.gif', // Dùng ảnh radar gif của mapbox để giả lập data biến thiên
  coordinates: [
    [108.0051, 11.9405], // top left
    [108.0062, 11.9405], // top right
    [108.0062, 11.9396], // bottom right
    [108.0051, 11.9396]  // bottom left
  ]
};
