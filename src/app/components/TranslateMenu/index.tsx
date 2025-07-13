import { useEffect, useState } from "react";
import axios from "axios";
import { getTrackLocalstorageId, Translation } from "./model";
import { LyricsProps } from "../Lyrics/model";
import { getDeeplTranslations } from "@/api_internal/DeeplTranslate";
import { getAzureTranslations } from "@/api_external/azure/AzureTranslator";

type TranslateMenuParams = {
  track: LyricsProps;
  currentText: string | undefined;
  setTranslation: (t: Translation | undefined) => void;
  setShowTranslation: (b: boolean) => void;
};
export default function TranslateMenu({
  track,
  currentText,
  setTranslation,
  setShowTranslation,
}: TranslateMenuParams) {
  const [deeplOptionsOpen, setDeeplOptionsOpen] = useState(false);
  const [azureOptionsOpen, setAzureOptionsOpen] = useState(false);
  const [deeplToken, setDeeplToken] = useState<string>("");
  const [deeplFreePlan, setDeeplFreePlan] = useState<boolean>(true);
  const [azureToken, setAzureToken] = useState<string>("");
  const [azureRegion, setAzureRegion] = useState<string>("westeurope");
  const [targetLanguage, setTargetLanguage] = useState<string>("en");
  const [keyboardTranslationInputOpen, setKeyboardTranslationInputOpen] = useState<boolean>(false);
  const [userTranslation, setUserTranslation] = useState<string | undefined>(undefined);
  const [showTranslation, setShowTranslationInternal] = useState<boolean>(false);
  const [translation, setTranslationInternal] = useState<Translation | undefined>(undefined);

  useEffect(() => {
    const key = getTrackLocalstorageId(track);
    if (localStorage.getItem(key) !== null) {
      const localValue = localStorage.getItem(key);
      if (localValue != null) {
        setTranslation(JSON.parse(localValue));
        setTranslationInternal(JSON.parse(localValue));
      } 
    }else {
        setTranslation(undefined);
        setTranslationInternal(undefined);
    }
  }, [track]);

  useEffect(() => {
    if (localStorage.getItem("Token-deepl") != null) {
      setDeeplToken(localStorage.getItem("Token-deepl")!);
    }
    if (localStorage.getItem("Token-azure") != null) {
      setAzureToken(localStorage.getItem("Token-azure")!);
    }
    if (localStorage.getItem("Region-azure") != null) {
      setAzureRegion(localStorage.getItem("Region-azure")!);
    }
  }, []);

  const translateLyrics = async (provider: string) => {
    if (!currentText || !targetLanguage) return;

    if (
      provider === "deepl" &&
      localStorage.getItem("Token-deepl") !== deeplToken
    )
      localStorage.setItem("Token-deepl", deeplToken);
    if (
      provider === "azure" &&
      localStorage.getItem("Token-azure") !== azureToken
    )
      localStorage.setItem("Token-azure", azureToken);

    const key = getTrackLocalstorageId(track);

    const translations: string[] | null | undefined =
      provider === "deepl"
        ? await getDeeplTranslations(currentText, "EN", deeplToken, deeplFreePlan)
        : provider === "azure"
        ? await getAzureTranslations(currentText, "EN", azureToken, azureRegion) 
        : null;

    if (!translations) return;

    const translation: Translation = { translations };

    const match = currentText.match(/^((?:\s*\n)+)/);
    const leadingNewlines = match ? match[1].match(/\n/g)?.length || 0 : 0;
    for (let i = 0; i < leadingNewlines; i++) {
      if (
        translation.translations.length <= i ||
        (translation.translations[i].trim().length !== 0 &&
          translation.translations[i] !== "\n")
      ) {
        translation.translations = [""].concat(translation.translations);
      }
    }
    setTranslationInternal(translation);
    setTranslation(translation);
    localStorage.setItem(key, JSON.stringify(translation));
  };

  function clearTranslationsStorage() {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key!.startsWith("translations:")) {
        localStorage.removeItem(key!);
      }
    }
  }
  const saveUserTranslation = () => {
    if (!!userTranslation) {
      const translation: Translation = {
        translations: userTranslation.split("\n"),
      };
      setTranslation(translation);
      const key = getTrackLocalstorageId(track);
      localStorage.setItem(key, JSON.stringify(translation));
    }
  };

  return (
    <div className="border border-dashed p-1 bg-gray-800 ">
      <button
        className={`px-1 border border-solid ${
          deeplOptionsOpen ? "border-blue-500" : ""
        }`}
        onClick={() => {
          setDeeplOptionsOpen((prev) => {
            if(!prev){
                setKeyboardTranslationInputOpen(false);
                setAzureOptionsOpen(false);
            }
            return !prev;
          });
        }}
      >
        DeepL
      </button>
      {deeplOptionsOpen && (
        <div>
          <label>
            DeepL token
            <input
              name="deeplToken"
              value={deeplToken}
              className="mx-1 text-black"
              type="text"
              onChange={(e) => setDeeplToken(e.target.value)}
            ></input>
          </label>
          <label>
            Target language code
            <input
              name="targetLanguage"
              value={targetLanguage}
              className="mx-1 text-black"
              type="text"
              onChange={(e) => setTargetLanguage(e.target.value)}
            ></input>
          </label>
          <label>
            Free plan
            <input
              name="deeplFreePlan"
              checked={deeplFreePlan}
              className="mx-1 text-black"
              type="checkbox"
              onChange={(e) => setDeeplFreePlan(e.target.checked)}
            ></input>
          </label>
          <button
            className="mx-1 px-1 border border-solid border-pink-800 mb-1"
            onClick={() => {
              translateLyrics("deepl");
            }}
          >
            Translate and save in localstorage
          </button>
        </div>
      )}
      <button
        className={`px-1 border border-solid ${
          azureOptionsOpen ? "border-blue-500" : ""
        }`}
        onClick={() => {
          setAzureOptionsOpen((prev) => {
            if(!prev){
                setKeyboardTranslationInputOpen(false);
                setDeeplOptionsOpen(false);
            }
            return !prev;
          });
        }}
      >
        Microsoft Translator
      </button>
      {azureOptionsOpen && (
        <div>
          <label>
            Azure Translator token
            <input
              name="azureToken"
              value={azureToken}
              className="mx-1 text-black"
              type="text"
              onChange={(e) => setAzureToken(e.target.value)}
            ></input>
          </label>
          <label>
            Region
            <input
              name="azureRegion"
              value={azureRegion}
              className="mx-1 text-black"
              type="text"
              onChange={(e) => setAzureRegion(e.target.value)}
            ></input>
          </label>
          <label>
            Target language code
            <input
              name="targetLanguage"
              value={targetLanguage}
              className="mx-1 text-black"
              type="text"
              onChange={(e) => setTargetLanguage(e.target.value)}
            ></input>
          </label>
          <button
            className="mx-1 px-1 border border-solid border-pink-800 mb-1"
            onClick={() => {
              translateLyrics("azure");
            }}
          >
            Translate and save in localstorage
          </button>
        </div>
      )}
      <button
        className={`px-1 border border-solid ${
          keyboardTranslationInputOpen ? "border-blue-500" : ""
        }`}
        onClick={() => {
          setKeyboardTranslationInputOpen((prev) => {
            if(!prev){
                setAzureOptionsOpen(false);
                setDeeplOptionsOpen(false);
                if(!userTranslation) setUserTranslation(translation?.translations?.join('\n'));
            }
            return !prev;
          });
        }}
      >
        Keyboard input
      </button>
      {keyboardTranslationInputOpen && (
        <div className="flex">
          <textarea
            className="text-black"
            name="user_translation"
            value={userTranslation}
            onChange={(e) => {
              if (e.target.value != null && e.target.value !== "")
                setUserTranslation(e.target.value);
            }}
          ></textarea>
          <button
            className="px-1 border border-solid  border-pink-800 mb-1"
            onClick={saveUserTranslation}
          >
            Apply translation and save in localstorage
          </button>
        </div>
      )}
      <button
        className="px-1 border border-solid"
        onClick={() => {
          const confirmed = confirm(
            "Are you sure? it will delete all past translations from local storage and you api key may be used again for your songs?"
          );
          if (!confirmed) return;
          clearTranslationsStorage();
        }}
      >
        Clear all translations
      </button>
      <label>
        <input
          className="mx-2"
          name="showTranslation"
          type="checkbox"
          checked={showTranslation}
          onChange={(e) => {
            setShowTranslation(e.target.checked);
            setShowTranslationInternal(e.target.checked);
          }}
        />
        Show translation
      </label>
      { !!translation &&("🔤✅")}
    </div>
  );
}
