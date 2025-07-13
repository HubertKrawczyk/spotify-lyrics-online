import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, target_lang, apiKey, freePlan } = req.body;

  if (!text || !target_lang || !apiKey) {
    return res.status(400).json({ error: 'Missing text, target_lang, or apiKey' });
  }

  try {
    const response = await axios.post(
      freePlan ? 'https://api-free.deepl.com/v2/translate' : 'https://api.deepl.com/v2/translate',
      {
        text: text.substr(0,8000).split('\n'),
        target_lang,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `DeepL-Auth-Key ${apiKey}`
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    return res.status(500).json({ error: 'Translation failed', details: error.response?.data });
  }
}