'use client';

import { useState } from 'react';

export default function PostImage({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc('/fallback-image.jpg'); // Replace with your fallback image URL
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className="w-full h-64 object-cover mb-4"
      onError={handleError}
    />
  );
}