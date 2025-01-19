import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/header";

import UploadBookModal from "@/features/books/components/upload-book-modal";
import BookReaderModal from "@/features/books/components/book-reader-modal";
import { AppSidebar } from "@/components/app-sidebar";
import CreateCollectionModal from "@/features/collections/components/create-collection-modal";
import AddBooksToCollectionModal from "@/features/collections/components/add-books-to-collection-modal";
import AnnotaionModal from "@/features/annotations/components/annotations-modal";
import { Suspense } from "react";

type ReaderLayoutProps = {
  children: React.ReactNode;
};

export default function ReaderLayout({ children }: ReaderLayoutProps) {
  return (
    <div className="flex w-full h-full">
      <Suspense fallback={<div>Loading...</div>}>
        <UploadBookModal />
        <BookReaderModal />
        <CreateCollectionModal />
        <AddBooksToCollectionModal />
        <AnnotaionModal />
      </Suspense>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1">
          <div className="mx-auto max-w-screen-2xl h-screen">
            <Suspense>
              <Header />
            </Suspense>
            <main className="h-full p-4 flex flex-col">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
