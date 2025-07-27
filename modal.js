const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="./modal.css" />
  <div class="overlay">
    <div class="modal">
      <header class="modal-header">
        <slot name="title">Modal Title</slot>
        <button class="close-btn" aria-label="Close">&times;</button>
      </header>
      <section class="modal-body">
        <slot name="body">Modal content goes here.</slot>
      </section>
      <footer class="modal-footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
`;

export class AppModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.overlay = this.shadowRoot.querySelector('.overlay');
    this.modal = this.shadowRoot.querySelector('.modal');
    this._escHandler = (e) => {
      if (e.key === 'Escape') this.close();
    };
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.close-btn')
      .addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', e => {
      if (e.target === this.overlay) this.close();
    });
    document.addEventListener('keydown', this._escHandler);
    requestAnimationFrame(() => this.overlay.classList.add('visible'));
    this.dispatchEvent(new CustomEvent('open', { bubbles: true }));
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._escHandler);
  }

  open() {
    if (!this.isConnected) document.body.appendChild(this);
  }

  close() {
    this.overlay.classList.remove('visible');
    this.overlay.classList.add('closing');
    this.dispatchEvent(new CustomEvent('close', { bubbles: true }));

    this.overlay.addEventListener('animationend', () => {
      this.remove();
    }, { once: true });
  }
}

customElements.define('app-modal', AppModal);
