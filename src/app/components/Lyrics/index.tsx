import useAuthService from "@/hooks/AuthService";
import { LyricsProps } from "./model";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import Link from "next/link";
import style from "./style.module.css";
import { geniusGetLyricsForTrack } from "./LyricsExtractMethods";
import TranslateMenu from "../TranslateMenu";
import { Translation } from "../TranslateMenu/model";

export default function Lyrics(track: LyricsProps) {
  const geniusAuthService = useAuthService("genius");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const [translation, setTranslation] = useState<Translation | undefined>(undefined);
  const [showTranslation, setShowTranslation] = useState<boolean>(false);

  const [newText, setNewText] = useState<string | undefined>(undefined);
  const [currentText, setCurrentText] = useState<string | undefined>(undefined);

  useEffect(() => {
    const isLoggedIn = geniusAuthService.isLoggedIn();
    setIsLoggedIn(isLoggedIn);
    if (isLoggedIn) {
      fetchSong();
    }
  }, [track]);

  const fetchSong = async () => {
    setIsLoading(true);
    setNewText(undefined);
    try {
      const lyricsText = await geniusGetLyricsForTrack(track);

      setNewText(lyricsText);
      if (!firstLoaded) {
        setCurrentText(lyricsText);
        setTimeout(() => {
          setFirstLoaded(true);
          setNewText(undefined);
        }, 1000);
      } else {
        setTimeout(() => {
          setCurrentText(lyricsText);
          setNewText(undefined);
        }, 1000);
      }
    } catch (e) {
      const error = e as AxiosError;
      if (error.status === 401) {
        geniusAuthService.clear();
        setIsLoggedIn(false);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="overflow-x-auto relative">
      <div className="absolute right-0 z-10 overflow-hidden">
        <TranslateMenu track={track} currentText={currentText} setTranslation={setTranslation} setShowTranslation={setShowTranslation}/>
      </div>
      {!isLoggedIn && (
        <Link href="/api/genius/login">
          <div className="bg-slate-500 mt-20 mx-auto p-4 mb-4 w-64">
            Login to genius to see lyrics
          </div>
        </Link>
      )}
      {(!!newText || !!currentText) && (
        <div className="flex justify-center text-base md:text-md lg:text-lg">
          
          <div
            className={`flex justify-center overflow-hidden relative shrink-0 ${style.textContainer}`}
          >
            <p
              className="whitespace-pre bg-black w-full md:w-fit px-2 md:px-6 xl:px-20"
              style={{ visibility: firstLoaded ? "visible" : "hidden" }}
            >
              {currentText}
            </p>
            {!!newText && (
              <>
                <p className="whitespace-pre bg-black w-full md:w-fit px-2 md:px-6 xl:px-20">
                  {newText}
                </p>
                <p className="whitespace-pre bg-black w-full md:w-fit px-2 md:px-6 xl:px-20">
                  {newText}
                </p>
                <p className="whitespace-pre bg-black w-full md:w-fit px-2 md:px-6 xl:px-20">
                  {newText}
                </p>
                <p className="whitespace-pre bg-black w-full md:w-fit px-2 md:px-6 xl:px-20">
                  {newText}
                </p>
                <p className="whitespace-pre bg-black w-full md:w-fit px-2 md:px-6 xl:px-20">
                  {newText}
                </p>
              </>
            )}
          </div>
          <div className="min-w-0 shrink-1">
            {showTranslation && !!translation && (
          <p className="whitespace-pre bg-black w-full md:w-fit px-2 md:px-6 xl:px-20">{translation.translations.join("\n")}</p>
      )}
            </div>
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
