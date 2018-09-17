<?php
/************************************************
*	            Liaison API twitch              *
* 												*
*	Dernière modification : mai 2018 			*
************************************************/


//      Posibilité de restreindre l'accès à l'extension uniquement via header
//      header('Access-Control-Allow-Origin: *');

    $channel = "mastersnakou";
    $API_key_twitch   = '1low3gl5n•••••••••••••••••';

    $url = "https://api.twitch.tv/kraken/streams/$channel?client_id=$API_key_twitch&amp;timestamp=".time();
    
	//Récupération des informations depuis l'API
    $stream = file_get_contents($url);
    
    if ($stream === false) {
        echo 'error';
    }
    else {
        $json = json_decode($stream, true);
        
        $created_at= ($json['stream']['created_at']) ? $json['stream']['created_at']: "offline";
        $game= ($json['stream']['game'])? ','.$json['stream']['game'] : ",error";
        $viewers = ($json['stream']['viewers'])? ','.$json['stream']['viewers'] : ",error";
        $status= ($json['stream']['channel']['status'])? ','.$json['stream']['channel']['status'] : ",error";

        echo $created_at.$game.$viewers.$status;
    }

?>
