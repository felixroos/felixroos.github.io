import * as d3 from 'd3';

export default function treeMap(container, data) {
  var margin = { top: 10, right: 10, bottom: 10, left: 10 },
    width = 2200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
  container.html('');
  // append the svg object to the body of the page
  var svg = container
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");
  // read json data
  // Give the data to this cluster layout:
  var root = d3.hierarchy(data).sum(function (d) { return d.value }) // Here the size of each leave is given in the 'value' field in input data
  // Then d3.treemap computes the position of each element of the hierarchy
  d3.treemap()
    .size([width, height])
    .padding(2)
    (root)
  // use this information to add rectangles:
  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr('x', function (d) { return d.x0; })
    .attr('y', function (d) { return d.y0; })
    .attr('width', function (d) { return d.x1 - d.x0; })
    .attr('height', function (d) { return d.y1 - d.y0; })
    .style("stroke", "black")
    .style("fill", (d) => d.data.selected ? 'darksalmon' : 'steelblue')
    .on("click", (event, d) => { // d3 v6
      d.data.onClick && d.data.onClick(d.data);
    })
  // and to add the text labels
  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
    .attr('width', function (d) { return d.x1 - d.x0; })
    .attr("x", function (d) { return d.x0 + 5 }) // +10 to adjust position (more right)
    .attr("y", function (d) { return d.y0 + 20 }) // +20 to adjust position (lower)
    .text(function (d) { return d.data.name })
    .attr("font-size", "12px")
    .attr("fill", "black")
}