
(function(){

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while (e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

$("#lyricsLoadSpinner").hide()
  
var userProfileSource = document.getElementById('user-profile-template').innerHTML,
  userProfileTemplate = Handlebars.compile(userProfileSource),
  userProfilePlaceholder = document.getElementById('user-profile');

var userPlayerSource = document.getElementById('user-player-template').innerHTML,
  userPlayerTemplate = Handlebars.compile(userPlayerSource),
  userPlayerPlaceholder = document.getElementById('user-player');

var lyricsSource = document.getElementById('lyrics-template').innerHTML,
  lyricsTemplate = Handlebars.compile(lyricsSource),
  lyricsPlaceholder = document.getElementById('lyrics');
var product = 'standard' //or premium



var params = getHashParams();

var access_token = params.access_token,
  refresh_token = params.refresh_token,
  error = params.error;

if (error) {
  alert('There was an error during the authentication');
} else {
  if (access_token) {
    // render oauth info
    /*
    oauthPlaceholder.innerHTML = oauthTemplate({
      access_token: access_token,
      refresh_token: refresh_token
    });
*/
    $.ajax({
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      json: true,
      success: function (response) {
        userProfilePlaceholder.innerHTML = userProfileTemplate(response);
        //console.log(response)
        product=response.product
      //  console.log(response)
        $('#login').hide();
        $('#loggedin').show();
        
      }
    }).fail(function (err) {
     // console.log('jebs')
     // console.log(err)
      window.location.pathname = '/login'

    });
    /// djalkwjlj
    function loadCurrenttrack() {
      $.ajax({
        url: 'https://api.spotify.com/v1/me/player/currently-playing',
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function (response) {
          userPlayerPlaceholder.innerHTML = userPlayerTemplate(
            {
              trackName: response.item.name,
              albumName: response.item.album.name,
              imageUrl: response.item.album.images[0].url,
              artistName: response.item.artists[0].name
            });

          lyricsPlaceholder.innerHTML = lyricsTemplate();
          loadLyrics();
        }
      })
    }
    document.getElementById('refreshButton').addEventListener('click', function () {
    loadCurrenttrack()
  }, false);
    document.getElementById('loadLyricsButton').addEventListener('click', function () {
    loadCurrenttrack()
    });
 
    loadCurrenttrack()
    
 




    ///

  } else {
    // render initial screen
    $('#login').show();
    $('#loggedin').hide();
  }
  function loadLyrics() {
    $("#lyricsLoadSpinner").show()
    $.ajax({
      url: '/get_lyrics',
      data: {
        'artist': $('#artist_name')[0].innerText,
        'track_name': $('#track_name')[0].innerText
      }
    }).done(function (data) {
      //console.log(data)

      $("#lyricsLoadSpinner").hide()
      lyricsPlaceholder.innerHTML = lyricsTemplate(data);
      
      if (data.lyrics[0]!=null&&data.lyrics[0].length>0){
       // console.log($("#autoWindow")[0])
        if($("#autoWindow")[0]!=null && $("#autoWindow")[0].checked)
          window.open(data.lyrics[0], '_blank');
        lyricsPlaceholder.innerHTML = '<h3><a target="_blank" rel="noopener noreferrer" href='+data.lyrics[0]+'>'+data.lyrics[0]+'</h3>'
      }else
        lyricsPlaceholder.innerHTML = '<h3>Couldnt find the lyrics</h3>'
      
      //["Cannot show the lyrics, follow the link instead:"]
    })
  }
  

  document.getElementById('nextButton').addEventListener('click', function () {
    if(product!='premium'){
        alert("Spotify premium account needed")
      }else{
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/next',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function (response) {
      //  console.log("next?")
        setTimeout(function(){loadCurrenttrack()},200);
      }
    });
  }

  }, false);

  document.getElementById('previousButton').addEventListener('click', function () {
    if(product!='premium'){
        alert("Spotify premium account needed")
      }else{
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/previous',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function (response) {
       // console.log("prev?")
        setTimeout(function(){loadCurrenttrack()},200);
      }
    });
      }

  }, false);

  document.getElementById('stopButton').addEventListener('click', function () {
    $.ajax({
      url: 'https://api.spotify.com/v1/me/player/currently-playing',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function (response) {
      //  console.log(response.is_playing)
        if (response != null) {
          if (response.is_playing) {
            stop()
            
          }
          else {
          //  console.log(response)
            if(response.context!=null)
              resume(response.context.uri)
            else 
              resume(response.item.uri)
            
          }
        }
      }
    });

    function stop() {
      if(product!='premium'){
        alert("Spotify premium account needed")
      }else{
      $.ajax({
        url: 'https://api.spotify.com/v1/me/player/pause',
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        success: function (response) {
          //console.log("stopped?")
          $("#playResumeImg").attr("src", "play.png")
        }
      });
    }}
    function resume(uri) {
      if(product!='premium'){
        alert("Spotify premium account needed")
      }else{
      $.ajax({
        url: 'https://api.spotify.com/v1/me/player/play',
        method: 'PUT',
        headers: {
          'Authorization': 'Bearer ' + access_token


        },
        success: function (response) {
         // console.log("resumed?")
          $("#playResumeImg").attr("src", "pause.png")
        }
        
      });
    }}

  }, false);


}

})()