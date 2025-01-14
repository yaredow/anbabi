type StandaloneLayoutPr = {
  children: React.ReactNode;
};

export default function StandaloneLayout({ children }: StandaloneLayoutPr) {
  return <div>{children}</div>;
}
