<?php

//    header('Access-Control-Allow-Origin: *');
	$cursor = NULL;
	if(isset($_GET['lasttime']) && $_GET['lasttime'] != "")
	{
		$datetime = new DateTime($_GET['lasttime']);
		$cusor = "&amp;publishedAfter=".$datetime->format(DateTime::ATOM);
	}
    $channelID	= "UCOhP0t6arWMXqmcroJjMJ7A"
    $token		= 'AIzaSyAANw33DQWRi5OlPqgtRum_oQGWjB_BXdA';

	$url = "https://www.googleapis.com/youtube/v3/search?part=snippet&amp;channelId=".$channelID."&order=date&amp;key=".$token."&amp;maxResults=1".$cursor;
    
	//Récupération des informations depuis l'API
    $stream = file_get_contents($url);
    
    print_r($stream);
	?>