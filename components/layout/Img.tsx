import NextImage from 'next/image';

function Img({ src, alt }: { width: number; height: number; src: string; alt?: string }) {
  let [url, q = ''] = src.split('?');
  url = url.startsWith('.') ? url.slice(1) : url;
  const [width, height] = q.split('x');
  // console.log(width, height, url);
  if (!width || !height || url.startsWith('http')) {
    return <img src={url} alt={alt} width={width} height={height} />;
  }
  return <NextImage src={url} alt={alt || url} width={width} height={height} />; // placeholder="blur"
}

export default Img;
