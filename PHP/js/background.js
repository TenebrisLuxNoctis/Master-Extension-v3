/************************************************
*	Page principale qui gère les notifications  *
* 												*
*	Dernière modification : mai 2018 			*
************************************************/


/*	Variables globales
************************************************/

channel 	= "MasterSnakou";
domainurl 	= "PUT_YOUR_DOMAIN_HERE";	/*L'url du chemin de la page php que vous avez upload */
stream 		= "";						/*Stockage du timestamp du live*/
game 		= "";						/*Stockage du jeu joué*/

/*Variables utilisées pour détecter le changement de statut du live (on/off)*/
off 	= 0;
live 	= 0;

/*Variable utilisée pour détecter le changement de jeu*/
oldG = "";
newG = "";

/*Paramètres de la notification*/
title 		= channel + " - Je suis en live !";
message 	= "Retrouvez moi en live dès maintenant sur ";
messageG 	= "Je switch sur ";
notifsound 	= new Audio('../mp3/notification.mp3');
url 		= "images/icon128.png";
LiveOn		= "images/LiveOn.png";
messageLiveOn = channel + " - LIVE!";
LiveOff 	= "images/icon128.png";
messageLiveOff = channel;

/*	Fonctions
*************************************************/

/*	
*	notify(options)
*	Paramètres : options = tableau contenant les options de l'utilisateur
*	lance la notification à partir des paramètres de l'utilisateur
*/

function notify(options) {
	/*Si l'utilisateur a activé les notifications*/
	if (options[0] == 1) {
		chrome.notifications.create('notifL', { type: "basic", title: title, message: message + game + " !", iconUrl: url }, function (id) { });
		chrome.notifications.onClicked.addListener(function (id) {
			if (id == "notifL") {
				chrome.tabs.create({ url: options[2] + channel });
			}
			chrome.notifications.clear(id, function () { });
		});
		/*Si l'utilisateur a activé le son*/
		if (options[1] == 1) {
			notifsound.play();
		}
	}
	/*Mise à jour de la barre du navigateur*/
	chrome.browserAction.setIcon({ path: LiveOn });
	chrome.browserAction.setTitle({ title: messageLiveOn });
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

/*	
*	LaunchNotifYouTube()
*	Paramètres : /
*	Récupère les paramètres de l'utilisateur et appelle la fonction notifYoutube()
*/
function LaunchNotifYouTube(title, id)
{
	chrome.storage.local.get(['youtubenotif', 'songyt'], function(result){
	
		result.youtubenotif = setBool(result.youtubenotif, 1);
		result.songyt = setBool(result.songyt, 1);
		
		notifYouTube(title, id, [result.youtubenotif, result.songyt]);
	});
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
	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			/*Récupération des données*/
			var data = xmlhttp.responseText;
			data= data.split(',');

			created_at = data[0];
			game = (data[1] != "error") ? data[1] : "";
			var viewers = (data[2] != "error") ? data[2] : "";
			var title = (data[3] != "error") ? data[3] : "";

			/*Si le live est lancé*/
			if (created_at != "offline" && created_at != "error") {
				if (created_at != stream) {
					/*Sauvegarde du timestamp afin de ne pas relancer la notification*/
					stream = created_at;
					LaunchNotif();

					/*Sauvegarde du timestamp de création de la session actuelle pour la popup*/
					chrome.storage.local.set({'time': stream}, function(){
					});
				}
				/*Mise à jour des variables de statut*/
				live = 1;
				off = 0;
			}
			else if (created_at == "offline") {
				/*L'API twitch renvoyant des erreurs assez fréquemment, la détection du statut OFF se fait au bout de 2 retours négatifs de l'API*/
				if (off == 2 && live == 1) {
					/*Mise à jour de la barre du navigateur*/
					chrome.browserAction.setIcon({ path: LiveOff });
					chrome.browserAction.setTitle({ title: messageLiveOff });
					live = 0;
				}
				off += 1;
			}

			/*Sauvegarde du statut du live en local (pour la popup)*/
			chrome.storage.local.set({ 'living': live, 'game': game, 'viewers' : viewers, 'title': title }, function () {
			});

		}
	}

	/*Lancement de la requête à l'API via le script PHP*/
	xmlhttp.open("GET", domainurl + "/twitch.php", true);
	xmlhttp.send();
}

function checkNewVideos() {
	/*Initialisation de la requête*/
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			/*Récupération des données*/
			var tmp = xmlhttp.responseText;

			data = JSON.parse(tmp);

			if (data.items.length > 0) {
				var tmp = data.items[0].snippet.publishedAt;
				var d = new Date(tmp);
				d.setTime(d.getTime() + 1000);
				chrome.storage.local.set({ 'yt_time': d.toISOString() }, function () { });
				for (var video of data.items) {
					LaunchNotifYouTube(video.snippet.title, video.id.videoId);
				}
			}
		}
	}

	chrome.storage.local.get(['yt_time'], function (result) {
		var lastTime = null;
		if (result.yt_time)
			lastTime = new Date(result.yt_time);

		/*Lancement de la requête à l'API*/
		xmlhttp.open("GET", domainurl + "/youtube.php", true);
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