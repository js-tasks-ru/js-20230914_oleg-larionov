export default class SortableTable {
  constructor(headersConfig, {
    data = [],
    sorted = {}
  } = {}) {
    this.headersConfig = headersConfig;
    this.data = [...data];
    this.sorted = { ...sorted };
    this.element = this.createElement();
    this.sort(sorted.id, sorted.order);
    console.log(this.sorted);
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
    const rowTemplate = this.headersConfig.reduce((result, el) => {
      if (el.template) {
        return result + el.template(item[el.id]);
      }
      return result + `<div class="sortable-table__cell">${item[el.id]}</div>`;
    }, "");
    return rowTemplate;
  }

  createHeaderTemplate() {
    return this.headersConfig.map((el) =>
      `<div class="sortable-table__cell" data-id="${el.id}" data-sortable="${el.sortable}" data-order="">
        <span>${el.title}</span>
        <span data-element="arrow" class="sortable-table__sort-arrow">
        <span class="sort-arrow"></span>
      </span>
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
    this.createSubElementsEvents();

  }
  destroy() {
    this.remove();
  }
  remove() {
    this.element.remove();
  }
  sort(fieldValue, orderValue, isSortLocally = true) {
    const config = this.getSortingParams(fieldValue);
    const property = config.id;
    const sortType = config.sortType;
    this.isSortLocally = isSortLocally;

    if (this.isSortLocally) {
      this.sortLocally(orderValue, sortType, property);
    }
    else {
      this.sortOnServer();
    }

  }
  sortLocally(orderValue, sortType, property) {
    if (sortType === 'string') {
      this.sortStrings(property, orderValue);
      this.updateTemplate();
    }
    else if (sortType === 'number') {
      this.sortNumbers(property, orderValue);
      this.updateTemplate();
    }
  }
  sortOnServer() {

  }

  getSortingParams(field) {
    return this.headersConfig.find((configure) => field === configure.id);
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
      ? a[property].localeCompare(b[property], ['ru', 'en'], { caseFirst: 'upper' }) * 1
      : a[property].localeCompare(b[property], ['ru', 'en'], { caseFirst: 'upper' }) * -1
    );
  }

  getSubElements() {
    const subElements = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const element of elements) {
      const name = element.dataset.element;
      subElements[name] = element;
    }

    return subElements;
  }

  createSubElementsEvents() {
    if (!this.subElements) {return;}

    this.subElements.header.addEventListener("pointerdown", this.handleHeaderClick);
  }

  removeSubElementsEvents() {
    if (!this.subElements) {return;}

    this.subElements.header.removeEventListener("pointerdown", this.handleHeaderClick);
  }

  handleHeaderClick = (e) => {
    const column = e.target.closest(".sortable-table__cell");
    if (column) {
      const id = column.dataset.id;
      const order = column.dataset.order === "desc" ? "asc" : "desc";

      this.sort(id, order, this.isSortLocally);
    }
  };

}
