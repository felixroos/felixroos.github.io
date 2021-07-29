/*
 TBD: create shell for d3, similar to Sketch.tsx (for p5)
 this will be good to embed d3 code from others, 
   like https://github.com/jackschaedler/circles-sines-signals/blob/master/js/fourier_transform_basic.js
 => goal: only copy paste + minor refactoring needed 

 https://jackschaedler.github.io/circles-sines-signals/dft_introduction.html
*/
import React from 'react';
import { select } from 'd3-selection';

export default function D3Shell({ render }) {
  return (
    <div
      style={{ width: '100%', overflow: 'auto' }}
      ref={(el) => {
        if (el) {
          el.innerHTML = '';
          render && render(select(el));
        }
      }}
    />
  );
}
