import axios from "axios";

export const getAzureTranslations = async (
  text: string,
  target_lang: string,
  token: string,
  region: string
) => {
  if (!token || !region) {
    return;
  }
  const params = new URLSearchParams();
  params.set("to", target_lang);
  params.set("api-version", "3.0");
  const res = await axios.post(
    "https://api.cognitive.microsofttranslator.com/translate?" +
      params.toString(),
    [{ text }],
    {
      headers: {
        "Ocp-Apim-Subscription-Key": token,
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Region": region,
      },
    }
  );
  const t: string[] = res.data[0].translations[0].text.split("\n");
  return t;
};
