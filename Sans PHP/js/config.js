/************************************************
*           Page de configuration               *
* 												*
*	Dernière modification : Mai 2018 			*
************************************************/


/*	Configuration de l'extension
************************************************/

channel         = "MasterSnakou";
LiveOn			= "images/LiveOn.png";  //Icône dans la barre d'état du navigateur lorsque le live est lancé
messageLiveOn	= channel + " - LIVE!"; //Texte dans la barre d'état du navigateur lorsque le live est lancé
LiveOff			= "images/icon128.png"; //Icône dans la barre d'état du navigateur lorsque le live est off
messageLiveOff	= channel;              //Texte dans la barre d'état du navigateur lorsque le live est off


/**
 * Paramètres des notifications
 */

//Fichier audio des notifications
notifsound 		= new Audio('../mp3/notification.mp3');

title 	    	= channel + " - Je suis en live !"; //Titre de notification général (utilisé pour notifié le live et les changements de jeu)

//Notification Live
messageLive    	= "Retrouvez moi en live dès maintenant sur ";
LiveInconUrl	= "/images/icon128.png";

//Notification de changement de jeu
messageG 		= "Je switch sur ";
GameIconUrl		= "/images/goty.png";

//Notification de vidéo youtube
VideoIconUrl	= "/images/omg.png";

//Notification de changement d'options
titleOptions	= channel + " - Changements effectués !";
messageOptions	= "Vos changements d'options ont bien été pris en compte !";
OptionsIconUrl	= "/images/kc.png";


/**
 * Autre
 */

//Liste des sites vers lequel l'utilisateur peut choisir d'être redirigé pour regarder le live
urls = ["https://www.twitch.tv/", "http://multitwitch.tv/", "http://speedrun.tv/", "http://kadgar.net/live/"];