const fs = require('fs');
const path = require('path');

const renameMap = {
  'styles/index.css': 'css/giao-dien.css',
  'data/mock-data.js': 'du-lieu/du-lieu-mau.js',
  'data/thresholds.js': 'du-lieu/nguong-canh-bao.js',
  'js/app.js': 'js/ung-dung.js',
  'js/views/overview.js': 'js/giao-dien/tong-quan.js',
  'js/views/area-list.js': 'js/giao-dien/danh-sach-khu-vuc.js',
  'js/views/area-detail.js': 'js/giao-dien/chi-tiet-khu-vuc.js',
  'js/views/zone-detail.js': 'js/giao-dien/chi-tiet-vung-trong.js',
  'js/views/device-detail.js': 'js/giao-dien/chi-tiet-thiet-bi.js',
  'js/views/map-view.js': 'js/giao-dien/ban-do.js',
  'js/views/alerts-view.js': 'js/giao-dien/canh-bao.js',
  'js/components/sidebar.js': 'js/thanh-phan/thanh-dieu-huong.js',
  'js/components/breadcrumb.js': 'js/thanh-phan/duong-dan.js',
  'js/components/kpi-card.js': 'js/thanh-phan/the-thong-ke.js',
  'js/components/status-badge.js': 'js/thanh-phan/nhan-trang-thai.js',
  'js/components/sensor-gauge.js': 'js/thanh-phan/bieu-do-dong-ho.js',
  'js/components/trend-chart.js': 'js/thanh-phan/bieu-do-xu-huong.js',
  'js/components/alert-list.js': 'js/thanh-phan/danh-sach-canh-bao.js',
  'js/components/device-card.js': 'js/thanh-phan/the-thiet-bi.js',
  'js/utils/calculations.js': 'js/tien-ich/tinh-toan.js',
  'js/utils/formatters.js': 'js/tien-ich/dinh-dang.js'
};

const importMap = {
  '../../data/mock-data.js': '../../du-lieu/du-lieu-mau.js',
  '../../data/thresholds.js': '../../du-lieu/nguong-canh-bao.js',
  '../data/thresholds.js': '../du-lieu/nguong-canh-bao.js',
  '../data/mock-data.js': '../du-lieu/du-lieu-mau.js',
  '../utils/formatters.js': '../tien-ich/dinh-dang.js',
  '../utils/calculations.js': '../tien-ich/tinh-toan.js',
  '../components/status-badge.js': '../thanh-phan/nhan-trang-thai.js',
  '../components/sensor-gauge.js': '../thanh-phan/bieu-do-dong-ho.js',
  '../components/trend-chart.js': '../thanh-phan/bieu-do-xu-huong.js',
  '../components/device-card.js': '../thanh-phan/the-thiet-bi.js',
  '../components/alert-list.js': '../thanh-phan/danh-sach-canh-bao.js',
  '../components/kpi-card.js': '../thanh-phan/the-thong-ke.js',
  './components/sidebar.js': './thanh-phan/thanh-dieu-huong.js',
  './components/breadcrumb.js': './thanh-phan/duong-dan.js',
  './views/overview.js': './giao-dien/tong-quan.js',
  './views/area-list.js': './giao-dien/danh-sach-khu-vuc.js',
  './views/area-detail.js': './giao-dien/chi-tiet-khu-vuc.js',
  './views/zone-detail.js': './giao-dien/chi-tiet-vung-trong.js',
  './views/device-detail.js': './giao-dien/chi-tiet-thiet-bi.js',
  './views/map-view.js': './giao-dien/ban-do.js',
  './views/alerts-view.js': './giao-dien/canh-bao.js',
  './styles/index.css': './css/giao-dien.css',
  './js/app.js': './js/ung-dung.js'
};

const root = __dirname;

// Create new directories
const newDirs = new Set(Object.values(renameMap).map(p => path.dirname(path.join(root, p))));
newDirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Process and move JS/CSS files
for (const [oldRel, newRel] of Object.entries(renameMap)) {
  const oldPath = path.join(root, oldRel);
  const newPath = path.join(root, newRel);
  if (fs.existsSync(oldPath)) {
    let content = fs.readFileSync(oldPath, 'utf8');
    for (const [oldImport, newImport] of Object.entries(importMap)) {
      content = content.split(oldImport).join(newImport);
    }
    fs.writeFileSync(newPath, content);
    fs.unlinkSync(oldPath);
  }
}

// Process index.html
const indexPath = path.join(root, 'index.html');
if (fs.existsSync(indexPath)) {
  let content = fs.readFileSync(indexPath, 'utf8');
  for (const [oldImport, newImport] of Object.entries(importMap)) {
    content = content.split(oldImport).join(newImport);
  }
  fs.writeFileSync(indexPath, content);
}

console.log("Renaming done.");
