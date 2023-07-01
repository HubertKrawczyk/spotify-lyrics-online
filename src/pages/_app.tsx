import { Metadata } from "next";
import Layout from "./layout";


 
export default function MyApp({ Component, pageProps }:any) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

