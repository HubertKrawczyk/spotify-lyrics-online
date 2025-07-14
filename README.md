<img width="760" height="677" alt="obraz" src="https://github.com/user-attachments/assets/f299f929-2f43-4312-b8fa-43207b7108c8" />
<img width="1515" height="399" alt="obraz" src="https://github.com/user-attachments/assets/2f01b8a0-6c29-48af-9f40-d1befa6f8254" />



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
