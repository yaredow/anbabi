import { Metadata } from "next";

const TITLE = "Anbabi";
const DESCRIPTION =
  "A web based ebook reader built with Next.js and TypeScript.";

const BASE_URL = "https://anbabi.yaredyilma.dev";

const siteConfig: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
  },
  applicationName: "Anbabi",
  creator: "Yared Yilma",
  alternates: {
    canonical: BASE_URL,
  },
  keywords: [
    "web based ebook reader",
    "dictionary",
    "wikipedia",
    "AI chat",
    "books",
    "ebooks",
    "online library",
    "digital books",
    "reading",
  ],
  metadataBase: new URL(BASE_URL),
};

export default siteConfig;
