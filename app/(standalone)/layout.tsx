import BookReaderModal from "@/features/books/components/book-reader-modal";
import React from "react";

type StandaloneLayoutProps = {
  children: React.ReactNode;
};

export default function StandaloneLayout({ children }: StandaloneLayoutProps) {
  return (
    <main className="min-h-screen">
      <div className="flex flex-col items-center justify-center py-4">
        <BookReaderModal />
        {children}
      </div>
    </main>
  );
}
