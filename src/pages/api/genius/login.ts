import type { NextApiRequest, NextApiResponse } from "next";
import { client } from "./client";

const authorizeUri = client.authorizeURL({
  redirect_uri: "http://localhost:3000/api/genius/callback",
  
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.redirect(authorizeUri);
}
