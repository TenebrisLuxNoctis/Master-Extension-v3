<?php

//    header('Access-Control-Allow-Origin: *');

    $channel = "mastersnakou"
    $token   = '1low3gl5nz7ep5o6qgj0xtrpd96mszn';

    $url = "https://api.twitch.tv/kraken/streams/$channel?client_id=$token&amp;timestamp=".time();
    
	//Récupération des informations depuis l'API
    $stream = file_get_contents($url);
    
    if ($stream === false) {
        echo 'error';
    }
    else if (substr($stream, 0, 15) == '{"stream":null,') {
        echo 'offline';
    }
    else if (substr($stream, 0, 17) == '{"stream":{"_id":') {
        $matches = array();
        if (preg_match('/"created_at":"([^"]+)"/', $stream, $matches) == 1) {
            print_r($matches[1]); //Affichage du timestamp
            if (preg_match('/"game":"([^"]+)"/', $stream, $matches) == 1) {
                echo ',';
                print_r($matches[1]); //Affichage du jeu actuel
            }
            else {
                echo 'error';
            }
        }
        else {
            echo 'error';
        }
    }
    else {
        echo 'error';
    }
	
	?>
	
	 if (xmlhttp.readyState==4 && xmlhttp.status==200){
			/*Récupération des données*/
			var tmp = xmlhttp.responseText;
			data = JSON.parse(tmp);
			console.log(data);
			if(data.items.length > 0) {
				var tmp = data.items[0].snippet.publishedAt;
				var d = new Date(tmp);
				d.setTime(d.getTime()+1000);
				chrome.storage.local.set({'yt_time': d.toISOString()}, function(){});
				for (var video of data.items) {
					LaunchNotifYouTube(video.snippet.title, video.id.videoId);
				}
			}	
		}