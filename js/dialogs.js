// Apple Design System Dialogs & Floating Toasts
// Replaces all native browser alert(), confirm(), and prompt()

window.showAppConfirm = function(options = {}) {
  return new Promise((resolve) => {
    const modal = document.getElementById('customDialogModal');
    if (!modal) {
      resolve(true);
      return;
    }

    const iconContainer = document.getElementById('dialog-icon-container');
    const iconEl = document.getElementById('dialog-icon');
    const titleEl = document.getElementById('dialog-title');
    const msgEl = document.getElementById('dialog-message');
    const cancelBtn = document.getElementById('dialog-btn-cancel');
    const confirmBtn = document.getElementById('dialog-btn-confirm');

    titleEl.textContent = options.title || 'Confirmación';
    msgEl.innerHTML = options.message || '¿Desea continuar con esta acción?';
    confirmBtn.textContent = options.confirmText || 'Aceptar';
    cancelBtn.textContent = options.cancelText || 'Cancelar';
    cancelBtn.style.display = options.hideCancel ? 'none' : 'inline-flex';

    if (options.isDanger) {
      iconContainer.className = 'w-11 h-11 rounded-2xl bg-[#ff3b30]/10 text-[#ff3b30] flex items-center justify-center flex-shrink-0 text-xl font-bold';
      confirmBtn.className = 'apple-btn apple-btn-danger text-xs py-2 px-4 font-bold';
      iconEl.innerHTML = '&#128465;&#65039;';
    } else if (options.isWarning) {
      iconContainer.className = 'w-11 h-11 rounded-2xl bg-[#ff9500]/10 text-[#ff9500] flex items-center justify-center flex-shrink-0 text-xl font-bold';
      confirmBtn.className = 'apple-btn apple-btn-primary text-xs py-2 px-4 font-bold bg-[#ff9500] hover:bg-[#e08500]';
      iconEl.innerHTML = '&#9888;&#65039;';
    } else if (options.isSuccess) {
      iconContainer.className = 'w-11 h-11 rounded-2xl bg-[#34c759]/10 text-[#34c759] flex items-center justify-center flex-shrink-0 text-xl font-bold';
      confirmBtn.className = 'apple-btn apple-btn-success text-xs py-2 px-4 font-bold';
      iconEl.innerHTML = '&#9989;';
    } else {
      iconContainer.className = 'w-11 h-11 rounded-2xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center flex-shrink-0 text-xl font-bold';
      confirmBtn.className = 'apple-btn apple-btn-primary text-xs py-2 px-4 font-bold';
      iconEl.innerHTML = options.iconHtml || '&#128196;';
    }

    const cleanup = () => {
      modal.classList.add('hidden');
      confirmBtn.onclick = null;
      cancelBtn.onclick = null;
    };

    confirmBtn.onclick = () => {
      cleanup();
      resolve(true);
    };

    cancelBtn.onclick = () => {
      cleanup();
      resolve(false);
    };

    modal.classList.remove('hidden');
  });
};

window.showAppAlert = function(title, message, type = 'info') {
  return window.showAppConfirm({
    title: title,
    message: message,
    confirmText: 'Entendido',
    hideCancel: true,
    isDanger: type === 'error',
    isWarning: type === 'warning',
    isSuccess: type === 'success'
  });
};

window.showToast = function(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const bg = type === 'success' ? 'bg-[#34c759] text-white' :
             type === 'error' ? 'bg-[#ff3b30] text-white' :
             type === 'warning' ? 'bg-[#ff9500] text-white' : 'bg-[#1d1d1f] text-white';
  const icon = type === 'success' ? '&#9989;' :
               type === 'error' ? '&#10060;' :
               type === 'warning' ? '&#9888;&#65039;' : '&#8505;&#65039;';

  toast.className = `${bg} px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold pointer-events-auto transform transition-all duration-200 animate-apple-modal`;
  toast.innerHTML = `
    <span class="text-sm">${icon}</span>
    <span class="flex-1 leading-snug">${message}</span>
    <button type="button" class="text-white/70 hover:text-white font-bold ml-1 text-base leading-none" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentElement) {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px) scale(0.96)';
      setTimeout(() => toast.remove(), 200);
    }
  }, 3500);
};
