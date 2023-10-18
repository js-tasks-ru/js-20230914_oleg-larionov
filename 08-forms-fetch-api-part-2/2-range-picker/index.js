export default class RangePicker {
    periodStart = true;
    period = {
        from: new Date(),
        to: new Date()
    };
    element = null;
    subElements = {};

    constructor({ from = new Date(), to = new Date() } = {}) {
        this.initialDate = new Date(from);
        this.period = { from, to };
        this.render();
    }
 
    createTemplate() {
        const from = this.formatDate(this.period.from);
        const to = this.formatDate(this.period.to);

        return `
        <div class="rangepicker">
            <div class="rangepicker__input" data-element="input">
                <span data-element="from">${from}</span> -
                <span data-element="to">${to}</span>
            </div>
            <div class="rangepicker__selector" data-element="selector"></div>
        </div>`;
    }

    render() {
        const element = document.createElement('div');

        element.innerHTML = this.createTemplate();
        this.element = element.firstElementChild;
        this.subElements = this.getSubElements(element);

        this.createEventListeners();
    }

    getSubElements(element) {
        const subElements = {};
        for (const subElement of element.querySelectorAll('[data-element]')) {
            subElements[subElement.dataset.element] = subElement;
        }
        return subElements;
    }
   
    handleDocumentClick = event => {
        const calendarOpen = this.element.classList.contains('rangepicker_open');
        const isRangePicker = this.element.contains(event.target);
        if (calendarOpen && !isRangePicker) {
            this.closeCalendar();
        }
    };
    handleSelectorClick({ target }) {
        if (target.classList.contains('rangepicker__cell')) {
            this.handleCellClick(target);
        }
    }
    createEventListeners() {
        const { input, selector } = this.subElements;
        document.addEventListener('click', this.handleDocumentClick, true);
        input.addEventListener('click', () => this.toggleDisplaying());
        selector.addEventListener('click', event => this.handleSelectorClick(event));
    }

    toggleDisplaying() {
        this.element.classList.toggle('rangepicker_open');
        this.renderDateRangePicker();
    }

    closeCalendar() {
        this.element.classList.remove('rangepicker_open');
    }

    renderDateRangePicker() {
        const firstDate = new Date(this.initialDate);
        const secondDate = new Date(this.initialDate);
        const { selector } = this.subElements;

        secondDate.setMonth(secondDate.getMonth() + 1);

        selector.innerHTML = `
        <div class="rangepicker__selector-arrow"></div>
        <div class="rangepicker__selector-control-left"></div>
        <div class="rangepicker__selector-control-right"></div>
        ${this.createMonthLayoutTemplate(firstDate)}
        ${this.createMonthLayoutTemplate(secondDate)}`;

        const leftControl = selector.querySelector('.rangepicker__selector-control-left');
        const rightControl = selector.querySelector('.rangepicker__selector-control-right');
        leftControl.addEventListener('click', () => this.handlepreviousMonth());
        rightControl.addEventListener('click', () => this.handlenextMonth());

        this.renderHighlight();
    }

    handlepreviousMonth() {
        this.initialDate.setMonth(this.initialDate.getMonth() - 1);
        this.renderDateRangePicker();
    }

    handlenextMonth() {
        this.initialDate.setMonth(this.initialDate.getMonth() + 1);
        this.renderDateRangePicker();
    }

    renderHighlight() {
        const { from, to } = this.period;

        for (const cell of this.element.querySelectorAll('.rangepicker__cell')) {
            const { value } = cell.dataset;
            const cellDate = new Date(value);

            cell.classList.remove('rangepicker__selected-from');
            cell.classList.remove('rangepicker__selected-between');
            cell.classList.remove('rangepicker__selected-to');

            if (from && value === from.toISOString()) {
                cell.classList.add('rangepicker__selected-from');
            } else if (to && value === to.toISOString()) {
                cell.classList.add('rangepicker__selected-to');
            } else if (from && to && cellDate >= from && cellDate <= to) {
                cell.classList.add('rangepicker__selected-between');
            }
        }

        if (from) {
            const selectedFromElem = this.element.querySelector(`[data-value="${from.toISOString()}"]`);
            if (selectedFromElem) {
                selectedFromElem.closest('.rangepicker__cell').classList.add('rangepicker__selected-from');
            }
        }

        if (to) {
            const selectedToElem = this.element.querySelector(`[data-value="${to.toISOString()}"]`);
            if (selectedToElem) {
                selectedToElem.closest('.rangepicker__cell').classList.add('rangepicker__selected-to');
            }
        }
    }

    getIndex(dayIndex) {
        const index = dayIndex === 0 ? 6 : (dayIndex - 1); // make Sunday (0) the last day
        return index + 1;
    }
    createButtonTemplate(date, dateToShow) {
        date.setDate(2);
        let template = ``;
        while (date.getMonth() === dateToShow.getMonth()) {
            template += `
          <button type="button"
            class="rangepicker__cell"
            data-value="${date.toISOString()}">
              ${date.getDate()}
          </button>`;

            date.setDate(date.getDate() + 1);
        }
        return template
    }
    createMonthLayoutTemplate(dateToShow) {
        const date = new Date(dateToShow);
        date.setDate(1);
        const month = date.toLocaleString('ru', { month: 'long' });

        let template = `<div class="rangepicker__calendar">
        <div class="rangepicker__month-indicator">
          <time datetime=${month}>${month}</time>
        </div>
        <div class="rangepicker__day-of-week">
          <div>Пн</div>
          <div>Вт</div>
          <div>Ср</div>
          <div>Чт</div>
          <div>Пт</div>
          <div>Сб</div>
          <div>Вс</div>
        </div>
        <div class="rangepicker__date-grid">
        <button type="button"
          class="rangepicker__cell"
          data-value="${date.toISOString()}"
          style="--start-from: ${this.getIndex(date.getDay())}"
        >
            ${date.getDate()}
        </button>
        ${this.createButtonTemplate(date, dateToShow)}`;
        
        return template;
    }

    formatDate(date) {
        return date.toLocaleString('ru', { dateStyle: 'short' });
    }

    handleCellClick(target) {
        const { value } = target.dataset;

        if (value) {
            const dateValue = new Date(value);

            if (this.periodStart) {
                this.period = {
                    from: dateValue,
                    to: null
                };
                this.periodStart = false;
                this.renderHighlight();
            }
            else {
                if (dateValue > this.period.from) {
                    this.period.to = dateValue;
                } else {
                    this.period.to = this.period.from;
                    this.period.from = dateValue;
                }

                this.periodStart = true;
                this.renderHighlight();
            }

            if (this.period.from && this.period.to) {
                this.dispatchEvent();
                this.closeCalendar();
                this.subElements.from.innerHTML = this.formatDate(this.period.from);
                this.subElements.to.innerHTML = this.formatDate(this.period.to);
            }
        }
    }

    dispatchEvent() {
        this.element.dispatchEvent(new CustomEvent('date-select', {
            bubbles: true,
            detail: this.period
        }));
    }

    remove() {
        this.element.remove();
        document.removeEventListener('click', this.handleDocumentClick, true);
    }

    destroy() {
        this.remove();
    }
}