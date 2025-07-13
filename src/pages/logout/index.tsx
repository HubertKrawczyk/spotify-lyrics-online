"use client";

import { REGION_AZURE, TOKEN_AZURE, TOKEN_DEEPL } from "@/app/components/TranslateMenu";
import useAuthService from "@/hooks/AuthService";
import { useEffect } from "react";

export default function Logout() {
  const spotifyAuthService = useAuthService("spotify");
  const geniusAuthService = useAuthService("genius");

  useEffect(() => {
    spotifyAuthService.clear();
    geniusAuthService.clear();
    localStorage.removeItem(TOKEN_AZURE);
    localStorage.removeItem(TOKEN_DEEPL);
    localStorage.removeItem(REGION_AZURE);
  }, []);
  return (
    <main>
      <p className="text-center bg-black p-4 border-green-700 border-2">
        You are no longer logged in
      </p>
    </main>
  );
}
