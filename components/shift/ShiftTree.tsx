import Tree from '../rhythmical/components/Tree';
import { mapAST } from '../rhythmical/tree/rhythmAST';
import { parseScriptWithLocation } from 'shift-parser';
import { replace } from 'shift-traverser';
import { BindingIdentifier } from 'shift-ast';
import codegen from 'shift-codegen';
import { useMemo, useState } from 'react';

export function ShiftTree({ code: codeProp, editable }) {
  const [code, setCode] = useState(codeProp);
  const [error, setError] = useState<any>();
  const unified = useMemo(() => {
    try {
      const ast = parseScriptWithLocation(code);
      setError(undefined);
      return mapAST(ast.tree, (node) => {
        switch (node.type) {
          case 'Script':
            return {
              ...node,
              children: [...node.statements, ...node.directives],
            };
          case 'VariableDeclarationStatement':
            return {
              ...node,
              children: [node.declaration],
            };
          case 'VariableDeclaration':
            return {
              ...node,
              children: node.declarators,
            };
          case 'VariableDeclarator':
            return {
              ...node,
              children: [node.binding, node.init],
            };
          case 'BindingIdentifier':
            return {
              ...node,
              children: [],
            };
          case 'LiteralStringExpression':
            return {
              ...node,
              children: [],
            };
          case 'ExpressionStatement':
            return {
              ...node,
              children: [node.expression],
            };
          case 'CallExpression':
            return {
              ...node,
              children: [node.callee, ...node.arguments],
            };
          case 'IdentifierExpression':
            return {
              ...node,
              children: [],
            };
          case 'StaticMemberExpression':
            return {
              ...node,
              children: [node.object],
            };
          case 'LiteralNumericExpression':
            return {
              ...node,
              children: [],
            };
          default:
            console.warn('Unknown node type: ' + node.type, node);
            return node;
        }
      });
    } catch (err) {
      // console.warn(err);
      setError(err);
      return { type: 'error', children: [] };
    }
  }, [code]);
  return (
    <div>
      {/* <CodeMirror value={code} onChange={(e) => setCode(e.target.value)} className="w-full" /> */}
      {editable && <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full" />}
      {!!error && <pre>{error.message}</pre>}
      <Tree
        width={620}
        nodeRadius={20}
        dx={160}
        columns={[12, 12]}
        data={mapAST(unified, (node) => ({ ...node, name: node.type }))}
        hideJson={true}
      />
    </div>
  );
}

export const codeIn = `const x = 'a';`;

export const { tree: exampleAST, locations } = parseScriptWithLocation(codeIn);

export const exampleLocation = locations.get(exampleAST.statements[0].declaration.declarators[0].binding);

export const before = JSON.stringify(exampleAST, null, 2);

let bindingIdentifiers = 0;
export const exampleASTshifted = replace(exampleAST, {
  enter(node, parent) {
    if (node.type === 'BindingIdentifier') {
      return new BindingIdentifier({
        name: `v${bindingIdentifiers++}`,
      });
    }
    return node;
  },
});

export const after = JSON.stringify(exampleASTshifted, null, 2);

export const codeOut = codegen(exampleASTshifted);
