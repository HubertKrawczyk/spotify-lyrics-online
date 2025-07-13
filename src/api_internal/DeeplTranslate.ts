import axios from "axios";

export const getDeeplTranslations = async (
  text: string,
  target_lang: string,
  token: string,
  freePlan: boolean
): Promise<string[]> => {
  const res = await axios.post("/api/translate/deepl", {
    text,
    target_lang,
    apiKey: token,
    freePlan: freePlan,
  });

  if (res.status !== 200) {
    throw new Error(res.statusText);
  }

  const t: string[] = [];
  for (let i = 0; i < res.data.translations.length; i++) {
    t.push(res.data.translations[i].text);
  }
  return t;
};