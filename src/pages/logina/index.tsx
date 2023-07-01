// 'use server'

import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { cookies } from 'next/headers'
 
type Repo = {
  name: string
  stargazers_count: number
}
 
var generateRandomString = function(length: number) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

export const getServerSideProps: GetServerSideProps<{
  repo: any
}> = async () => {
    var state = generateRandomString(16);
    var scope = 'user-modify-playback-state user-read-currently-playing user-read-private';
    const repo = {};

//   const res = await fetch('https://api.github.com/repos/vercel/next.js')
//   const repo = await res.json()
  return { props: { repo } }
}
 
// export default function Page({
//   repo,
// }: InferGetServerSidePropsType<typeof getServerSideProps>) {
//   return repo.stargazers_count
// }
