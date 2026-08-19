// ============================================
// 🌱 MODAL DIALOG COMPONENT
// Thay thế confirm() native bằng custom modal
// ============================================

/**
 * Hiển thị modal xác nhận
 * @param {Object} options
 * @param {string} options.title - Tiêu đề modal
 * @param {string} options.message - Nội dung message
 * @param {string} [options.confirmText='Xác nhận'] - Text nút xác nhận
 * @param {string} [options.cancelText='Hủy'] - Text nút hủy
 * @param {string} [options.type='info'] - Loại: 'info', 'warning', 'danger'
 * @returns {Promise<boolean>} true nếu user bấm Xác nhận
 */
export function showModal({ title, message, confirmText = 'Xác nhận', cancelText = 'Hủy', type = 'info' }) {
  return new Promise((resolve) => {
    // Xóa modal cũ nếu có
    const existing = document.getElementById('custom-modal-overlay');
    if (existing) existing.remove();

    const typeIcons = {
      info: '💡',
      warning: '⚠️',
      danger: '🚨',
      success: '✅',
      map: '🗺️'
    };

    const overlay = document.createElement('div');
    overlay.id = 'custom-modal-overlay';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-header">
          <span class="modal-icon">${typeIcons[type] || '💡'}</span>
          <h3 class="modal-title" id="modal-title">${title}</h3>
        </div>
        <div class="modal-body">
          <p class="modal-message">${message}</p>
        </div>
        <div class="modal-footer">
          <button class="modal-btn modal-btn--cancel" id="modal-cancel" aria-label="${cancelText}">${cancelText}</button>
          <button class="modal-btn modal-btn--confirm modal-btn--${type}" id="modal-confirm" aria-label="${confirmText}">${confirmText}</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Focus vào nút confirm
    requestAnimationFrame(() => {
      overlay.classList.add('modal-overlay--active');
      document.getElementById('modal-confirm')?.focus();
    });

    const cleanup = (result) => {
      overlay.classList.remove('modal-overlay--active');
      setTimeout(() => {
        overlay.remove();
        resolve(result);
      }, 200);
    };

    document.getElementById('modal-confirm').addEventListener('click', () => cleanup(true));
    document.getElementById('modal-cancel').addEventListener('click', () => cleanup(false));
    
    // Click overlay để đóng
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) cleanup(false);
    });

    // ESC để đóng
    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', handleKeydown);
        cleanup(false);
      }
    };
    document.addEventListener('keydown', handleKeydown);
  });
}

/**
 * Hiển thị toast notification (không cần xác nhận)
 * @param {string} message
 * @param {string} [type='info'] - 'info', 'success', 'warning', 'error'
 * @param {number} [duration=3000] - Thời gian hiển thị (ms)
 */
export function showToast(message, type = 'info', duration = 3000) {
  // Tạo container nếu chưa có
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const typeIcons = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
  
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${typeIcons[type] || 'ℹ️'}</span>
    <span class="toast-message">${message}</span>
  `;

  toastContainer.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('toast--active'));

  setTimeout(() => {
    toast.classList.remove('toast--active');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
