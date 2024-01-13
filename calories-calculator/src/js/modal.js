class Modal {
  constructor(modalEl, onClose) {
    this.modalEl = modalEl;
    this.modalShown = false;
    modalEl.querySelector(".modal__close-btn").addEventListener("click", () => {
      this.hide();
      onClose();
    });
    this.submitBtn = modalEl.querySelector(".modal__submit-btn");
  }

  show() {
    this.modalShown = true;
  }

  hide() {
    this.modalShown = false;
  }

  render() {
    if (this.modalShown) {
      this.modalEl.classList.add("modal_shown");
    } else {
      this.modalEl.classList.remove("modal_shown");
    }
  }
  setSubmitListener(listener) {
    this.submitBtn.addEventListener("click", listener);
  }
}

export default Modal;
