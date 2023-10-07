export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = [...data];

    this.element = this.createElement();
    this.subElement = this.getSubElements();
  }
  createElement() {
    const element = document.createElement('div');
    element.classList.add("sortable-table");
    element.innerHTML = this.createTemplate();
    return element;
  }
  createTableBodyTemplate() {
    return this.data
      .map(
        (item) => `<a href="/products/${item.id}" class="sortable-table__row">
          ${this.createTableRowTemplate(item)}
        </a>`
      ).join("");
  }

  createTableRowTemplate(item) {
    const rowTemplate = this.headerConfig.reduce((result, el) => {
      if (el.template) {
        return result + el.template(item[el.id]);
      }
      return result + `<div class="sortable-table__cell">${item[el.id]}</div>`;
    }, "");
    return rowTemplate;
  }

  createHeaderTemplate() {
    return this.headerConfig.map((el) =>
      `<div class="sortable-table__cell" data-id="${el.id}" data-sortable="${el.sortable}" data-order="">
        <span>${el.title}</span>
      </div>`
    ).join('');
  }
  createTemplate() {
    return `
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.createHeaderTemplate()}
        </div>

        <div data-element="body" class="sortable-table__body">
          ${this.createTableBodyTemplate()}
        </div>`;
  }
  updateTemplate() {
    this.element.innerHTML = '';
    this.element.insertAdjacentElement('afterbegin', this.createElement());
    this.subElements = this.getSubElements();
  }
  destroy() {
    this.remove();
  }
  remove() {
    this.element.remove();
  }
  sort(fieldValue, orderValue) {
    const config = this.getSortingParams(fieldValue);
    const property = config.id;
    const sortType = config.sortType;

    if (sortType === 'string') {
      this.sortStrings(property, orderValue);
      this.updateTemplate();
    }
    else if (sortType === 'number') {
      this.sortNumbers(property, orderValue);
      this.updateTemplate();
    }
    
  }

  getSortingParams(field) {
    return this.headerConfig.find((configure) => field === configure.id);
  }
  sortNumbers(property, order) {
    this.data
      .sort((a, b) => order === 'asc'
        ? a[property] - b[property]
        : b[property] - a[property]
      );
  }

  sortStrings(property, order) {
    this.data.sort((a, b) => order === 'asc' 
      ? a[property].localeCompare(b[property], ['ru', 'en'], {caseFirst: 'upper'}) * 1
      : a[property].localeCompare(b[property], ['ru', 'en'], {caseFirst: 'upper'}) * -1
    );
  }
  getSubElements() {
    return { body: this.element.querySelector('[data-element=body]') };
  }


}
