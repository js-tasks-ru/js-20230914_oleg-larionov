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

		this.render();
	}

	render() {
		const element = document.createElement('div');

		element.innerHTML = `
		 		<div class="column-chart column-chart_loading" style="--chart-height: ${50}">
		 		  <div class="column-chart__title">
		 			Total ${this.label} ${this.getLink()}
		 		  </div>
		 		  <div class="column-chart__container">
		 			<div class="column-chart__header">
		 			${this.formatHeading(this.value)}
		 			</div>
		 			<div data-element="body" class="column-chart__chart">
		 			  ${this.getBarChart(this.data)}
		 			</div>
		 		  </div>
		 		</div>
		 	`
		this.element = element.firstElementChild;

		if (this.data.length) {
			this.element.classList.remove('column-chart_loading');
		}

	}


	update(newData) {
		this.data = newData;
	}
	isBlank() {
		return this.data.length > 0 ? '' : `column-chart_loading`
	}
	remove() {
		this.element.remove()
	}
	destroy() {
		this.remove()
	}
	getBarChart(data) {
		const maxValue = Math.max(...data);
		return data.map(el => {
			const percent = (el / maxValue * 100).toFixed(0);
			return `<div style="--value: ${Math.floor(el * 50 / maxValue)}" data-tooltip="${percent}%"></div>`;
		}).join('');
	}
	getLink() {
		return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
	}



}
