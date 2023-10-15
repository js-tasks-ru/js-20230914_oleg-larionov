export default class DoubleSlider {
    element;
    subElements = {};

    constructor({
        min = 0,
        max = 100,
        formatValue = value => '$' + value,
        selected = {
            from: min,
            to: max
        }
    } = {}) {
        this.min = min;
        this.max = max;
        this.formatValue = formatValue;
        this.selected = selected;

        this.render();
    }

    createElementTemplate() {
        return `<div class="range-slider">
        <span data-element="from">${this.formatValue(this.selected.from)}</span>
        <div data-element="inner" class="range-slider__inner">
          <span data-element="progress" class="range-slider__progress"></span>
          <span data-element="leftThumb" class="range-slider__thumb-left"></span>
          <span data-element="rightThumb" class="range-slider__thumb-right"></span>
        </div>
        <span data-element="to">${this.formatValue(this.selected.to)}</span>
        </div>`;
    }

    render() {
        const element = document.createElement('div');
        element.innerHTML = this.createElementTemplate();

        this.element = element.firstElementChild;
        this.element.ondragstart = () => false;

        this.subElements = this.getSubElements(element);

        this.initEventListeners();

        this.update();
    }

    update() {
        const rangeTotal = this.getDifference();
        const left = Math.floor((this.selected.from - this.min) / rangeTotal * 100) + '%';
        const right = Math.floor((this.max - this.selected.to) / rangeTotal * 100) + '%';
        this.subElements.progress.style.left = left;
        this.subElements.progress.style.right = right;
        this.subElements.leftThumb.style.left = left;
        this.subElements.rightThumb.style.right = right;
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        document.removeEventListener('pointermove', this.onThumbPointerMove);
        document.removeEventListener('pointerup', this.onThumbPointerUp);
    }

    onThumbPointerMove = event => {
        event.preventDefault();

        const { left: innerLeft, right: innerRight, width } = this.subElements.inner.getBoundingClientRect();

        if (this.dragging === this.subElements.leftThumb) {
            let newLeft = (event.clientX - innerLeft + this.shiftX) / width;

            if (newLeft < 0) {
                newLeft = 0;
            }
            newLeft *= 100;
            const right = parseFloat(this.subElements.rightThumb.style.right);

            if (newLeft + right > 100) {
                newLeft = 100 - right;
            }

            this.dragging.style.left = this.subElements.progress.style.left = newLeft + '%';
            this.subElements.from.innerHTML = this.formatValue(this.getValue().from);
        }

        if (this.dragging === this.subElements.rightThumb) {
            let newRight = (innerRight - event.clientX - this.shiftX) / width;

            if (newRight < 0) {
                newRight = 0;
            }

            newRight *= 100;

            const left = parseFloat(this.subElements.leftThumb.style.left);

            if (left + newRight > 100) {
                newRight = 100 - left;
            }
            this.dragging.style.right = this.subElements.progress.style.right = newRight + '%';
            this.subElements.to.innerHTML = this.formatValue(this.getValue().to);
        }
    };

    onThumbPointerUp = () => {
        this.element.classList.remove('range-slider_dragging');

        document.removeEventListener('pointermove', this.onThumbPointerMove);
        document.removeEventListener('pointerup', this.onThumbPointerUp);

        this.element.dispatchEvent(new CustomEvent('range-select', {
            detail: this.getValue(),
            bubbles: true
        }));
    };

    onThumbPointerDown(event) {
        const thumbElem = event.target;

        event.preventDefault();

        const { left, right } = thumbElem.getBoundingClientRect();

        if (thumbElem === this.subElements.leftThumb) {
            this.shiftX = right - event.clientX;
        } 
        else {
            this.shiftX = left - event.clientX;
        }

        this.dragging = thumbElem;
        this.element.classList.add('range-slider_dragging');

        document.addEventListener('pointermove', this.onThumbPointerMove);
        document.addEventListener('pointerup', this.onThumbPointerUp);
    }

    initEventListeners() {
        const { leftThumb, rightThumb } = this.subElements;

        leftThumb.addEventListener('pointerdown', event => this.onThumbPointerDown(event));
        rightThumb.addEventListener('pointerdown', event => this.onThumbPointerDown(event));
    }

    getSubElements(element) {
        const result = {};
        const elements = element.querySelectorAll('[data-element]');

        for (const subElement of elements) {
            const name = subElement.dataset.element;

            result[name] = subElement;
        }

        return result;
    }

    getValue() {
        const rangeTotal = this.getDifference();
        const { left } = this.subElements.leftThumb.style;
        const { right } = this.subElements.rightThumb.style;

        const from = Math.round(this.min + parseFloat(left) * 0.01 * rangeTotal);
        const to = Math.round(this.max - parseFloat(right) * 0.01 * rangeTotal);

        return { from, to };
    }
    
    getDifference() {
        return this.max - this.min
    }
}