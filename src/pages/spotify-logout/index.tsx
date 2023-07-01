'use client'

import useAuthService from "@/hooks/AuthService";
import { useEffect } from "react";

export default function Logout() {
  const spotifyAuthService = useAuthService('spotify');

    useEffect(() => {
        spotifyAuthService.clear()
    }, [])
    return <main><p className='text-center bg-black p-4 border-green-700 border-2'>You are no longer logged in</p></main>;
}