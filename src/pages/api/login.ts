import type { NextApiRequest, NextApiResponse } from 'next'
import queryString from 'query-string';

var generateRandomString = function(length: number) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };
  
var stateKey = 'spotify_auth_state';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    var state = generateRandomString(16);
    res.setHeader('Set-Cookie', stateKey+'='+state);
    // res.cookie(stateKey, state);
  
    // your application requests authorization
    var scope = 'user-modify-playback-state user-read-currently-playing user-read-private';
    res.redirect('https://accounts.spotify.com/authorize?' + 
      queryString.stringify({
        response_type: 'code',
        client_id: process.env.spotify_client_id,
        scope: scope,
        redirect_uri: 'http://localhost:3000/api/callback',
        state: state,
        show_dialog: true
      }));
  }