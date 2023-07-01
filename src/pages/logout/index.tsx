'use client'

import authSerice from "@/spotifyApi/AuthService";
import { useEffect } from "react";

export default function Logout() {
    useEffect(() => {
        authSerice.clear()
    }, [])
    return <main><p className='text-center bg-black p-4 border-green-700 border-2'>You are no longer logged in</p></main>;
}