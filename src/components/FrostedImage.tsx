import React from "react";

type FrostedImageProps = {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  placeholder?: string; // optional LQIP or blurred version
};

export default function FrostedImage({
  src,
  alt,
  width = "100%",
  height = "auto",
  className = "",
  placeholder,
}: FrostedImageProps) {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <div
      style={{ width, height }}
      className={`relative overflow-hidden rounded-lg ${className}`}
    >
      {/* Placeholder / Frosted blur */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage: `url(${placeholder || src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(20px) brightness(0.9)",
          transform: "scale(1.1)", // avoid edges showing
        }}
      />

      {/* Main image */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
