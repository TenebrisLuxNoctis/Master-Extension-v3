/************************************************
*           Page de configuration               *
* 												*
*	Dernière modification : Novebre 2018 		*
************************************************/


/*	Configuration de l'extension
************************************************/

channel             = "MasterSnakou";					//chaîne twitch
Youtube_channel_ID	=	"UCOhP0t6arWMXqmcroJjMJ7A";		//Youtube ID

//Icône et texte de la barre d'état du navigateur
LiveOn			    = "images/LiveOn.png";  			//Icône lorsque le live est lancé
messageLiveOn	    = channel + " - LIVE!"; 			//Texte lorsque le live est lancé
LiveOff			    = "images/icon128.png"; 			//Icône lorsque le live est off
messageLiveOff	    = channel;             				//Texte le live est off

blacklistGame 		= ['Talk Shows', 'Just Chatting'] ; //Liste des jeux que l'on ne souhaite pas notifier lorsqu'ils apparaissent

/**
 * Paramètres des notifications
 */

//Fichier audio des notifications


//Titre de notification général (utilisé pour notifié le live et les changements de jeu)
title 	    	    = channel + " - Je suis en live !"; 

//Notification Live
messageLive     	= "Retrouvez moi en live dès maintenant sur ";
LiveIconUrl	        = "/images/icon128.png";
notifsoundLive 		= "../mp3/live.mp3";

//Notification de changement de jeu
messageG 		    = "Je switch sur ";
GameIconUrl		    = "/images/goty.png";
notifsoundGame		= "../mp3/game.mp3";

//Notification de vidéo youtube
titleYT             = channel + " - Nouvelle vidéo !";
VideoIconUrl	    = "/images/omg.png";
notifsoundYT 		= "../mp3/youtube.mp3";

//Notification de changement d'options
titleOptions	    = channel + " - Enregistré !";
messageOptions	    = "Vos changements d'options ont bien été pris en compte !";
OptionsIconUrl	    = "/images/shtlf.png";

//Notification de date de resub (prime)
titleRS             = channel + " - Jour de resub !";
messageRS           = "N'oublie pas de te resub !";
iconRS              = "/images/rs.png";
notifsoundRS		= "../mp3/youtube.mp3";

/**
 * Configuration popup
 */

//Messages
ViewersText         = " viewers";
SnapText            = "Mon snap : mastersnakou";
TsText              = "TeamSpeak : barbus.mastersnakou.fr";
GameToolTip         = "En live sur ";

//Images de la popup
LiveIconUrlPopup    = "/images/LiveOn.png";
SnapCodeUrl         = "/images/snapcode.png";
QRCodeUrl           = "/images/qrcode.jpg";


/**
 * Autre
 */

//Liste des sites vers lequel l'utilisateur peut choisir d'être redirigé pour regarder le live
urls                = ["https://www.twitch.tv/", "http://multitwitch.tv/", "http://speedrun.tv/", "http://kadgar.net/live/"];


/**
 * Clés API	
 */

API_key_twitch     = "1low3gl5nz7ep5o6qgj0xtrpd96mszn";
API_key_youtube    = "AIzaSyAANw33DQWRi5OlPqgtRum_oQGWjB_BXdA";
