/** 1440px frame with the Figma 80px side gutters (fluid on smaller screens). */
export default function Container({ as: Tag = "div", className = "", children, ...props }) {
  return (
    <Tag className={`page-gutter mx-auto w-full max-w-[1440px] ${className}`} {...props}>
      {children}
    </Tag>
  );
}
