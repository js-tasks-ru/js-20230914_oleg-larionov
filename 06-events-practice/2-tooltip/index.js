class Tooltip {
  static instance = null;
  static POINTER_OFFSET_X = 10;
  static POINTER_OFFSET_Y = 10;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    Tooltip.instance = this;
    this.element = this.createTooltipElement();
  }
  
  initialize() {
    document.addEventListener("pointerover", this.handleElementPointerover);
    document.addEventListener("pointerout", this.handleElementPointerout);
  }
  createTooltipElement() {
    const element = document.createElement("div");
    element.classList.add("tooltip");
    return element;
  }

  render(tooltip) {
    this.element.innerHTML = tooltip;
    document.body.append(this.element);
  }

  handleElementPointerover = (e) => {
    const tooltip = e.target.dataset.tooltip;

    if (!tooltip) {return;}

    document.addEventListener("pointermove", this.handleElementPointermove);
    this.render(tooltip);
  };

  handleElementPointermove = (e) => {
    this.element.style.left = e.clientX + Tooltip.POINTER_OFFSET_X + "px";
    this.element.style.top = e.clientY + Tooltip.POINTER_OFFSET_Y + "px";
  };

  handleElementPointerout = (e) => {
    document.removeEventListener("pointermove", this.handleElementPointermove);
    this.remove();
  };

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    document.removeEventListener("pointerover", this.handleElementPointerover);
    document.removeEventListener("pointerout", this.handleElementPointerout);
    Tooltip.instance = null;
  }
}

export default Tooltip;