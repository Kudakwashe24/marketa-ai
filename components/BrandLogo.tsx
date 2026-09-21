import Image from "next/image";

type BrandLogoProps = {
  size?: "small" | "medium";
  className?: string;
};

const sizes = {
  small: "h-8 w-8 rounded-lg",
  medium: "h-9 w-9 rounded-xl",
};

export default function BrandLogo({
  size = "small",
  className = "",
}: BrandLogoProps) {
  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden bg-white shadow-lg shadow-violet-950/40 ${sizes[size]} ${className}`}
      aria-hidden="true"
    >
      <Image
        src="/marketa-logo.jpg"
        alt=""
        fill
        sizes={size === "medium" ? "36px" : "32px"}
        className="scale-110 object-cover"
      />
    </span>
  );
}
