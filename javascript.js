document.getElementById("btn").addEventListener("click", startCounter);
let field = document.getElementById("sessionField");
let breakText = document.getElementById("breakText");
var display = document.querySelector('#time');
let sessionCounter = 0;
let nSession;
var duration = 45 * 60;
var amusic = document.createElement('audio');


function startCounter(){
    let sessionLengthValue = field.value;
    nSession = sessionLengthValue;

    if(nSession == null || nSession == undefined || nSession == ""){
        return;
    }

    document.getElementById('valasztas').setAttribute('disabled', "");
    if(document.getElementById('valasztas').value == "Rain Sound"){
        lejatszas(1);
    } else if (document.getElementById('valasztas').value == "LOFI"){
        lejatszas(2);
    }

    document.getElementById('playButton').setAttribute("hidden", "");
    document.getElementById('szoveg').removeAttribute("hidden", "");

    document.getElementById('sessionChoseField').setAttribute("hidden", "");
    document.getElementById('sessionComplete').removeAttribute("hidden", "");
    document.getElementById('sessionN').textContent = sessionCounter + "/" + sessionLengthValue;
    startTimer(duration, sessionLengthValue);
}

function startTimer(duration, sessionLengthValue) {
    if (sessionCounter >= nSession){
        display.textContent = "DONE";
        return;
    }
    breakText.setAttribute('hidden', '');
    var timer = duration, minutes, seconds;
    var refreshId = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            
            sessionCounter +=1;
            document.getElementById('sessionN').textContent = sessionCounter + "/" + sessionLengthValue;

            if(sessionLengthValue == sessionCounter){
                clearInterval(refreshId);
                display.textContent = "Vege";
            } else {
                startTimerBreak(600);
                clearInterval(refreshId);
            }
        }
    }, 1000);
}

function startTimerBreak(duration) {
    breakText.removeAttribute('hidden', '');
    var xtimer = duration, xminutes, xseconds;
    var xrefreshId = setInterval(function () {
        xminutes = parseInt(xtimer / 60, 10);
        xseconds = parseInt(xtimer % 60, 10);

        xminutes = xminutes < 10 ? "0" + xminutes : xminutes;
        xseconds = xseconds < 10 ? "0" + xseconds : xseconds;

        display.textContent = xminutes + ":" + xseconds;
        if (--xtimer < 0) {
            startTimer(duration, nSession);
            clearInterval(xrefreshId);
        }
    }, 1000);
}

var vid,
  audio_streams = {},
  audio_tag = document.getElementById('youtube');

function lejatszas(szam){
    if(szam == 1){
        vid = "mPZkdNFkNps";
    } else {
        vid = "q4YyeEM9jsc";
    }
    fetch("https://images" + ~~(Math.random() * 33) + "-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=" + encodeURIComponent("https://www.youtube.com/watch?hl=en&v=" + vid)).then(response => {
  if (response.ok) {
    response.text().then(data => {

      var regex = /(?:ytplayer\.config\s*=\s*|ytInitialPlayerResponse\s?=\s?)(.+?)(?:;var|;\(function|\)?;\s*if|;\s*if|;\s*ytplayer\.|;\s*<\/script)/gmsu;

      data = data.split('window.getPageData')[0];
      data = data.replace('ytInitialPlayerResponse = null', '');
      data = data.replace('ytInitialPlayerResponse=window.ytInitialPlayerResponse', '');
      data = data.replace('ytplayer.config={args:{raw_player_response:ytInitialPlayerResponse}};', '');


      var matches = regex.exec(data);
      var data = matches && matches.length > 1 ? JSON.parse(matches[1]) : false;


      var streams = [],
        result = {};

      if (data.streamingData) {

        if (data.streamingData.adaptiveFormats) {
          streams = streams.concat(data.streamingData.adaptiveFormats);
        }

        if (data.streamingData.formats) {
          streams = streams.concat(data.streamingData.formats);
        }

      } else {
        return false;
      }

      streams.forEach(function(stream, n) {
        var itag = stream.itag * 1,
          quality = false;
        switch (itag) {
          case 139:
            quality = "48kbps";
            break;
          case 140:
            quality = "128kbps";
            break;
          case 141:
            quality = "256kbps";
            break;
          case 249:
            quality = "webm_l";
            break;
          case 250:
            quality = "webm_m";
            break;
          case 251:
            quality = "webm_h";
            break;
        }
        if (quality) audio_streams[quality] = stream.url;
      });


      audio_tag.src = audio_streams['256kbps'] || audio_streams['128kbps'] || audio_streams['48kbps'];
      
      amusic.src = audio_streams['256kbps'] || audio_streams['128kbps'] || audio_streams['48kbps'];
      amusic.volume = document.getElementById('hangero').value/100

      amusic.play();
    })
  }
});
}

document.getElementById('hangero').addEventListener('input', () => {
    amusic.volume = document.getElementById('hangero').value/100
})