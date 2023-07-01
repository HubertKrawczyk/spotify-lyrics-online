import './globals.css'
import { Metadata } from 'next'
import Head from 'next/head'
import NavigationMenu from "@/app/components/NavigationMenu";
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

export default function Layout({ children }: any) {
  return (
    <>
      <Head>
        <title>Spotify Lyrics Online</title>
      </Head>
      <Header></Header>
      <NavigationMenu />
      <main >{children}</main>
      <Footer />
    </>
  )
}
