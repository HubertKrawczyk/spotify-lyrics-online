
import { useEffect, useState } from "react";
import { defaultTextFormatSettings, LRC, TextFormatSettings} from "./model";

type TextFormatSettingsMenuParams = {
  setTextFormatSettings: (s: TextFormatSettings)=>void;
  translationDisplayed: boolean;
};

export default function TextFormatSettingsMenu({setTextFormatSettings, translationDisplayed}: TextFormatSettingsMenuParams) {
  const [textFormatSettings, setTextFormatSettingsInternal] = useState<TextFormatSettings>(defaultTextFormatSettings)

  useEffect(() => {
    const existingFormatSettings = localStorage.getItem("FormatSettings");
    if(existingFormatSettings != null){
      setTextFormatSettings({...defaultTextFormatSettings, ...JSON.parse(existingFormatSettings)})
      setTextFormatSettingsInternal({...defaultTextFormatSettings, ...JSON.parse(existingFormatSettings)})
    }
  }, [])

  const updateTextFormatSettings = (s: TextFormatSettings) => {
    setTextFormatSettingsInternal(s);
    setTextFormatSettings(s);
    localStorage.setItem("FormatSettings", JSON.stringify(s));
  }

  const fontUp = () => {
    if (textFormatSettings.fontSizeInRem < 3){
      updateTextFormatSettings({...textFormatSettings, fontSizeInRem: textFormatSettings.fontSizeInRem+.25})
    }
  }

  const fontDown = () => {
    if(textFormatSettings.fontSizeInRem <= 0.25){
      return;
    }
    updateTextFormatSettings({...textFormatSettings, fontSizeInRem: textFormatSettings.fontSizeInRem-.25})
  }

  const switchTextAlignText = () => {
    const newAlign = textFormatSettings.textAlignText === 'left' ? 'center' : textFormatSettings.textAlignText === 'center' ? 'right' : 'left';
    updateTextFormatSettings({...textFormatSettings, textAlignText: newAlign});
  }

  const switchTextAlignTranslation = () => {
    const newAlign = textFormatSettings.textAlignTranslation === 'left' ? 'center' : textFormatSettings.textAlignTranslation === 'center' ? 'right' : 'left';
    updateTextFormatSettings({...textFormatSettings, textAlignTranslation: newAlign});
  }

  const mapAlignToDisplaySign = (ta: LRC) => {
    return ta === 'left' ? '> ' : ta === 'center' ? '><' : ' <';
  }

  const reset = () => {
    updateTextFormatSettings(defaultTextFormatSettings);
  }

  const inverseColours = () => {
    updateTextFormatSettings({...textFormatSettings, invertColors: !textFormatSettings.invertColors});
  }

  return (
    <div className="border border-dashed p-1 bg-gray-800 flex justify-center">
        <button className="border border-solid px-2 h-6" onClick={reset}>Reset</button>
        <button className="border border-solid px-2 h-6" onClick={inverseColours}>Inv colours</button>
        <button className="border border-solid px-2 h-6" onClick={fontDown}>Font -</button>
        <button className="border border-solid px-2 h-6 " onClick={fontUp}>Font +</button>
        <button className="border border-solid px-2 h-6 whitespace-break-spaces font-mono" onClick={switchTextAlignText}>{mapAlignToDisplaySign(textFormatSettings.textAlignText)}</button>
        {translationDisplayed && <button className="border border-solid px-2 h-6 whitespace-break-spaces font-mono" onClick={switchTextAlignTranslation}>{mapAlignToDisplaySign(textFormatSettings.textAlignTranslation)}</button>}
    </div>
  );
}
