import type { Metadata } from "next";
import { Bebas_Neue, Cormorant_Garamond, Instrument_Sans, Inter_Tight, Manrope, Newsreader, Poppins } from "next/font/google";
import { getStoredConfig } from "../../lib/config-store";
import { summarizeProjects } from "../../lib/eu-visual";
import EuVisualClient from "./EuVisualClient";
import "./eu-visual.css";

const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--eu-sans", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], variable: "--eu-serif", display: "swap" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--eu-bebas", display: "swap", preload: false });
const poppins = Poppins({ subsets: ["latin"], weight: "400", variable: "--eu-poppins", display: "swap", preload: false });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"], variable: "--eu-cormorant", display: "swap", preload: false });
const manrope = Manrope({ subsets: ["latin"], variable: "--eu-manrope", display: "swap", preload: false });
const interTight = Inter_Tight({ subsets: ["latin"], variable: "--eu-inter-tight", display: "swap", preload: false });
export const dynamic = "force-dynamic";
const pageTitle = "Ahmed Talaat — Social Media Content & Art Direction";
const pageDescription = "Campaign concepts, social media design, AI visuals and short-form video for brands that want clearer, more consistent content.";
const canonicalUrl = "https://ahmed-talaat.com/eu-visual";
const previewImage = "https://ahmed-talaat.com/og.png";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: canonicalUrl,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
    type: "website",
    siteName: "Ahmed Talaat",
    images: [
      {
        url: previewImage,
        width: 1733,
        height: 907,
        alt: "PLAY / EDIT graphic design and video creative world",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [previewImage],
  },
};
export default async function EuVisualPage() {
  const config = await getStoredConfig();
  const eu = config.euVisual;
  return <div className={`${instrument.variable} ${newsreader.variable} ${bebas.variable} ${poppins.variable} ${cormorant.variable} ${manrope.variable} ${interTight.variable}`}>
    <EuVisualClient initialData={{ title: eu.title, headline: eu.headline, description: eu.description, brand: config.identity.brand, theme: config.theme, projects: summarizeProjects(eu) }} />
  </div>;
}
