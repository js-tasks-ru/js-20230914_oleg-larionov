export default class NotificationMessage {
  constructor(message = "", options = {}) {
    const { duration = 1000, type = "success" } = options;

    this.message = message;
    this.duration = duration;
    this.type = type;
    this.element = this.createElement();
    // alert(this.element)
    // this.element = null
    this.remove()
  }
  createElement() {
    const element = document.createElement('div');
    element.classList.add("notification", this.type);
    element.setAttribute("style", `--value: ${this.getDelayTimeInSeconds(this.duration)}s;`);

    element.innerHTML = this.getTemplate();

    // const element = this.getTemplate();
    return element
  }
  getDelayTimeInSeconds(milliseconds) {
    return milliseconds / 1000
  }
  getTemplate() {
    return `<div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>`
  }
  destroy() {
    clearTimeout(this.timeout);
    this.timeout = null;
    this.element.remove();
    // document.querySelector('.notification').parentElement.remove()
    // setTimeout( this.remove,  this.duration)
    // this.element.remove()
  }
  removeLogic() {
    while(document.querySelector('.notification')) {

      document.querySelector('.notification').remove()
    }

  }
  remove() {
    // setTimeout(this.removeLogic, this.duration)
    setTimeout(() => this.removeLogic(), this.duration)
    // this.element.remove()
    // alert(Object.entries(this)) 
    // setTimeout( this.element.remove,  this.duration)

  }
  show(div) {
    // const el = document.getElementById('btn1');
    // el.innerHTML = this.getTemplate();
    // this.remove()

    if (div) {        // const element = document.createElement('div');
      div.classList.add("notification", this.type);
      div.setAttribute("style", `--value: ${this.getDelayTimeInSeconds(this.duration)}s;`);
      div.innerHTML = this.getTemplate();
    }
    else {
      const el = this.createElement()
      this.element = el
      document.body.appendChild(el)
    }
    this.remove()
    // this.timeout = setTimeout( () => this.destroy(), this.duration) 
    
  }
}
