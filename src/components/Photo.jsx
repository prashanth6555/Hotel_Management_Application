import { useEffect, useState } from "react";
import { FALLBACK_PHOTO } from "../data/hotels";

export default function Photo({ src, alt, priority = false }) {
  const [current, setCurrent] = useState(src);

  useEffect(() => {
    setCurrent(src);
  }, [src]);

  return (
    <img
      src={current}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => {
        setCurrent((value) => (value === FALLBACK_PHOTO ? value : FALLBACK_PHOTO));
      }}
    />
  );
}
