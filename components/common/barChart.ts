import * as d3 from 'd3';
import { Selection, BaseType } from 'd3-selection';

export default function barChart({ container, data, width: widthProp, height: heightProp }: {
  container: Selection<BaseType, any, null, undefined>,
  data: { count: number, value: string, [key: string]: any }[],
  width: number, height: number
}) {

  // set the dimensions and margins of the graph
  var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = (widthProp || 960) - margin.left - margin.right,
    height = (heightProp || 500) - margin.top - margin.bottom;

  // set the ranges
  var x = d3.scaleBand().range([0, width]).padding(0.1);
  var y = d3.scaleLinear().range([height, 0]);

  // append the svg object to the body of the page
  // append a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = container
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr(
      'transform',
      'translate(' + margin.left + ',' + margin.top + ')'
    );

  // Scale the range of the data in the domains
  x.domain(data.map(({ value }) => value));
  y.domain([0, d3.max(data.map(({ count }) => count))]);

  // append the rectangles for the bar chart
  svg
    .selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('fill', 'steelblue')
    .attr('x', function (d) {
      return x(d.value);
    })
    .attr('width', x.bandwidth())
    .attr('y', function (d) {
      return y(d.count);
    })
    .attr('height', function (d) {
      return height - y(d.count);
    });

  // add the x Axis
  svg
    .append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));

  // add the y Axis
  svg.append('g').call(d3.axisLeft(y));
}