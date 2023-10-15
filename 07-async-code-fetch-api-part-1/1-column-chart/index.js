import fetchJson from "./utils/fetch-json.js";

const BACKEND_URL = "https://course-js.javascript.ru";

export default class ColumnChart {
    chartHeight = 50;
    data = [];
    dataSum;
    maxDataValue;
    subElements;

    constructor(options = {}) {
        const {
            url = "",
            label = "",
            link = "",
            formatHeading = (value) => value,
            range: { from = new Date(), to = new Date() } = {},
        } = options;

        this.label = label;
        this.link = link;
        this.formatHeading = formatHeading;
        this.element = this.createElement();
        this.subElements = this.getSubElements();
        this.url = url;
        this.from = from.toISOString();
        this.to = to.toISOString();
        this.update(this.from, this.to);
    }

    createHeaderTemplate() {
        return this.formatHeading(this.dataSum);
    }

    createLinkTemplate() {
        return this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : "";
    }
    createBarTemplate(height, percent) {
        return `<div style="--value: ${height};" data-tooltip="${percent}%"></div>`;
    }

    createChartTemplate() {
        return this.data
            .map((value) => {
                const relativeValue = value / this.maxDataValue;

                return this.createBarTemplate(Math.trunc(relativeValue * this.chartHeight), Math.round(relativeValue * 100));
            })
            .join('');
    }

    createElement() {
        const element = document.createElement("div");
        element.classList.add("column-chart");
        if (!this.data.length) {
            element.classList.add("column-chart_loading");
        }
        element.innerHTML = this.createElementContentTemplate();

        return element;
    }

    createElementContentTemplate() {
        return `
        <div class="column-chart__title">
            Total ${this.label}
            ${this.createLinkTemplate()}
        </div>
        <div class="column-chart__container">
            <div data-element="header" class="column-chart__header">
                ${this.createHeaderTemplate()}
            </div>
            <div data-element="body" class="column-chart__chart">
                ${this.createChartTemplate()}
            </div>
        </div>
    `;
    }

    remove() {
        this.element.remove();
    }
    destroy() {
        this.remove();
    }

    calculateDataParameters() {
        const { maxDataValue, sum } = this.data.reduce(({ maxDataValue, sum }, value) =>
        (
            {
                maxDataValue: Math.max(maxDataValue, value),
                sum: sum + value,
            }
        ),
            { maxDataValue: 0, sum: 0 }
        );

        this.maxDataValue = maxDataValue;
        this.dataSum = sum;
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

    toggleLoadingClass(data) {
        if (!this.data.length && data.length) {
            this.element.classList.remove("column-chart_loading");
        } else if (this.data.length && !data.length) {
            this.element.classList.add("column-chart_loading");
        }
    }

    async update(from, to) {
        const data = await fetchJson(this.createEndpoint(from, to));
        this.updateData(data);
        return data;
    }

    createEndpoint(from, to) {
        return `${BACKEND_URL}/${this.url}?from=${from}&to=${to}`
    }

    updateData(newData) {
        const newDataValues = Object.values(newData);
        this.toggleLoadingClass(newDataValues);
        this.data = newDataValues;
        this.calculateDataParameters();

        this.subElements.header.innerHTML = this.createHeaderTemplate();
        this.subElements.body.innerHTML = this.createChartTemplate();
    }
}