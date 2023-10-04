export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = [...data];

    this.element = this.createElement()
  }

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
        <div class="sortable-table__cell">3D очки Epson ELPGS03</div>

        <div class="sortable-table__cell">16</div>
        <div class="sortable-table__cell">91</div>
        <div class="sortable-table__cell">6</div>
      </a>`)
  }
  getTemplate() {
    return ` <div data-element="productsContainer" class="products-list__container">
      <div data-element="header" class="sortable-table__header sortable-table__row">
        <div class="sortable-table__cell" data-id="images" data-sortable="false" data-order="asc">
          <span>Image</span>
        </div>
        <div class="sortable-table__cell" data-id="title" data-sortable="true" data-order="asc">
          <span>Name</span>
          <span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
          </span>
        </div>
        <div class="sortable-table__cell" data-id="quantity" data-sortable="true" data-order="asc">
          <span>Quantity</span>
        </div>
        <div class="sortable-table__cell" data-id="price" data-sortable="true" data-order="asc">
          <span>Price</span>
        </div>
        <div class="sortable-table__cell" data-id="sales" data-sortable="true" data-order="asc">
          <span>Sales</span>
        </div>
      </div>

      <div data-element="body" class="sortable-table__body">
        ${this.getTableRowsTemplate()}
      </div>
    </div>`
  }
}

