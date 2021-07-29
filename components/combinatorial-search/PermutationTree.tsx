import React from 'react';
import { select } from 'd3-selection';
import { cluster, hierarchy } from 'd3-hierarchy';

export default function PermutationTree(props) {
  const { width = 600, height = 200, children, onClick } = props;
  const root: any = tree(children, width);
  return (
    <svg
      viewBox={`-10 ${-height / 2} ${width} ${height}`}
      ref={(el) => {
        const svg = select(el);
        // lines
        svg
          .append('g')
          .attr('fill', 'none')
          .attr('stroke', '#555')
          .attr('stroke-opacity', 0.4)
          .attr('stroke-width', 1.5)
          .selectAll('path')
          .data(root.links())
          .join('path')
          .attr(
            'd',
            (d: any) => `
        M${d.target.y},${d.target.x}
        C${d.source.y + root.dy / 2},${d.target.x}
         ${d.source.y + root.dy / 2},${d.source.x}
         ${d.source.y},${d.source.x}`
          );
        // circles
        svg
          .append('g')
          .selectAll('circle')
          .data(root.descendants())
          .join('circle')
          .attr('cx', (d: any) => d.y)
          .attr('cy', (d: any) => d.x)
          .attr('r', 3)
          .attr('fill', (d: any) => {
            if (d.data.color) {
              return d.data.color;
            }
            if (d.data.isValid) {
              return 'darkgreen';
            }
            if (d.data.isValid === false && !d.children) {
              return 'darkred';
            }
            return d.children ? '#555' : '#999';
          });
        // labels
        svg
          .append('g')
          .attr('font-family', 'sans-serif')
          .attr('font-size', 10)
          .attr('stroke-linejoin', 'round')
          .attr('stroke-width', 3)
          .attr('cursor', 'pointer')
          .selectAll('text')
          .data(root.descendants())
          .join('text')
          .on('click', (e, d) => {
            onClick && onClick(d);
          })
          .attr('x', (d: any) => d.y)
          .attr('y', (d: any) => d.x)
          .attr('dy', '0.31em')
          .attr('dx', (d: any) => (d.children ? -6 : 6))
          .text((d: any) => (d.children ? d.data.name : d.data.name + ' ➡ ' + d.data.path.join(' ')))
          .filter((d: any) => d.children)
          .attr('text-anchor', 'end')
          .clone(true)
          .lower()
          .attr('stroke', 'white');
        // svg.attr('viewBox', autoBox as any);
      }}
    />
  );
}

export function tree(nodes, width = 600) {
  const root: any = hierarchy(nodes);
  root.dx = 10;
  root.dy = width / (root.height + 1);
  return cluster().nodeSize([root.dx, root.dy])(root);
}
