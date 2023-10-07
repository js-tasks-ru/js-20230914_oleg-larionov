export default class NotificationMessage {
  constructor(message = "", options = {}) {
    const { duration = 1000, type = "success" } = options;

    this.message = message;
    this.duration = duration;
    this.type = type;
    this.element = this.createElement();
    this.remove();
  }
  createElement() {
    const element = document.createElement('div');
    element.classList.add("notification", this.type);
    element.setAttribute("style", `--value: ${this.getDelayTimeInSeconds(this.duration)}s;`);
    element.innerHTML = this.createTemplate();
    return element;
  }
  getDelayTimeInSeconds(milliseconds) {
    return milliseconds / 1000;
  }
  createTemplate() {
    return `<div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>`;
  }
  destroy() {
    clearTimeout(this.timeout);
    this.timeout = null;
    this.element.remove();
  }
  removeLogic() {
    while (document.querySelector('.notification')) {
      document.querySelector('.notification').remove();
    }

  }
  remove() {
    setTimeout(() => this.removeLogic(), this.duration);
  }
  show(div) {

    if (div) { 
      div.classList.add("notification", this.type);
      div.setAttribute("style", `--value: ${this.getDelayTimeInSeconds(this.duration)}s;`);
      div.innerHTML = this.createTemplate();
    }
    else {
      const el = this.createElement();
      this.element = el;
      document.body.appendChild(el);
    }
    this.remove();
  }
}
