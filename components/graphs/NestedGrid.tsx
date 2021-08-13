import * as React from 'react';

export const gridStyle = (cells, gridGap = '1px') => ({
  display: 'grid',
  gridTemplateColumns: cells.map((n) => `${n}fr`).join(' '),
  gridGap,
});
export const boxStyle = { border: '1px solid #444', padding: '1px' };

export default function NestedGrid(props: any) {
  const { cells, outerBorders, innerBorders, rows } = props;
  if (!Array.isArray(cells)) {
    return <div style={{ ...(innerBorders ? boxStyle : {}), whiteSpace: 'nowrap', overflow: 'auto' }}>{cells}</div>;
  }
  return (
    <div style={{ ...(outerBorders ? boxStyle : {}), ...gridStyle(rows || cells.map(() => 1)) }}>
      {cells?.map((content, i) => (
        <NestedGrid key={i} {...props} cells={content} rows={undefined} />
      ))}
    </div>
  );
}
