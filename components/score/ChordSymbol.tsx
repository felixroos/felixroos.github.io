import * as React from 'react';
import { BbChordSymbolOptions, BbFormat } from 'bb-chord-symbol';
import { useRef } from 'react';
import { NestedArray } from '../rhythmical/helpers/arrays';
import { mapNestedArray } from '../rhythmical/tree/mapNestedArray';
import scaleColor from '../sets/scaleColor';

export default function ChordSymbol({ chord, margin, fontSize, fontFamily }: any) {
  margin = margin || 4;
  fontSize = fontSize || '30px';
  fontFamily = fontFamily || 'Petaluma Script';
  const canvasRef = useRef(null);
  const font = `${fontSize} ${fontFamily}`;
  React.useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const draw = (ctx) => {
      ctx.save();
      ctx.font = font;
      const formatter = new BbFormat(ctx);

      // Modify the formatter's config
      const options = new BbChordSymbolOptions();
      //options.parentheses.type = '[]';
      options.useMinusSignForMinorChords = true;
      options.descriptor.verticalOffset = 0;
      options.separator.angle = (Math.PI * 20) / 360;

      const laidOutChord = formatter.layoutChordSymbol(chord);
      if (!laidOutChord) return;

      ctx.canvas.width = laidOutChord.bbox.width + margin * 2;
      ctx.canvas.height = laidOutChord.bbox.height + margin * 2;

      // After resizing the canvas, the context is reset
      ctx.font = font;

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      ctx.translate(margin, margin - laidOutChord.bbox.y);
      formatter.fillText(laidOutChord, laidOutChord.bbox.x, laidOutChord.bbox.y + laidOutChord.yOverflow);
      ctx.restore();
    };
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    draw(context);
  }, [chord, canvasRef.current]);

  return <canvas width="1px" height="1px" ref={(c) => (canvasRef.current = c)} />;
}

export function renderChordSymbols(chords: NestedArray<string>, options?, scales?) {
  let i = 0;
  return mapNestedArray(chords, (node) => {
    if (!Array.isArray(node)) {
      const backgroundColor = scales ? scaleColor(scales[i]) : 'white';
      i++;
      return (
        <div style={{ backgroundColor, width: '100%', height: '100%' }}>
          <ChordSymbol chord={node} {...options} />
        </div>
      );
    }
    return node;
  });
}
