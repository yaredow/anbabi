import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import Header from "@/components/header";

type ReaderLayoutProps = {
  children: React.ReactNode;
};

export default function ReaderLayout({ children }: ReaderLayoutProps) {
  return (
    <div className="flex w-full h-full">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1">
          <div className="mx-auto max-w-screen-2xl h-full">
            <Header />
            <main className="h-full py-6 px-6 flex flex-col">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
