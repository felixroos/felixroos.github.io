import { hierarchy, HierarchyNode } from 'd3-hierarchy';
import { sum, max } from 'd3-array';

export type Path = [number, number, number];

export function rhythmChildren(node) {
  return Array.isArray(node) ? node : node.parallel || node.sequential
}

export function rhythmHierarchy(rhythm): HierarchyNode<any> {
  return hierarchy(rhythm, rhythmChildren);
  //return hierarchy(hierarchyJSON(rhythm, rhythmChildren)) // passes raw json to d3
}

// calculates fractional path for given node by looking at ancestors
export function rhythmPath(node: HierarchyNode<any>): Path[] {
  return node.ancestors().reduce((path, { children: siblings, parent, data }, i, all) => {
    if (!i) { // first ancestor is node itself => ignore
      return path;
    }
    const durations = siblings.map(({ data }) => data.duration ?? 1);
    const parentDuration = parent ? parent.data?.duration || 1 : 1;
    const index = siblings.indexOf(all[i - 1])
    const position = sum(durations.slice(0, index));
    const total = sum(durations);
    let currentPath;
    if (data.parallel) { // parallel path
      currentPath = [
        0,
        parentDuration * durations[index],
        max(durations)
      ]
    } else { // sequential path
      currentPath = [
        position,
        durations[index],
        total
      ]
    }
    return [currentPath, ...path]
  }, []);
}

// turns rhythm json to flat events with time & duration (including non leaves!)
export function rhythmEvents(rhythm) {
  let flat = [];
  const root = rhythmHierarchy(rhythm);
  // test if rootDuration is needed => see sequential.ts#31 comment
  const rootDuration = root.data.duration || root.children?.length || 1;
  root.eachBefore(node => {
    const path = rhythmPath(node);
    flat.push({
      value: node.data,
      path,
      ...pathTimeDuration(path, rootDuration)
    })
  });
  return flat;
}

export function pathTimeDuration(path: Path[], whole = 1) {
  let time = 0;
  let duration = whole;
  for (let i = 0; i < path.length; i++) {
    time = time + path[i][0] / path[i][2] * duration
    duration *= path[i][1] / path[i][2];
  }
  return { time, duration };
}
