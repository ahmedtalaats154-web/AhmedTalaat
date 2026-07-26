import "./globals.css";

import fs from 'fs';
import path from 'path';

export async function generateMetadata() {
  try {
    const dataFilePath = path.join(process.cwd(), 'src', 'data', 'content.json');
    const fileContents = fs.readFileSync(dataFilePath, 'utf8');
    const data = JSON.parse(fileContents);
    const seo = data.seo || {};

    return {
      title: seo.title || "Ahmed — Graphic Designer & Video Editor",
      description: seo.description || "Portfolio of Ahmed — a creative graphic designer and video editor crafting visual stories that captivate and inspire.",
      keywords: ["graphic design", "video editing", "creative portfolio", "motion design", "visual storytelling"],
      authors: [{ name: "Ahmed" }],
      openGraph: {
        title: seo.title || "Ahmed — Graphic Designer & Video Editor",
        description: seo.description || "Portfolio of Ahmed.",
        type: "website",
        images: seo.ogImage ? [seo.ogImage] : [],
      },
    };
  } catch (error) {
    return {
      title: "Ahmed Portfolio",
      description: "Portfolio of Ahmed",
    };
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="grain-overlay">{children}</body>
    </html>
  );
}
