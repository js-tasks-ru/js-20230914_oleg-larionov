export default class NotificationMessage {
    constructor(message = "", options = {}) {
        const { duration = 1000, type = "success" } = options;
    
        this.message = message;
        this.duration = duration;
        this.type = type;
        this.element = this.createElement();
      }
    createElement() {
        const element = document.createElement('div');
        element.innerHTML = this.getTemplate();
        return element
    }
    getDelayTimeInSeconds(milliseconds) {
        return milliseconds / 1000
    }
    getTemplate() {
        return `<div class="notification ${this.type}" style="--value:${this.getDelayTimeInSeconds(this.duration)}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>`
    }
    destroy() {
        // setTimeout( this.remove,  this.duration)
        this.element.remove()
    }
    remove() {
        // this.element.remove()
        // alert(Object.entries(this)) 
        setTimeout( this.element.remove(),  this.duration)

    }
    show() {
        // alert(this.duration)
        // alert(this.type)
        
        const el = document.getElementById('btn1');
        el.innerHTML = this.getTemplate();
        this.remove()
        // this.destroy()
    }
}
