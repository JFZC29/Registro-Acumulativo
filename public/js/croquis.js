// Croquis Interactive Canvas Module
class CroquisEditor {
  constructor(canvasId, modalId = 'croquisTextModal') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.modal = document.getElementById(modalId);
    this.tool = 'pen'; // 'pen', 'line', 'rect', 'eraser', 'text'
    this.color = '#000000';
    this.lineWidth = 2;
    this.fontSize = 12;
    this.isDrawing = false;
    this.startX = 0;
    this.startY = 0;
    this.pendingTextX = 0;
    this.pendingTextY = 0;
    this.history = [];
    this.historyIndex = -1;

    this.initCanvas();
    this.bindEvents();
    this.setupTextModal();
  }

  initCanvas() {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.saveState();
  }

  saveState() {
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    this.history.push(this.canvas.toDataURL());
    this.historyIndex++;
  }

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      const img = new Image();
      img.onload = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(img, 0, 0);
      };
      img.src = this.history[this.historyIndex];
    }
  }

  clear() {
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.saveState();
  }

  getPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  bindEvents() {
    const start = (e) => {
      e.preventDefault();
      const pos = this.getPos(e);
      this.startX = pos.x;
      this.startY = pos.y;

      if (this.tool === 'text') {
        this.pendingTextX = pos.x;
        this.pendingTextY = pos.y;
        this.openTextModal();
        return;
      }

      this.isDrawing = true;
      this.snapshot = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);

      if (this.tool === 'pen' || this.tool === 'eraser') {
        this.ctx.beginPath();
        this.ctx.moveTo(pos.x, pos.y);
      }
    };

    const move = (e) => {
      if (!this.isDrawing) return;
      e.preventDefault();
      const pos = this.getPos(e);

      if (this.tool === 'pen') {
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();
      } else if (this.tool === 'eraser') {
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 14;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();
      } else if (this.tool === 'line' || this.tool === 'rect') {
        this.ctx.putImageData(this.snapshot, 0, 0);
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.lineWidth;

        if (this.tool === 'line') {
          this.ctx.beginPath();
          this.ctx.moveTo(this.startX, this.startY);
          this.ctx.lineTo(pos.x, pos.y);
          this.ctx.stroke();
        } else if (this.tool === 'rect') {
          this.ctx.strokeRect(this.startX, this.startY, pos.x - this.startX, pos.y - this.startY);
        }
      }
    };

    const end = (e) => {
      if (this.isDrawing) {
        this.isDrawing = false;
        this.saveState();
      }
    };

    this.canvas.addEventListener('mousedown', start);
    this.canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);

    this.canvas.addEventListener('touchstart', start, { passive: false });
    this.canvas.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', end);
  }

  setupTextModal() {
    const modal = this.modal || document.getElementById('croquisTextModal');
    if (!modal) return;

    const confirmBtn = modal.querySelector('.btn-croquis-text-add');
    const cancelBtn = modal.querySelector('.btn-croquis-text-cancel');
    const input = modal.querySelector('.croquis-text-input');

    if (confirmBtn && !confirmBtn.dataset.bound) {
      confirmBtn.dataset.bound = 'true';
      confirmBtn.addEventListener('click', () => {
        const text = input ? input.value.trim() : '';
        if (text) {
          const colorEl = modal.querySelector('.croquis-text-color');
          const sizeEl = modal.querySelector('.croquis-text-size');
          const color = colorEl ? colorEl.value : '#000000';
          const size = sizeEl ? sizeEl.value : '12';

          this.ctx.font = 'bold ' + size + 'px Arial';
          this.ctx.fillStyle = color;
          this.ctx.fillText(text, this.pendingTextX, this.pendingTextY);
          this.saveState();
        }
        modal.classList.add('hidden');
        if (input) input.value = '';
      });
    }

    if (cancelBtn && !cancelBtn.dataset.bound) {
      cancelBtn.dataset.bound = 'true';
      cancelBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
        if (input) input.value = '';
      });
    }
  }

  openTextModal() {
    const modal = this.modal || document.getElementById('croquisTextModal');
    if (modal) {
      modal.classList.remove('hidden');
      const input = modal.querySelector('.croquis-text-input');
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 50);
      }
    }
  }

  loadImage(fileOrDataUrl) {
    if (typeof fileOrDataUrl === 'string') {
      const img = new Image();
      img.onload = () => {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        this.saveState();
      };
      img.src = fileOrDataUrl;
    } else if (fileOrDataUrl instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.loadImage(e.target.result);
      };
      reader.readAsDataURL(fileOrDataUrl);
    }
  }

  getDataURL() {
    return this.canvas.toDataURL('image/png');
  }
}

window.CroquisEditor = CroquisEditor;
