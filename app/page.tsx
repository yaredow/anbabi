import Header from "@/components/header";
import EpubUploader from "@/features/books/components/ebook-uploader";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Books</h1>
          <EpubUploader />
        </div>
        <BookShelf books={books} />
      </main>
    </div>
  );
}
