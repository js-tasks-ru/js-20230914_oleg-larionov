export default class ColumnChart {

  constructor({
    data = [],
    label = '',
    link = '',
    value = 0,
    formatHeading = () => `${value}`,
    chartHeight = 50

  } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading;
    this.chartHeight = chartHeight;

    this.renderElement();
  }

  getTemplate() {
    return `<div class="column-chart column-chart_loading" style="--chart-height: ${50}">
				<div class="column-chart__title">
				  Total ${this.label} ${this.getLinkTemplate()}
				</div>
				<div class="column-chart__container">
				  <div class="column-chart__header">
				  ${this.formatHeading(this.value)}
				  </div>
				  <div data-element="body" class="column-chart__chart">
					${this.getBarChartTemplate(this.data)}
				  </div>
				</div>
			</div>`;
  }

  renderElement() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    if (this.data.length) {
      this.element.classList.remove('column-chart_loading');
    }

  }

  getBarChartTemplate(data) {
    const maxValue = this.getMaxDataValue(data);
    return data.map(el => {
      const percent = (el / maxValue * 100).toFixed(0);
      return `<div style="--value: ${Math.floor(el * 50 / maxValue)}" data-tooltip="${percent}%"></div>`;
    }).join('');
  }
  getMaxDataValue(data) {
    return Math.max(...data);
  }
  getLinkTemplate() {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }

  update(newData) {
    if (newData.length && !this.data.length) {
      this.element.classList.remove('column-chart_loading');
    }
    else if (!newData.length && this.data.length) {
      this.element.classList.add('column-chart_loading');
    }
    this.data = newData;
    this.element.querySelector(".column-chart__chart").innerHTML = this.getBarChartTemplate(this.data);
  }
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
  }



}
