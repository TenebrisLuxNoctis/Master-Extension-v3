<?php
/************************************************
*	            Liaison API youtube             *
* 												*
*	Dernière modification : mai 2018 			*
************************************************/


//      Posibilité de restreindre l'accès à l'extension uniquement via header
//      header('Access-Control-Allow-Origin: *');

	$cursor = NULL;
	if(isset($_GET['lasttime']) && $_GET['lasttime'] != "")
	{
		$datetime = new DateTime($_GET['lasttime']);
		$cusor = "&publishedAfter=".$datetime->format(DateTime::ATOM);
	}
    $channelID			= "UCOhP0t6arWMXqmcroJjMJ7A";
    $API_key_youtube	= 'AIzaSyAANw33DQWRi•••••••••••••••••';

	$url = "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=".$channelID."&order=date&key=".$API_key_youtube."&maxResults=1".$cursor;

	//Récupération des informations depuis l'API
    $stream = file_get_contents($url);

	print_r($stream);
?>
