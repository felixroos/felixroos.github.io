import NextImage from 'next/image';
import { useState } from 'react';

function Img({ src, width = 750, height = 200, alt }: { width: number; height: number; src: string; alt?: string }) {
  const [dimensions, setDimensions] = useState({ width, height });
  return (
    <span className="block relative" style={dimensions}>
      <NextImage
        src={src}
        alt={alt || src}
        layout="fill"
        objectFit="cover"
        unoptimized
        onLoad={(e) => {
          const { naturalWidth, naturalHeight } = (e?.nativeEvent as any)?.path?.[0];
          const ratio = naturalWidth / naturalHeight;
          const dim = { width: Math.min(naturalWidth, width), height: Math.min(naturalHeight, width / ratio) };
          setDimensions(dim);
        }}
      />
    </span>
  );
}

export default Img;
