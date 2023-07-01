import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next'
import queryString from 'query-string';

const stateKey = 'spotify_auth_state';
const redirect_uri = 'http://localhost:3000/api/callback';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            queryString.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.setHeader('Set-Cookie', 'Set-Cookie: ' + stateKey + "=" + '=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT');

        const form = {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        }
        try {
            console.log(process.env.spotify_client_id + ":" + process.env.spotify_secret);
            const tokenRes = await axios.post('https://accounts.spotify.com/api/token', form, {

                headers: {
                    'Authorization': `Basic ${new Buffer(process.env.spotify_client_id + ":" + process.env.spotify_secret).toString("base64")}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                },

            });
            if (tokenRes.status !== 200) {
                res.redirect('/#' +
                    queryString.stringify({
                        error: 'invalid_token'
                    }));
            }

            const access_token = tokenRes.data.access_token,
                refresh_token = tokenRes.data.refresh_token;

            var options = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };

            res.redirect('/#' +
                queryString.stringify({
                    access_token: access_token,
                    refresh_token: refresh_token
                }));

        } catch (e) {
            console.log('Error here')
            console.log(JSON.stringify(e));
            res.redirect('/sorry');
        }


    }
}