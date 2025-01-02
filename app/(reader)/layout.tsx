import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import Header from "@/components/header";

type ReaderLayoutProps = {
  children: React.ReactNode;
};

export default function ReaderLayout({ children }: ReaderLayoutProps) {
  return (
    <div className="flex w-full h-full">
      <div className="w-full">
        <div className="mx-auto max-w-screen-2xl h-full">
          <Header />
          <main className="h-full py-6 px-6 flex flex-col">
            <SidebarProvider>
              <AppSidebar />
              {children}
            </SidebarProvider>
          </main>
        </div>
      </div>
    </div>
  );
}
