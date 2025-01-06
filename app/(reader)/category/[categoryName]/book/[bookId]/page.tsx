type BookWithIdProps = {
  params: {
    bookId: string;
  };
};

export default async function BookWithId({ params }: BookWithIdProps) {
  const bookId = params.bookId;
  return <main>{bookId}</main>;
}
