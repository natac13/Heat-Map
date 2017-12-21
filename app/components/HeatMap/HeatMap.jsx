import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import moment from 'moment';

import style from './style.scss';

export default class HeatMap extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    chartData: PropTypes.array,
    xKey: PropTypes.string,
    yKey: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.margin = { top: 25, bottom: 150, right: 25, left: 115 };
    const { chartData } = props;
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.chartData.length !== 0) {
      this.d3Render(nextProps);
    }
  }

  d3Render = (props) => {
    const self = this;
    const node = this.node;
    const width = props.width - this.margin.left - this.margin.right;
    const height = props.height - this.margin.bottom - this.margin.top;
    const { chartData, baseTemp } = props;

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const colors = ['#330080', '#D2D28C', '#FF3200'];

    const formatTimeToYear = (d) => (
      moment(new Date(d, 0, 1)).format('YYYY')
    );
    const formatMonth = (d) => (
      moment(new Date(2017, d - 1, 1)).format('MMMM')
    );

    const barHeight = Math.ceil(height / months.length);
    const heatWidth = Math.ceil(width / (chartData.length / 12));
    const numberOfYears = Math.ceil(chartData.length / 12);
    console.log('numberOfYears', numberOfYears)

    const maxTemp = d3.max(chartData, (d) => d.temp);
    const meanTemp = d3.mean(chartData, (d) => d.temp);
    const minTemp = d3.min(chartData, (d) => d.temp);
    const colorScale = d3.scaleLinear().range(colors).domain([
      minTemp, meanTemp, maxTemp,
    ]);

    /* X-axis Data*/
    const xExtent = d3.extent(chartData, (d) => d.year);
    const xRange = [0, width];
    const x = d3.scaleLinear()
      .range(xRange)
      .domain(xExtent);

    /* The Y-axis line */
    const yRange = [height, 0];
    const y = d3.scaleLinear()
      .range(yRange)
      .domain([]);

    /* Create Axises  */
    const xAxis = d3.axisBottom(x)
      .ticks(26)
      .tickFormat(formatTimeToYear);
    const yAxis = d3.axisLeft(y);

    /* Append Chart Grouping */
    const chart = d3.select(node)
      .append('g')
        .classed(style.chart, true)
        .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    /* X-axis */
    chart.append('g')
      .classed(style.xAxis, true)
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .selectAll('text')
        .style('text-anchor', 'end')
        .attr('x', 0)
        .attr('y', 5)
        .attr('dy', '1.5em')
        .attr('transform', 'rotate(-45)');
    /* X Legend */
    chart.append('text').classed(style.xLegend, true)
      .text('Year')
      .attr('x', width / 2)
      .attr('y', height + this.margin.top * 3)
      .attr('text-anchor', 'middle');
    /* Y-axis*/
    chart.append('g')
      .classed(style.yAxis, true)
      .call(yAxis);
    /* Axis month labels*/
    chart.append('g').attr('class', 'monthLabels')
      .selectAll('text')
      .data(months)
      .enter()
      .append('text')
        .attr('class', style.monthLabel)
        .attr('text-anchor', 'end')
        .attr('x', -5)
        .attr('dy', (d, i) => ((i * barHeight) + (barHeight / 2)))
        .text((d) => d);
    /* Y Legend */
    chart.append('text').classed(style.yLegend, true)
      .text('Month')
      .attr('x', -height / 2)
      .attr('dy', -this.margin.left / 1.3)
      .style('text-anchor', 'end')
      .attr('transform', 'rotate(-90)');

    /* Tooltip Creation */
    const popup = d3.select(`.${style.svgWrapper}`)
      .append('div').classed(style.tooltip, true)
      .style('opacity', 0);

    /* Populate Chart with Data */
    chart.append('g').classed('heatMap', true)
      .selectAll(`.${style.heats}`)
      .data(chartData)
      .enter()
      .append('rect').attr('class', style.heats)
        .attr('width', heatWidth)
        .attr('height', barHeight)
        .attr('x', (d) => (x(d.year)))
        .attr('y', (d) => ((d.month - 1) * barHeight))
        .attr('fill', (d) => (colorScale(d.temp)))
        .on('mouseover', function mouseOver(d) {
          d3.select(this)
            .raise();  // styling handle in stylesheet
          popup
            .transition()
            .duration(50)
            .style('opacity', 0.9);
          popup
            .style('left', `${d3.event.pageX + 35}px`)
            .style('top', `${d3.event.pageY - 75}px`)
            .html(`<p>${d.year} - ${formatMonth(d.month)}</p>
                   <p>Temp: ${d.temp.toFixed(3)}&deg;C</p>
                   <p>Variance: ${(d.temp - baseTemp).toFixed(3)}&deg;C</p>`);
        })
        .on('mouseout', (d) => (
          popup
            .transition()
            .duration(800)
            .style('opacity', 0)
        ));

    const legendData = [
      minTemp,
      ((meanTemp + minTemp) / 2),
      meanTemp,
      ((meanTemp + maxTemp) / 2),
      maxTemp,
    ];
    const legendBlockSize = 30;
    const legendBlocks = chart.append('g').attr('class', style.legendBlocks)
      .attr('transform', `translate(${width - (self.margin.left * 3)}, ${height + self.margin.top * 3})`)
      .selectAll(`.${style.legendBlock}`)
      .data(legendData)
      .enter()
      .append('g');  // creates a group for each data point
    legendBlocks  // append a rect to that group
      .append('rect').attr('class', style.legendBlock)
        .attr('width', legendBlockSize * 2)
        .attr('height', legendBlockSize)
        .attr('x', (d, i) => i * legendBlockSize * 2)
        .attr('y', 0)
        .attr('fill', (d) => colorScale(d));
    legendBlocks  // as well as a text to the above group with the rect
      .append('text').attr('class', 'legendText')
        .text((d) => `${d.toFixed(1)}`)
        .attr('text-anchor', 'start')
        .attr('x', (d, i) => (i * legendBlockSize * 2) + (legendBlockSize / 2))
        .attr('y', legendBlockSize + 20);

    chart.exit().remove();
  }

  render() {
    return (
      <div className={style.svgWrapper}>
        <svg
          className={style.svg}
          width={this.props.width} height={this.props.height}
          ref={(node) => this.node = node}
        >
        </svg>
      </div>
    );
  }
}
