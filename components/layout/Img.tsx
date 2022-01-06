import NextImage from 'next/image';
import { useState } from 'react';

function Img({ src, alt }: { width: number; height: number; src: string; alt?: string }) {
  let [url, q = ''] = src.split('?');
  url = url.startsWith('.') ? url.slice(1) : url;
  const [width, height] = q.split('&').map((s) => s.split('=')[1]);
  // console.log(width, height, url);
  if (!width || !height || url.startsWith('http')) {
    return <img src={url} alt={alt} width={width} height={height} />;
  }
  return <NextImage src={url} alt={alt || url} width={width} height={height} />;
}

export default Img;
