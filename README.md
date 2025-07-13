<img width="1286" height="607" alt="obraz" src="https://github.com/user-attachments/assets/3757dca1-f18e-4b65-a682-da0b8cadb8c3" />

<img width="1341" height="270" alt="obraz" src="https://github.com/user-attachments/assets/cb8d33ff-a6fc-412d-b559-6d1a4cdae2cc" />


Available at: https://spotify-lyrics-online.vercel.app/

A website that displays currently playing Spotify song and lyrics.

The lyrics come from Genius.com and this app requires logging in to Genius (<u>Genius tokens never expire</u> so log in only once :) )

Option to provide DeepL or Azure Translator API tokens to fetch translations. Translations are saved in browser local storage to avoid repetitive API calls.
Both DeepL and Azure Translators have free tiers.

## Run locally dev

To run locally:

```bash
npm run dev
```

This is a Next.js app

Required environment variables:
 - spotify_client_id
 - spotify_secret
 - genius_client_id
 - genius_secret
 - app_url (e.g. `http://localhost:3000`)
