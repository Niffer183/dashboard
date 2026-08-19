// ============================================
// 🌱 EXPORT UTILITIES — CSV & PDF
// ============================================

/**
 * Xuất dữ liệu ra file CSV
 * @param {Array<Object>} data - Mảng dữ liệu
 * @param {string} filename - Tên file (không cần .csv)
 * @param {Object} [columnMap] - Map column key → label tiếng Việt
 */
export function exportToCSV(data, filename = 'du-lieu', columnMap = null) {
  if (!data || data.length === 0) {
    alert('Không có dữ liệu để xuất.');
    return;
  }

  const keys = Object.keys(data[0]);
  const headers = columnMap ? keys.map(k => columnMap[k] || k) : keys;
  
  // BOM cho UTF-8 encoding (hiển thị tiếng Việt đúng trong Excel)
  let csvContent = '\uFEFF';
  csvContent += headers.join(',') + '\n';

  data.forEach(row => {
    const values = keys.map(key => {
      let val = row[key];
      if (val === null || val === undefined) val = '';
      // Escape dấu phẩy và dấu nháy kép
      val = String(val).replace(/"/g, '""');
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        val = `"${val}"`;
      }
      return val;
    });
    csvContent += values.join(',') + '\n';
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().slice(0,10)}.csv`;
  link.click();
  
  URL.revokeObjectURL(url);
}

/**
 * In nội dung trang hiện tại (sử dụng CSS @media print)
 * @param {string} [title] - Tiêu đề báo cáo
 */
export function printReport(title = 'Báo cáo Dashboard Nông Nghiệp') {
  // Lưu title cũ
  const originalTitle = document.title;
  document.title = title;
  
  // Thêm class để CSS @media print biết cần in
  document.body.classList.add('printing');
  
  window.print();
  
  // Khôi phục
  document.body.classList.remove('printing');
  document.title = originalTitle;
}

/**
 * Tạo nút export cho các trang danh sách
 * @param {Function} onExportCSV - Callback khi click Export CSV
 * @param {Function} [onPrint] - Callback khi click In/PDF
 * @returns {string} HTML string
 */
export function renderExportButtons(exportId) {
  return `
    <div class="export-btn-group" id="${exportId}">
      <button class="chart-btn export-btn" data-action="csv" aria-label="Xuất CSV">
        📄 Xuất CSV
      </button>
      <button class="chart-btn export-btn" data-action="print" aria-label="In báo cáo">
        🖨️ In báo cáo
      </button>
    </div>
  `;
}
