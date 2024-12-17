"use client";

import { motion } from "framer-motion";

interface BookShelfLoaderProps {
  className?: string;
}

export default function BookShelfLoader({
  className = "",
}: BookShelfLoaderProps) {
  const books = [
    { color: "bg-pink-500", stripes: "bg-blue-900", stripeCount: 2 },
    { color: "bg-green-500", stripes: "bg-white", stripeCount: 2 },
    { color: "bg-teal-500", stripes: "bg-white", stripeCount: 2 },
    {
      color: "bg-yellow-400",
      stripes: "bg-brown-600",
      stripeCount: 2,
      topOnly: true,
    },
    { color: "bg-purple-500", stripes: "bg-black", stripeCount: 1 },
  ];

  return (
    <div className={`relative w-60 h-60 ${className}`}>
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-40 h-2 bg-orange-500" />
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-end justify-center gap-1">
        {books.map((book, index) => (
          <motion.div
            key={index}
            className="relative w-8 h-32 origin-bottom"
            animate={{
              rotate: [0, 5, 0],
              transition: {
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              },
            }}
          >
            <div
              className={`absolute inset-0 ${book.topOnly ? "bg-brown-600" : book.color}`}
            >
              {book.topOnly ? (
                <div
                  className={`absolute top-0 left-0 right-0 h-8 ${book.color}`}
                >
                  {Array.from({ length: book.stripeCount }).map((_, i) => (
                    <div
                      key={i}
                      className={`absolute left-0 right-0 h-1 ${book.stripes}`}
                      style={{ top: `${(i + 1) * 3}px` }}
                    />
                  ))}
                </div>
              ) : (
                Array.from({ length: book.stripeCount }).map((_, i) => (
                  <div
                    key={i}
                    className={`absolute left-0 right-0 h-2 ${book.stripes}`}
                    style={{ top: `${(i + 1) * 6}px` }}
                  />
                ))
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
