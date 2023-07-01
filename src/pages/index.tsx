"use client";

import Lyrics from "@/app/components/Lyrics";
import { LyricsProps } from "@/app/components/Lyrics/model";
import Player from "@/app/components/Player";
import useAuthService from "@/hooks/AuthService";
import { getUserProfile } from "@/spotifyApi/methods/GetUserProfile";
import { UserProfile } from "@/spotifyApi/types/UserProfile";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function getHashParams() {
  var hashParams: { [name: string]: string } = {};
  var e,
    r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while ((e = r.exec(q))) {
    if (e) hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

export default function Home() {
  const router = useRouter();
  const spotifyAuthService = useAuthService('spotify');
  const geniusAuthService = useAuthService('genius');
  
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<LyricsProps | undefined>(
    undefined
  );

  const processHashParams = (params: { [name: string]: string }) => {
    console.log(params)
    if (params.spotify_error) {
      spotifyAuthService.clear();
    } else if (params.spotify_access_token) {
      spotifyAuthService.setBearer(params.spotify_access_token);
      if (params.spotify_refresh_token) {
        spotifyAuthService.setRefresh(params.spotify_refresh_token);
      }
      if (params.spotify_token_expires_at) {
        spotifyAuthService.setExpiresAt(params.spotify_token_expires_at);
      }
    }

    if(params.genius_access_token){
      geniusAuthService.setBearer(params.genius_access_token);
    }
  };

  const setProfile = async () => {
    try {
      const profile = await getUserProfile(spotifyAuthService.getBearer());
      setUserProfile(profile);
    } catch (e: any) {
      console.log(e);
      if (e.response?.status === 401) {
        router.replace("/api/spotify/login");
      }
    }
  };

  useEffect(() => {
    var params = getHashParams();
    if (params) processHashParams(params);

    const isLoggedIn = spotifyAuthService.isLoggedIn();
    setIsLoggedIn(isLoggedIn);

    if (isLoggedIn) {
      setProfile();
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-between">
      <div className="jumbotron text-center w-full">
        {isLoggedIn && (
          <>
            <p className="py-1">Logged in as {userProfile?.display_name}</p>
            <Player trackChanged={setCurrentTrack} />
            {currentTrack && <Lyrics {...currentTrack} />}
          </>
        )}

        {!isLoggedIn && (
          <a href="/api/spotify/login">
            <div className="bg-slate-500 mt-20 mx-auto p-4 w-64">
              Login to spotify
            </div>
          </a>
        )}
      </div>
    </main>
  );
}