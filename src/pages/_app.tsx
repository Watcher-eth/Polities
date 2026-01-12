import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { Playfair_Display, Libre_Franklin, Tinos } from "next/font/google";

const headline = Playfair_Display({ subsets: ["latin"], variable: "--font-headline" });
const ui = Libre_Franklin({ subsets: ["latin"], variable: "--font-ui" });
const body = Tinos({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-body" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${headline.variable} ${ui.variable} ${body.variable}`}>
      <Component {...pageProps} />
    </div>
  );
}