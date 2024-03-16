import "@/styles/globals.css";
import "@scottish-government/design-system/dist/css/design-system.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
