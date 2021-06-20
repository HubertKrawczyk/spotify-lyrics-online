/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

var client_id = '77da548e63614b9e9191cd0d3391a8c8'; // Your client id
var client_secret = 'd1b0b6de3c944ea39d1e4812b998b6e7'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri


//

function geniusLyrics(urll, callbackk) {
  const rp = require('request-promise');
  const $ = require('cheerio');


    result = []
  rp(urll)
    .then(function (html) {
      function magiclyTakeTheLyrics(html){
        //x = $('.lyrics p >a', html)[0].children
        var contents = $('.lyrics p ', html)[0].children
        var i;
        //var a = $('.lyrics p', html)[0].children
        function spam(s){
          if(s.length>=1){
            if (s.match(/^\n+$/g)!=null ){
              return true
            }
            return false
          }else{
            return false
          }
        }
        for (i = 0; i < contents.length; i++) {
          if (contents[i].type == "text" && !spam(contents[i].data)){
            result.push(contents[i].data)
          //  console.log(contents[i].data)
           //console.log(result)
          }
          else 
            if (contents[i].type == "tag" && (contents[i].name == "a" || contents[i].name == "i")){
              var j = 0
              for (j = 0; j < contents[i].children.length;j++){
                if (contents[i].children[j].type=="text"){
                  result.push(contents[i].children[j].data)
                //  console.log(contents[i].children[j].data)
               //   console.log(result)
                }
              }
          }
        }
        //remove all \n -s :
        var i =0
        for(i = 0;i<result.length;i++){
          if (result[i].match(/^\n/g)!=null){
            //
            result[i] = result[i].slice(1, result[i].length)
          }
        }

        callbackk(result)
      }
      magiclyTakeTheLyrics(html)
    }).catch(function (err) {
      //handle error
      console.log("an error occured when running the url:");
      console.log(err);
     // console.log(err.statusCode==404)


      callbackk(["Couldnt find the lyrics"])
      //console.log(err)
    })
    
  
}

/*


*/



/*
*
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-modify-playback-state user-read-currently-playing user-read-private';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
      show_dialog: true
    }));
});

app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});
app.get('/logout', function (req, res) {
  res.clearCookie(stateKey);
  res.send();
})
app.get('/get_lyrics', function (req, res) {

  artist = req.query.artist.toLowerCase()
  track_name = req.query.track_name.toLowerCase()
  console.log("NEW REQUEST FOR LYRICS FOR: "+artist+' '+track_name)
  function better_name(name){
    new_name = name.split(" ")
    if (new_name.length == 1)
      return new_name[0]
    else {
      var i
      name = ""
      for (i = 0; i < new_name.length - 1; i++) {
        name = name + new_name[i] + "-"
      }
      name = name + new_name[i]
      return name
    }
  }
  function remove_special_characters(name){
    var i 
    var new_name=""
 

    for (i=0;i<name.length;i++){
      if (name[i] =="ä" || name[i] =="ą"||name[i] =="å")
        new_name = new_name+"a"
      else if (name[i] == 'ü')
        new_name = new_name+"u"
      else if (name[i] == 'ł')
        new_name = new_name + "l"
      else if (name[i] == 'ć')
        new_name = new_name + "c"
      else if (name[i] == 'ś')
        new_name = new_name + "s"
      else if (name[i] == '&')
        new_name = new_name + "and"
      else if (name[i] == 'ó'||name[i] == 'ö')
        new_name = new_name + "o"
      else if (name[i] == 'ę'||name[i] == 'é')
        new_name = new_name + "e"
      else if (name[i] == 'ż' || name[i] == 'ź')
        new_name = new_name + "z"
      else if (name[i].match(/([a-z]|( )|[0-9])/g)==null)
        new_name = new_name
      else 
        new_name = new_name+name[i]
      }

      new_name = new_name.replace('  ',' ')
    
    return new_name
  }
  //console.log({ track_name, artist })
  new_track_name = remove_special_characters(track_name)
  new_artist = remove_special_characters(artist)
  //console.log({track_name,artist})
  new_track_name = better_name(new_track_name)
  new_artist = better_name(new_artist)



  var urll = "https://genius.com/"+new_artist+"-"+new_track_name+"-lyrics"
  console.log("first url: " +urll)
  geniusLyrics(urll, function (result) {
   // console.log(result)
    if (result[0]=="Couldnt find the lyrics"){
      console.log("Couldnt find the lyrics, TRYING OTHER WAYS")
      lyricsOtherWays()
    } else{
      console.log("first url was OK")
    res.send({
      //'lyrics': result
      'lyrics': [urll]
    });}
  })
  function lyricsOtherWays(){
    //found_url = searchForSongUrl(artist,track_name)
    //succesfulAnotherTry=true

    var try1 = new_track_name.indexOf('-remastered')
    if (try1<0){
      try1 = new_track_name.indexOf('-feat')
    }
    if (try1<0){
      try1 = new_track_name.indexOf('-live')
    }
    if (try1>0){
      var urll = "https://genius.com/"+new_artist+"-"+new_track_name.slice(0,try1)+"-lyrics"

      //try again with new url
        geniusLyrics(urll, function (result) {
          if (result[0]=="Couldnt find the lyrics"){
              //succesfulAnotherTry=false
              console.log("removed ending UNsuccesfully???: "+urll)
              res.send({ 'lyrics': [] });
                } else{
                //succesfulAnotherTry=true
                console.log("removed ending Succesfully!!!: "+urll)
                res.send({
                  //'lyrics': result
                  'lyrics': [urll]
                });
              }
        })
    } else {

      console.log("OTHER WAYS UNSUCCESSFUL")
      searchForSongUrl(artist,track_name)

      res.send({ 'lyrics': [] });
    }

  }

  function searchForSongUrl(artist,track_name){
    new_artist = artist.replace(/([^0-9a-z ])/gi, '').split(' ').filter(function(ele){
       return ele != '';
   });
    new_track_name = track_name.replace(/([^0-9a-z ])/gi, '').split(' ').filter(function(ele){
       return ele != '';
   });
    urlEnding=""
    for(i=0;i<new_artist.length;i++){
      urlEnding=urlEnding+new_artist[i]+'%20'
    }
    for(i=0;i<new_track_name.length;i++){
      urlEnding=urlEnding+new_track_name[i]+'%20'
    }
    urll="https://genius.com/search?q="+urlEnding
    console.log("search url: "+urll)


  }

   
  
});
port = 8888
console.log('Listening on '+port);
app.listen(port);
