"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface Props extends Omit<ImageProps, "src"> {
  src: string;
  fallbackSrc?: string;
  fallbackColor?: string;
}

export default function ImageWithFallback({
  src,
  fallbackSrc,
  fallbackColor = "rgba(201,168,76,0.15)",
  alt,
  fill,
  style,
  ...rest
}: Props) {
  const [imgSrc, setImgSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        style={{
          ...(fill ? { position: "absolute", inset: 0 } : {}),
          background: `radial-gradient(circle at 40% 40%, ${fallbackColor}, rgba(6,6,6,0.8))`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...style,
        }}
      >
        <span
          style={{
            fontSize: 64,
            fontWeight: 900,
            color: "rgba(201,168,76,0.4)",
            fontFamily: "'Helvetica Neue',Helvetica,Arial,sans-serif",
            userSelect: "none",
          }}
        >
          AC
        </span>
      </div>
    );
  }

  return (
    <Image
      {...rest}
      src={imgSrc}
      alt={alt}
      fill={fill}
      style={style}
      onError={() => {
        if (fallbackSrc && imgSrc !== fallbackSrc) {
          setImgSrc(fallbackSrc);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}
