import React, { useState, useMemo } from "react"
import { MyTree } from "./Tree"

const circle = {
  shape: "circle",
  shapeProps: {
    cx: 0,
    cy: 0,
    r: 20,
    stroke: "transparent",
  },
}

export function filledShape(shape, fill) {
  return {
    ...shape,
    shapeProps: { ...shape.shapeProps, fill },
  }
}

export function insertChildren(tree, path, children) {
  const nodes = children.map(name => ({
    id: name,
    children: [],
    nodeSvgShape: filledShape(circle, name),
  }))
  if (!path.length) {
    tree.children = tree.children.concat(nodes)
    return
  }
  const match = tree.children.find(child => child.id === path[0])
  if (!match) {
    console.error("no match", path, tree)
    return
  }
  path.shift()
  insertChildren(match, path, children)
}

export function Analyzer({ render }) {
  const tree: any = { children: [], executions: 0 }
  const [result, setResult] = useState<any>()
  const rendered = useMemo(
    () =>
      render({
        tree,
        stop: () => setResult({ ...tree }),
        start: () => {
          tree.children = []
          tree.executions = 0
        },
        analyze: (collected, available) => {
          insertChildren(tree, [...collected], [...available])
          tree.executions = tree.executions + 1
          return available
        },
      }),
    [/* tree,  */ render]
  )
  return (
    <>
      <div>{rendered}</div>

      {result && (
        <div>
          <p>Permutation Graph ({!!result && result.executions} nodes)</p>
          <MyTree data={result} />
        </div>
      )}
    </>
  )
}
