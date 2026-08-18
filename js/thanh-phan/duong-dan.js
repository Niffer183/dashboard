// ============================================
// 🌱 BREADCRUMB COMPONENT
// ============================================

export function renderBreadcrumb(containerId, paths) {
  const container = document.getElementById(containerId);
  if (!container) return;

  let html = '';
  
  paths.forEach((path, index) => {
    const isLast = index === paths.length - 1;
    
    if (isLast) {
      html += `
        <div class="breadcrumb-item current">
          ${path.icon ? `<span class="breadcrumb-icon">${path.icon}</span>` : ''}
          ${path.label}
        </div>
      `;
    } else {
      html += `
        <a href="${path.url}" class="breadcrumb-item" data-route>
          ${path.icon ? `<span class="breadcrumb-icon">${path.icon}</span>` : ''}
          ${path.label}
        </a>
        <span class="breadcrumb-separator">/</span>
      `;
    }
  });

  container.innerHTML = html;
}
