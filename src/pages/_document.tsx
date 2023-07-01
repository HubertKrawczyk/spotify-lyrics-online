import Document, { Html, Main, Head, NextScript } from "next/document";
import Layout from "./layout";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body
          style={{
            backgroundImage:
              "url(/bg" + (1 + Math.floor(Math.random() * 4)) + ".png)",
          }}
        >
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
