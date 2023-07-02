import useAuthService from "@/hooks/AuthService";
import { LyricsProps } from "./model";
import { createRef, useEffect, useRef, useState } from "react";
import { geniusSearch } from "@/externalApi/geniusApi/methods/Search";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import style from "./style.module.css";
import { geniusGetLyricsForTrack } from "./LyricsExtractMethods";

export default function Lyrics(track: LyricsProps) {
  const geniusAuthService = useAuthService("genius");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [firstLoaded, setFirstLoaded] = useState(false);

  const [text, setText] = useState<string | undefined>(undefined);
  const [oldText, setOldText] = useState<string | undefined>(undefined);

  useEffect(() => {
    const isLoggedIn = geniusAuthService.isLoggedIn();
    setIsLoggedIn(isLoggedIn);
    if (isLoggedIn) {
      fetchSong();
    }
  }, [track]);

  const fetchSong = async () => {
    setIsLoading(true);
    setText(undefined);
    try {
      const lyricsText = await geniusGetLyricsForTrack(geniusAuthService.getBearer(), track);

      setText(lyricsText);
      if (!firstLoaded) {
        setOldText(lyricsText);
        setTimeout(() => {
          setFirstLoaded(true);
          setText(undefined);
        }, 1000);
      } else {
        setTimeout(() => {
          setOldText(lyricsText);
          setText(undefined);
        }, 1000);
      }

    } catch (e) {
      const error = e as AxiosError;
      if (error.status == 401) {
        geniusAuthService.clear();
        setIsLoggedIn(false);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="overflow-x-hidden relative">
      {!isLoggedIn && (
        <Link href="/api/genius/login">
          <div className="bg-slate-500 mt-20 mx-auto p-4 w-64">
            Login to genius to see lyrics
          </div>
        </Link>
      )}
      {(!!text || !!oldText) && (
        <div className={`flex justify-center overflow-hidden relative text-base md:text-lg lg:text-xl ${style.textContainer}`}>
          <p
            className="whitespace-pre-line bg-black w-full md:w-fit px-5 md:px-8 xl:px-24"
            style={{ visibility: firstLoaded ? "visible" : "hidden" }}
          >
            {oldText}
          </p>
          {!!text && (
            <>
              <p className="whitespace-pre-line bg-black w-full md:w-fit px-5 md:px-8 xl:px-24">{text}</p>
              <p className="whitespace-pre-line bg-black w-full md:w-fit px-5 md:px-8 xl:px-24">{text}</p>
              <p className="whitespace-pre-line bg-black w-full md:w-fit px-5 md:px-8 xl:px-24">{text}</p>
              <p className="whitespace-pre-line bg-black w-full md:w-fit px-5 md:px-8 xl:px-24">{text}</p>
              <p className="whitespace-pre-line bg-black w-full md:w-fit px-5 md:px-8 xl:px-24">{text}</p>
            </>
          )}
        </div>
      )}
      {isLoading && (
        <div
          className={`absolute top-0 h-3 left-0s w-full ${style.loadingBg}`}
        />
      )}
    </div>
  );
}

