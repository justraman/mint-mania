import "./globals.css";
import Header from "./_components/Header";
import Footer from "./_components/Footer";
import Head from "next/head";

const metadata = {
  title: "Mint Mania",
  description: "Mint Mania",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preload" href="/meme-font.ttf" as="font" crossOrigin="" />
        <title>{metadata.title}</title>
      </Head>
      <body className="bg-black text-white">
        <Header />
        <div className="md:px-20">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
