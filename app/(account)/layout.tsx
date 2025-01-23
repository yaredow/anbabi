type AccountLayoutProps = {
  children: React.ReactNode;
};

export default function AccountLayout({ children }: AccountLayoutProps) {
  return (
    <div className="flex w-full bg-neutral-100 items-center justify-center min-h-screen">
      {children}
    </div>
  );
}
