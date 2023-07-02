import Layout from "./layout";

export const app_url = process.env.app_url

 
export default function MyApp({ Component, pageProps }:any) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

