import useAuthService from "@/hooks/AuthService";
import { LyricsProps } from "./model";
import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import Link from "next/link";
import style from "./style.module.css";
import { geniusGetLyricsForTrack } from "./LyricsExtractMethods";
import TranslateMenu from "../TranslateMenu";
import { Translation } from "../TranslateMenu/model";
import { defaultTextFormatSettings, TextFormatSettings } from "../TextFormatSettingsMenu/model";
import TextFormatSettingsMenu from "../TextFormatSettingsMenu";

export default function Lyrics(track: LyricsProps) {
  const geniusAuthService = useAuthService("genius");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [firstLoaded, setFirstLoaded] = useState(false);
  const [translation, setTranslation] = useState<Translation | undefined>(undefined);
  const [showTranslation, setShowTranslation] = useState<boolean>(false);

  const [newText, setNewText] = useState<string | undefined>(undefined);
  const [currentText, setCurrentText] = useState<string | undefined>(undefined);

  const [textFormatSettings, setTextFormatSettings] = useState<TextFormatSettings>(defaultTextFormatSettings)

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

  const updateTextFormatSettings = (s: TextFormatSettings) => {
    setTextFormatSettings(s);
    localStorage.setItem("FormatSettings", JSON.stringify(s));
  }

  return (
    <div className={`relative mx-auto ${textFormatSettings.invertColors ? 'bg-white/60' : 'bg-black/60'}`}>
      <div>
        <TextFormatSettingsMenu setTextFormatSettings={setTextFormatSettings} translationDisplayed={showTranslation}  />
        <TranslateMenu track={track} currentText={currentText} setTranslation={setTranslation} setShowTranslation={setShowTranslation}/>
      </div>
      {!isLoggedIn && (
        <Link href="/api/genius/login">
          <div className="bg-slate-500 mt-20 mx-auto p-4 mb-4 w-64">
            Login to genius to see lyrics
          </div>
        </Link>
      )}
      <div className="w-100"> 
        {(!!newText || !!currentText) && (
          <div className={`w-fit mx-auto`} style={{fontSize: textFormatSettings.fontSizeInRem+"rem"}}>
            <div className={`flex relative shrink-0 overflow-y-hidden ${textFormatSettings.invertColors ? "bg-white text-black" : "bg-black text-white"} `}>
              <div
                className={`bg-inherit ${style.textContainer}`}
                style={{textAlign: textFormatSettings.textAlignText}}
              >
                <p
                  className="whitespace-pre px-2 md:px-6 xl:px-20"
                  style={{ visibility: firstLoaded ? "visible" : "hidden" }}
                >
                  {currentText}
                </p>
                {!!newText && (
                  <>
                    <p className="whitespace-pre bg-inherit px-2 md:px-6 xl:px-20">
                      {newText}
                    </p>
                    <p className="whitespace-pre bg-inherit px-2 md:px-6 xl:px-20">
                      {newText}
                    </p>
                    <p className="whitespace-pre bg-inherit px-2 md:px-6 xl:px-20">
                      {newText}
                    </p>
                    <p className="whitespace-pre bg-inherit px-2 md:px-6 xl:px-20">
                      {newText}
                    </p>
                    <p className="whitespace-pre bg-inherit px-2 md:px-6 xl:px-20">
                      {newText}
                    </p>
                  </>
                )}
              </div>
              {showTranslation && !!translation && (
                <div className="min-w-0 shrink-1" 
                  style={{textAlign: textFormatSettings.textAlignTranslation}}
                >
                  <p className="whitespace-pre w-full md:w-fit pr-2 md:pr-6 xl:pr-20">{translation.translations.join("\n")}</p>
                </div>
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
    </div>
  );
}
