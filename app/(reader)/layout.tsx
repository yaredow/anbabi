import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/header";

import UploadBookModal from "@/features/books/components/upload-book-modal";
import BookReaderModal from "@/features/books/components/book-reader-modal";
import { AppSidebar } from "@/components/app-sidebar";

type ReaderLayoutProps = {
  children: React.ReactNode;
};

export default function ReaderLayout({ children }: ReaderLayoutProps) {
  return (
    <div className="flex w-full h-full">
      <UploadBookModal />
      <BookReaderModal />
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1">
          <div className="mx-auto max-w-screen-2xl h-full">
            <Header />
            <main className="h-full p-4 flex flex-col">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
