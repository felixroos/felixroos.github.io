import React from 'react';
import { select } from 'd3-selection';
import { cluster, hierarchy, tree } from 'd3-hierarchy';
import { NestedArray } from '../helpers/arrays';

// todo: use https://github.com/klortho/d3-flextree + rects width variable width to show duration

export default function Tree(props) {
  let { width = 420, height = 300, data, onClick, selected, theme, nodeRadius, dx, dy } = props;
  const h = hierarchy(data);
  //const root = cluster().nodeSize([dx || 40, dy || height / (h.height + 1)])(h);
  const root = tree().nodeSize([dx || 40, dy || height / (h.height + 1)])(h);
  let viewBox, linker;
  viewBox = `${-width / 2} -20 ${width} ${height}`;
  linker = (d: any) => `
    M${d.target.x},${d.target.y}
    L${d.source.x},${d.source.y}`;
  theme = theme || {
    selected: 'red',
    parent: 'blue',
    child: 'green',
    default: 'gray',
    sibling: 'yellow',
    childLink: 'gray',
    parentLink: 'gray',
    siblingLink: 'gray',
  };
  function isParent(d) {
    return !!d.data.name && selected?.parent?.data?.name === d.data.name;
  }
  function isChild(d) {
    return !!d.data.name && selected?.children?.find(({ data }) => data.name === d.data.name);
  }
  function isSelected(d) {
    return !!d.data.name && selected?.data.name === d.data.name;
  }
  function isSibling(d) {
    return !!d.data.name && selected?.parent?.children?.find((node) => node.data.name === d.data.name);
  }
  function nodeColor(d) {
    if (!!d.data.color) {
      return d.data.color;
    }
    if (isSelected(d)) {
      return theme.selected;
    }
    if (isChild(d)) {
      return theme.child;
    }
    if (isParent(d)) {
      return theme.parent;
    }
    if (isSibling(d)) {
      return theme.sibling;
    }
    return theme.default;
  }
  function linkColor(link) {
    if (isSelected(link.source)) {
      return theme.childLink;
    }
    if (isSelected(link.target)) {
      return theme.parentLink;
    }
    if (isParent(link.source)) {
      return theme.siblingLink;
    }
    if (isSelected(link.target) || isSelected(link.source)) {
      return 'black';
    }
    return theme.default;
  }
  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      className="max-w-full"
      ref={(el) => {
        const svg = select(el);
        svg.selectAll('*').remove();
        // lines
        svg
          .append('g')
          .attr('fill', 'none')
          .attr('stroke-opacity', 0.4)
          .attr('stroke-width', 3)
          .attr('stroke', 'gray')
          .selectAll('path')
          .data(root.links())
          .join('path')
          .attr('d', linker);
        // circles
        svg
          .append('g')
          .selectAll('circle')
          .data(root.descendants())
          .join('circle')
          .attr('cx', (d: any) => d.x)
          .attr('cy', (d: any) => d.y)
          .attr('fill', nodeColor)
          .attr('r', nodeRadius || 15)
          .on('click', onClick)
          .attr('cursor', 'pointer');

        const fontSize = 12;
        const strokeWidth = 3;
        // labels
        svg
          .append('g')
          .attr('font-family', 'sans-serif')
          .attr('font-size', fontSize)
          .attr('stroke-linejoin', 'round')
          .attr('stroke-width', strokeWidth)
          .selectAll('text')
          .data(root.descendants())
          .join('text')
          .attr('x', (d: any) => d.x)
          .attr('y', (d: any) => d.y)
          .attr('dy', fontSize / 3)
          .attr('dx', '0')
          .text((d: any) => d.data.name)
          .on('click', onClick)
          .attr('cursor', 'pointer')
          .attr('text-anchor', 'middle')
          // .filter((d: any) => d.children)
          // .attr('dy', -strokeWidth)
          .clone(true)
          .lower()
          .attr('stroke', 'white');
        // svg.attr('viewBox', autoBox as any);
      }}
    />
  );
}

export function rhythmicalHierarchy<T>(rhythm: NestedArray<T>) {
  return {
    children: rhythm.map((n) => {
      if (Array.isArray(n)) {
        return rhythmicalHierarchy(n);
      }
      return { name: n };
    }),
  };
}

export function d3Path(node, path = []) {
  if (!node.parent) {
    return path;
  }
  return d3Path(node.parent, [node.parent.children.indexOf(node)].concat(path));
}

// deprecated? only used in more-trees draft
export function colorizePath(node, path: number[], colors, fallback) {
  if (path.length && (!node || d3Path(node).join(':').startsWith(path.join(':')))) {
    return {
      color: colors[path.length - 1],
    };
  } else if (fallback) {
    return { color: fallback };
  }
  return {};
}
