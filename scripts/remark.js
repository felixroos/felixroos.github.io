main();

async function main() {
  const { fromMarkdown } = await import('mdast-util-from-markdown');
  const ast = fromMarkdown(
    "'# Test\n\nIn botany, a tree is a perennial plant with\n\n- an elongated stem, or trunk,\n- supporting branches\n- leaves\n'"
  );
  console.log(JSON.stringify(ast, null, 2));
}
