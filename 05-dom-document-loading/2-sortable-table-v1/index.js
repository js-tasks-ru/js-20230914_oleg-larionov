export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = [...data];

    this.element = this.createElement()
    console.log(this.data)
    console.log(this.headerConfig)
    // this.render()
  }
  // render() {
  //   const element = document.createElement("div");
  //   element.classList.add("sortable-table");
  //   this.element = element;

  //   // this.update();
  // }
  createElement() {
    const root = document.getElementById('root');
    root.innerHTML = this.getTemplate();
  }
  getTableRowsTemplate() {
    return this.data.map(el =>
      `<a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
        <div class="sortable-table__cell">
          <img class="sortable-table-image" alt="Image" src="http://magazilla.ru/jpg_zoom1/246743.jpg">
        </div>
        <div class="sortable-table__cell">${el.title}</div>

        <div class="sortable-table__cell">${el.quantity}</div>
        <div class="sortable-table__cell">${el.price}</div>
        <div class="sortable-table__cell">${el.sales}</div>
      </a>`).join('')

  }
  getHeaderTemplate() {
    return this.headerConfig.map((el) =>
      `<div class="sortable-table__cell" data-id="${el.id}" data-sortable="${el.sortable}" data-order="asc">
        <span>${el.title}</span>
      </div>`
    ).join('')
  }
  getTemplate() {
    return `<div class="sortable-table">
      
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.getHeaderTemplate()}
        </div>

        <div data-element="body" class="sortable-table__body">
          ${this.getTableRowsTemplate()}
        </div>
    </div>`
  }
  destroy() {
    this.remove()
  }
  remove() {
    this.element.remove();
  }
}

