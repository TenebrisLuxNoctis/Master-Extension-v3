/************************************************
*	Page principale qui gère les notifications  *
* 												*
*	Dernière modification : Mai 2018 			*
************************************************/


/*	Variables globales
************************************************/

channel = "Spade_";
stream 	= "";						/*Stockage du timestamp du live*/
game = "";							/*Stockage du jeu joué*/	

Youtube_channel_ID	=	"UCOhP0t6arWMXqmcroJjMJ7A";

/*Clé API*/	
API_key_twitch = "1low3gl5nz7ep5o6qgj0xtrpd96mszn";
API_key_youtube = "AIzaSyAANw33DQWRi5OlPqgtRum_oQGWjB_BXdA";

/*Variables utilisées pour détecter le changement de statut du live (on/off)*/						
off = 0;
live = 0;

/*Variable utilisée pour détecter le changement de jeu*/
oldG = "";
newG = "";

/*Paramètres de la notification*/
title 			= channel + " - Je suis en live !";
message 		= "Retrouvez moi en live dès maintenant sur ";
messageG 		= "Je switch sur ";
notifsound 		= new Audio('../mp3/notification.mp3');
url				= "images/icon128.png";
LiveOn			= "images/LiveOn.png";
messageLiveOn	= channel + " - LIVE!";
LiveOff			= "images/icon128.png";
messageLiveOff	= channel;


/*	Fonctions
*************************************************/

/*	
*	notify(options)
*	Paramètres : options = tableau contenant les options de l'utilisateur
*	lance la notification à partir des paramètres de l'utilisateur
*/
function notify(options)
{    	
	/*Si l'utilisateur a activé les notifications*/
	if(options[0] == 1) 
	{
		chrome.notifications.create('notifL', { type: "basic", title: title, message: message+game+" !", iconUrl: url}, function(id) {});
		chrome.notifications.onClicked.addListener(function(id){
			if(id=="notifL")
			{
				chrome.tabs.create({ url: options[2] + channel });
			}
			chrome.notifications.clear(id, function(){});
		});
		/*Si l'utilisateur a activé le son*/
		if(options[1] == 1)
		{
			notifsound.play();
		}
	}
	/*Mise à jour de la barre du navigateur*/
	chrome.browserAction.setIcon({path:LiveOn});
	chrome.browserAction.setTitle({title : messageLiveOn});
}

/*
*	notifYouTube(title, id)
*	Paramètres : title = chaîne / id = int / options = tableau des options utilisateur
*	Génère une notification pour la vidéo ayant le titre title
*/
function notifYouTube(title, id, options) {
    if(options[0] == 1)
	{
		var opt = {
			type: "basic",
			title: "Nouvelle vidéo YouTube",
			message: title,
			iconUrl: url
		}
		chrome.notifications.create(id, opt);
		if(options[1] == 1)
		{
			notifsound.play();
		}
	}
}

/*	
*	LaunchNotif()
*	Paramètres : /
*	Récupère les paramètres de l'utilisateur et appelle la fonction notif()
*/
function LaunchNotif()
{
	chrome.storage.local.get(['baseurl', 'notif', 'song'], function(result){
		var urls = ["https://www.twitch.tv/", "http://multitwitch.tv/", "http://speedrun.tv/", "http://kadgar.net/live/"];
		
		result.notif = setBool(result.notif, 1);		
		result.song = setBool(result.song, 1);

		if (urls.indexOf(result.baseurl) == -1){
			result.baseurl = "https://www.twitch.tv/";
		}
		/*On lance la notification*/
		notify([result.notif, result.song, result.baseurl]);
	});
}

function LaunchNotifYouTube(title, id)
{
	chrome.storage.local.get(['youtubenotif', 'songyt'], function(result){
	
		result.youtubenotif = setBool(result.youtubenotif, 1);
		result.songyt = setBool(result.songyt, 1);
		
		notifYouTube(title, id, [result.youtubenotif, result.songyt]);
	});
}

/*	
*	analyze()
*	Paramètres : data = données reçues de l'API twitch
*	Analyse data et retourne les informations utiles (timestamp et jeu actuel)
*/
function analyze(data)
{console.log(data);
	/*Construction de la structure de retour*/
	var stream_data= new Array();
	
	/*Si la requête a retournée des données*/
	if(!data)
	{
		stream_data[0] = "error";
	}
	else if(!data.stream) /*Si le live n'est pas lancé*/
	{
		stream_data[0] = "offline";
	}
	else if(data.stream._id) /*Si le live est ON*/
	{
		/*Sauvegarde du timestamp et du jeu actuel*/
		stream_data[0]=data.stream.created_at;
		stream_data[1]= data.stream.game;
		stream_data[2]= data.stream.viewers;
		stream_data[3]= data.stream.channel.status;
	}
	else
	{
		stream_data[0] = "error";
	}
	
	return stream_data;
}

/*
*	DetectGameSwitch(oldJ, newJ)
*	Paramètres : oldG = jeu avant changement / newJ = jeu après changement
*	Détecte si il faut lancer la notification tout en contournant un bug twitch lors d'un switch de jeu (le changement se fait en double)
*/
function DetectGameSwitch(oldJ, newJ)
{
	var bool = true;

	if(oldG != "" && newG != "")
	{
		if(newG == oldJ && newJ == oldG)
			bool = false;
	}
	oldG = oldJ;
	newG = newJ;
	
	return bool;
}

/*
*	manageGameNotif(gameL, jeu)
*	Paramètres : gameL = jeu de la requête précédente / jeu = jeu de la requête actuelle
*	Détecte si il faut ou non lancer une notification de changement de jeu
*/
function manageGameNotif(gameL, jeu)
{
	if(live == 1)
	{
		var doIchange = DetectGameSwitch(gameL, jeu);
		/*Le jeu actuel vient de changer*/
		if(off == 0 && jeu && gameL != jeu && jeu != 'Talk Shows' && doIchange)
		{
			/*Récupération des options liées au changement de jeu*/
			chrome.storage.local.get(['gamechange', 'songGame'], function(result){
				
				result.gamechange = setBool(result.gamechange, 0);
				result.songGame = setBool(result.songGame, 0);
				
				if(result.gamechange == 1)
				{
					
						chrome.notifications.create('notifG', { type: "basic", title: title, message: messageG+jeu+" !", iconUrl: url}, function(id) {});
						chrome.notifications.onClicked.addListener(function(id){
							if(id=="notifL")
							{
								chrome.tabs.create({ url: options[2] + channel });
							}
							chrome.notifications.clear(id, function(){});
						});
						/*Si l'utilisateur a activé le son*/
						if(result.songGame == 1)
						{
							notifsound.play();
						}
				}
			});
		}
	}
}


/*	
*	check_stream()
*	Paramètres : /
*	Teste le statut du stream et appelle LaunchNotif() si besoin
*/
function check_stream() {
	/*Initialisation de la requête*/
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
			/*Récupération des données*/
			var data = xmlhttp.responseText;
			var tmp = analyze(JSON.parse(data));
			
			game_tmp = tmp[1];
			var created_at = tmp[0];
			
			/*Si le live est lancé*/
			if(created_at != "offline" && created_at != "error")
			{
					manageGameNotif(game, game_tmp);
					game = game_tmp;
					if(created_at != stream)
					{
						/*Sauvegarde du timestamp afin de ne pas relancer la notification*/
						stream = created_at;
						LaunchNotif();
						/*Sauvegarde du timestamp de création de la session actuelle*/
						chrome.storage.local.set({'time': stream}, function(){
						});
					}
					/*Mise à jour des variables de statut*/
					off = 0;
					live = 1;
			}
			else if (created_at == "offline")
			{
				/*L'API twitch renvoyant des erreurs assez fréquemment, la détection du statut OFF se fait au bout de 2 retours négatifs de l'API*/
				if(off == 5 && live == 1)
				{
					/*Mise à jour de la barre du navigateur*/
					chrome.browserAction.setIcon({path:LiveOff});
					chrome.browserAction.setTitle({title : messageLiveOff});
					live = 0;
				}	
				off += 1;	
			}
			
			/*Sauvegarde du statut du live en local (pour la popup)*/
			chrome.storage.local.set({'living': live, 'game': game, 'viewers' : tmp[2], 'title': tmp[3]}, function(){
			});
			
		}
	}

	/*Lancement de la requête à l'API*/
    var url = "https://api.twitch.tv/kraken/streams/" + channel;
    xmlhttp.open("GET",url,true);
    xmlhttp.setRequestHeader("Client-ID", API_key_twitch);
    xmlhttp.send();
}

/*	
*	checkNewVideos()
*	Paramètres : /
*	Teste le statut ddes vidéos youtube et lance des notifications si besoin
*/
function checkNewVideos() {
	/*Initialisation de la requête*/
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
			/*Récupération des données*/
			var tmp = xmlhttp.responseText;
			data = JSON.parse(tmp);

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
	}

	chrome.storage.local.get(['yt_time'], function(result){
		var lastTime = null;
		if(result.yt_time)
			lastTime = new Date(result.yt_time);
		
		var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId="+Youtube_channel_ID+"&order=date&key="+API_key_youtube+"&maxResults=1"+(lastTime?("&publishedAfter="+lastTime.toISOString()):"");

		/*Lancement de la requête à l'API*/
		xmlhttp.open("GET",url,true);
		xmlhttp.send();
	});
	
}

/*	Programme principal
*************************************************/

/*Répétition de check_stream() toutes les 15 secondes*/
setInterval(check_stream,15000);
check_stream();

setInterval(checkNewVideos,60000);
checkNewVideos();

/*On réinitialise l'icône dans la barre du navigateur*/
chrome.browserAction.setIcon({path:LiveOff});

/*Fonctions présentes de base qui permettent de récupérer le pseudo twitch de l'utilisateur*/
var change_username = (username, callback) => {
    chrome.storage.local.set({'username': username}, callback)
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      username = request.username
      if(request.username==null)
        username = ""
      change_username(username, function(){})
  });