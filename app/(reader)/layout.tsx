import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import Header from "@/components/header";

import UploadBookModal from "@/features/books/components/upload-book-modal";

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
            <UploadBookModal />
            <Header />
            <main className="h-full p-4 flex flex-col">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
