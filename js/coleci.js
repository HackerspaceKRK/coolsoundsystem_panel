// Create a client instance
client = new Paho.MQTT.Client('10.12.4.11', 8083, 'kek/');
client.startTrace();
// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// connect the client
client.connect({onSuccess:onConnect,
                userName:'coleci', password:'coleci'});
console.log("attempting to connect...")

function renderTrack(playingJSONPayload, statusJSONPayload) {
//   console.log('play: ' + playingJSONPayload)
//   console.log('stat: ' + statusJSONPayload)
   albumImgElement = document.getElementById("currentAlbum");
   stateImgElement = document.getElementById("currentState");
   trackInfoElement = document.getElementById("currentTrack");
   playerDataElement = document.getElementById("playerData");
// clientImgElement = document.getElementById("clientImg");
// castDataElement = document.getElementById("castData");
   allPlayingData = JSON.parse(playingJSONPayload);
   allStatusData = JSON.parse(statusJSONPayload);
   isOnline = allStatusData.online;

    castData = '';
    if(isOnline) {
	appID = allStatusData.data.app_id;
		
	if(appID != null) {
		wholeData = allPlayingData.data;
		songData = wholeData.media_metadata;
		customData = wholeData.media_custom_data;
		albumImg = 'img/wat.gif';
		if (typeof(songData.images) !== 'undefined') {
		    albumImg = songData.images[0].url;
		}
		if (wholeData.player_state != 'PLAYING') {
			if(wholeData.player_state === 'PAUSED') {
				albumImgElement.setAttribute('class','paused')
				stateImgElement.src = 'img/icons/paused.png'
			}				
			if(wholeData.player_state === 'BUFFERING') {
				albumImgElement.setAttribute('class','paused')
				stateImgElement.src = 'img/icons/buffering.png'
			}				
		}
		else {
				albumImgElement.setAttribute('class','playing')
				stateImgElement.src = ''
		}
		switch (appID){
		  case 'CC32E753':
		    //console.log('Klient: Spotify');
		    trackInfo = '<h2>'+ songData.title +'</h2>';
            trackInfo += '<p><strong>Album</strong>: ' + songData.albumName +'</p>';
            trackInfo += '<p><strong>Wykonawca</strong>: '+ songData.artist +'</p>';
            trackInfo += '<a href="https://open.spotify.com/track/' + wholeData.content_id.split(":")[2] +'"><< Link do utworu >></a>';
            //clientImgElement.src = 'img/players/spotify.png';
		    break;
		  case '53BDDD07':
		    //console.log('Klient: Tidal');
		    trackInfo = '<h2>'+ songData.title +'</h2>';
            trackInfo += '<p><strong>Album</strong>: ' + songData.albumName +'</p>';
            trackInfo += '<p><strong>Wykonawca</strong>: '+ songData.artist +'</p>';
            trackInfo += '<a href="' + customData.streamUrl + '"><< Link do utworu >></a>'
		    //clientImgElement.src = 'img/players/tidal.png';
		    break;
		  case '2872939A':
		    //console.log('Klient: Google Music');
		    trackInfo = '<h2>'+ songData.title +'</h2>';
            trackInfo += '<p><strong>Album</strong>: ' + songData.albumName +'</p>';
            trackInfo += '<p><strong>Wykonawca</strong>: '+ songData.artist +'</p>';
		    //clientImgElement.src = 'img/players/googlemusic.png';
		    break;
		  case '9A5289F5':
		    //console.log('Klient: Soundcloud');
    		trackInfo = '<h2>'+ songData.title +'</h2>';
            trackInfo += '<p><strong>Wykonawca</strong>: '+ songData.artist +'</p>';
		    //clientImgElement.src = 'img/players/soundcloud.png';
		    break;
		  case '85CDB22F':
		    trackInfo = '<h2>'+ songData.title +'</h2><h3>Google Chrome</h3>';
		    trackInfo += '<p>Streamowanie karty Google Chrome nie udostępnia informacji o aktualnie odtwarzanym utworze. Prawdopodobnie ktoś puszcza coś z Youtube.</p>'
		    //console.log('Klient: Google Chrome');
		    //clientImgElement.src = 'img/players/chrome.png';
		    albumImg = 'img/chrome.gif';
		    break;
		  case '8E6C866D':
		    trackInfo = '<h2>Zapytaj streamującego co leci</h2><h3>Android Screen Mirroring / Google Home</h3>'
		    //console.log('Klient: Android Screen mirroring');
		    //clientImgElement.src = 'img/players/android.png';
		    break;
		  case '12F05308':
		    trackInfo = '<h2>' + songData.title + ' - ' + songData.subtitle +'</h2><h3>TuneIn Radio</h3>'
		    trackInfo += '<a href="' + wholeData.content_id + '"><< Link do streama >></a>'
		    //clientImgElement.src = 'img/players/tunein.png';
		    //console.log('Klient: TuneIn');
                    break;
		  case '28A12455':
    		    trackInfo = '<h2>Zapytaj streamującego co leci</h2><h3>Mixcloud</h3>';
		    //clientImgElement.src = 'img/players/mixcloud.png';
		    //console.log('Klient: Mixcloud');
		    break;
		  default:
		    //console.log('Klient nieznany - ID: '+ appID + ' - ' + allStatusData.data.display_name);
    		trackInfo = '<h2>'+ songData.title +'</h2>';
            trackInfo += '<p><strong>Wykonawca</strong>: '+ songData.artist +'</p>';
		}
//           castData = '<p><strong>Głośność</strong>: '+ (allStatusData.data.volume_level * 100).toFixed(0) +'%</p>';
//           castData += '<p><strong>Status</strong>: '+ wholeData.player_state +'</p>'; 
	}
	else{
		trackInfo = '<h2 style="color: orange;">Chromecast gotowy do połączenia</h2>';
		albumImg = 'img/ready.png';
		trackInfo += '<p>HSowy Chromecast Audio powinien być widoczny przez obsługujące go aplikacje (poniżej) jako <strong>HackerspaceKrakowAudio</strong>. Urządzenie jest gotowe do streamowania - możesz puścić jakąś muzykę</p>'
		trackInfo += '<p>Wspierane odtwarzacze:</p>'
		players = ['img/players/android.png', 'img/players/chrome.png', 'img/players/googlemusic.png', 'img/players/mixcloud.png', 'img/players/soundcloud.png', 'img/players/spotify.png', 'img/players/tidal.png', 'img/players/tunein.png'];
		for (var i = 0; i < players.length; i++){
			trackInfo += '<img src="'+ players[i] +'" width="30px">';
		}
		
	}
   }
   else {
	trackInfo = '<h2 style="color: red;">Chromecast odłączony</h2>';
	trackInfo += 'Chromecast Audio, który pozwoli ci posłuchać muzyki przez system audio uruchamia się razem z mikserem i wzmacniaczem. Żeby posłuchać muzyki - włącz system audio i działaj!';
	trackInfo += '<p>Wspierane odtwarzacze:</p>'
	players = ['img/players/android.png', 'img/players/chrome.png', 'img/players/googlemusic.png', 'img/players/mixcloud.png', 'img/players/soundcloud.png', 'img/players/spotify.png', 'img/players/tidal.png', 'img/players/tunein.png'];
	for (var i = 0; i < players.length; i++){
		trackInfo += '<img src="'+ players[i] +'" width="50px">';
	}
	albumImg = 'img/silence.jpg';
   }

   trackInfoElement.innerHTML = trackInfo;
//   castDataElement.innerHTML = castData;
   albumImgElement.src = albumImg;

}

// called when the client connects
function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("onConnect");
  client.subscribe("music/chromecast/#");

}

// called when the client loses its connection
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("onConnectionLost:"+responseObject.errorMessage);
  }
}

// called when a message arrives
function onMessageArrived(message) {
//  console.log("onMessageArrived:"+message.payloadString);
  if (message.destinationName === 'music/chromecast/playing'){
      playingString = message.payloadString;
  }
  if (message.destinationName === 'music/chromecast/status'){
      statusString = message.payloadString;
  }
  if (typeof(playingString) !== 'undefined' && typeof(statusString) !== 'undefined') {
    renderTrack(playingString, statusString);
  }
}

