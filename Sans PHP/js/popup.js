/************************************************
*	Page de gestion de la fenêtre popup			*
* 												*
*	Dernière modification : août 2017 			*
************************************************/


/*	Variables globales
************************************************/

domain = "https://game.mastersnakou.fr";
channel = "MasterSnakou";
//token = "1low3gl5nz7ep5o6qgj0xtrpd96mszn";

qrcode = false;
snap = false;

$.ajaxSetup({
    cache: false
});

/*	Fonctions
************************************************/

/*
*	uptime(streamDate)
*	Paramètres : streamDate = timestamp correspondant au début du live
*	Caclcule l'uptime de la session en cours
*/
function uptime(streamDate)
{
	var d= new Date(streamDate);
	var t= new Date();
	var uptime = t-d;

	var h = Math.trunc(uptime/3600000);
	var min = Math.trunc(Math.trunc(uptime-(3600000*h))/60000);
	min = (min < 10) ? '0'+min : min;
	
	var res = "Uptime : "+h+"h"+min;
	
	return res;
}

function manageTabs(elem)
{
	/*On récupère les infos sur l'onglet courant*/
	chrome.tabs.getSelected(null, function(onglet){
		var redirectURL = $(elem).attr("href");

		/*Si c'est un nouvel onglet*/
		if(onglet.url == "chrome://newtab/")
		{
			/*On l'utilise*/
			chrome.tabs.update(onglet.id,{url:redirectURL});
		}
		else{
			/*Sinon, on en crée un nouveau*/
			chrome.tabs.create({url:redirectURL});
		}
		/*on ferme la popup*/
		window.close();
	});
}

/*	Programme principal
*************************************************/

chrome.storage.local.get(['baseurl', 'living', 'game', 'time'], function(result){
	/*On récupère les informations sur le statut du live*/
	var bool = [0, 1];
	var urls = ["https://www.twitch.tv/", "http://multitwitch.tv/", "http://speedrun.tv/", "http://kadgar.net/live/"];
	var prec = 0;

	if (jQuery.inArray(result.living, bool) == -1){
		result.living = 0;
	}	
	if (jQuery.inArray(result.baseurl, urls) == -1){
		result.baseurl = "https://www.twitch.tv/";
	}
	
	$("#channel_link").attr("href", result.baseurl + channel);
	
	/*Si le live est off*/
	if(result.living == 0)
	{
		/*Récupération du countdown sur le site*/
		$.get("http://mastersnakou.fr/", function (data) {

			var i = data.indexOf('streamDate =');
			var streamDate = data.substr(i + 14, 19);
			console.log(streamDate);
			if (streamDate.length == 0 || new Date(streamDate) < new Date()) {
					$('#live').hide();
					console.log("hidden");
			} else {
				console.log("count down");
				/*intégration du countdown dans la popup*/
				$("#getting-started")
                    .countdown(streamDate, function (event) {
                        $(this).text(
                            event.strftime('%Dj %Hh %Mm %Ss')
                        );
                    });
			}
		});
	}
	else /*Si le live est lancé*/
	{
		/*On ajoute l'image du jeu*/
		$('#game-logo').attr("src", "https://static-cdn.jtvnw.net/ttv-boxart/"+ (result.game).replace(/ /g, "%20") +"-96x144.jpg");
		$('#game-logo').attr("alt", result.game);
		$("#game-logo").attr("title", "En live sur " + result.game);
		$("#game-logo").show();
		/*On modifie l'image de la popup*/
		$('#brand-logo-channel').attr("src", '/images/LiveOn.png');
		/*On change le texte de la popup*/
		$('#live').html("Je suis actuellement en live!");
		$('#live').css('color', '#FF0000');
		
		var uptimeText = uptime(result.time);
		$('#uptime').text(uptimeText);
	}
	$('#live').fadeIn(1000);
});


/*"Fonctions" présentes de base : récupération du pseudo twitch depuis la mémoire, récupération de l'xp du mastergame, affichage*/
var get_username = function (callback) {
    chrome.storage.local.get('username', function (items) {
        callback(items['username']);
    })
};

var show_player = (player) => {
    $('#player-name').text(player['display_name']);
    $('#player-logo').attr("src", player['logo']);
    $('#player-xp').text('Exp. ' + player['remaining_xp'] + '/' + player['lvl_xp']);
    $('#player-lvl').text('Niv. ' + player['lvl']);
    $('#progress-bar').css('width', function () {
        return Math.floor(player['remaining_xp'] / player['lvl_xp'] * 100)
    });
    $('#player').fadeIn(1000);
};

get_username(function (username) {
    if (username != null && username != "") {
        $.getJSON(domain + "/player/" + username, function (data) {
            player = data['player'];
            show_player(player);
        })
    } else {
        $('#login').fadeIn(0);
    }
});

/*	Détection des évènements "click"
*************************************************/

/*Lors du clic sur le logo "QRCode"*/
$(document).on('click', '#qrcode',function(){
	qrcode = !qrcode;
	if(qrcode)
	{
		/*On affiche le qrcode*/
		$('#brand-logo-channel').attr("src", '/images/qrcode.jpg');
		$('#brand-logo-channel').css('z-index', 11);
	}
	else
	{
		/*On affiche le logo de l'extension*/
		$('#brand-logo-channel').attr("src", '/images/icon128.png');
		$('#brand-logo-channel').css('z-index', 1);
	}
});

/*Lors du clic sur le logo "snapchat"*/
$(document).on('click', '#snapchat',function(){
	snap = !snap;
	if(snap)
	{
		/*on affiche le texte*/
		$('#live').html("Mon snap : mastersnakou").show();
	}
	else
	{
		/*on affiche un autre message*/
		$('#live').html("Love you my boy !").show();
	}
});

/*Lors du clic sur le bouton twitch*/

$(document).on('click', '#channel_link', function(event){
	event.preventDefault();
	manageTabs($(this));
});
$(document).on('click', '#mastergame-button', function(event){
	event.preventDefault();
	manageTabs($(this));
});
$(document).on('click', '.redirect', function(event){
	event.preventDefault();
	manageTabs($(this));
});