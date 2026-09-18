import { Instrument_Sans, Newsreader } from "next/font/google";
import { getStoredConfig } from "../../lib/config-store";
import { summarizeProjects } from "../../lib/eu-visual";
import EuVisualClient from "./EuVisualClient";
import "./eu-visual.css";

const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--eu-sans", display: "swap" });
const newsreader = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], variable: "--eu-serif", display: "swap" });
export const dynamic = "force-dynamic";
export const metadata = {
  title: "EU Visual — Ahmed Talaat",
  description: "Selected concept projects for European hospitality and retail. Social design, campaign thinking and art direction.",
};
export default async function EuVisualPage() {
  const config = await getStoredConfig();
  const eu = config.euVisual;
  return <div className={`${instrument.variable} ${newsreader.variable}`}>
    <EuVisualClient initialData={{ title: eu.title, headline: eu.headline, description: eu.description, brand: config.identity.brand, projects: summarizeProjects(eu) }} />
  </div>;
}

