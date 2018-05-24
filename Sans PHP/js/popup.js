/************************************************
*	Page de gestion de la fenêtre popup			*
* 												*
*	Dernière modification : Mai 2018 			*
************************************************/


/*	Variables globales
************************************************/

domain = "https://game.mastersnakou.fr";

img = null;
qrcode = false;
snap = false;
live = 0;

$.ajaxSetup({
    cache: false
});

/*	Fonctions
************************************************/

/**
 * Caclcule l'uptime de la session en cours
 * @param {string} streamDate timestamp correspondant au début du live
 * @param {string} text texte précédent l'affichage de l'uptime
 */
function uptime(streamDate, text = "Uptime : ")
{
	var d= new Date(streamDate);
	var t= new Date();
	var uptime = t-d;

	var h = Math.trunc(uptime/3600000);
	var min = Math.trunc(Math.trunc(uptime-(3600000*h))/60000);
	min = (min < 10) ? '0'+min : min;
	
	var res = text + h + "h" + min;
	
	return res;
}

/**
 * Vérifie si l'onglet courant est utilisé ou non puis l'utilise ou en crée un nouveau selon le résultat
 * @param {string} elem élément jquery (classe ou id CSS)
 */
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

//On attend le chargement de la poup
$(document).ready(function(){

	chrome.storage.local.get(['baseurl', 'living', 'game', 'time', 'viewers', 'title', 'lastGameChange'], function(result){
		/*On récupère les informations sur le statut du live*/
		live = setBool(result.living, 0);	
	
		result.baseurl = setUrlRedirect(result.baseurl);
		
		if(result.lastGameChange != null){
			$("#game_uptime").text(uptime(result.lastGameChange, "Depuis : "));
		}
	
		$("#channel_link").attr("href", result.baseurl + channel);
		$("#game_link").attr("href", result.baseurl + channel);
	
		/*Si le live est off*/
		if(live == 0)
		{
			/*Récupération du countdown sur le site*/
			$.get("http://mastersnakou.fr/", function (data) {
	
				var i = data.indexOf('streamDate =');
				var streamDate = data.substr(i + 14, 19);
				
				if (streamDate.length == 0 || new Date(streamDate) < new Date()) {
						$('#live').hide();
				} else {
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
			$("#game-logo").attr("title", GameToolTip + result.game);
			$("#game-logo").show();
			/*On modifie l'image de la popup*/
			$('#brand-logo-channel').attr("src", LiveIconUrlPopup);
			/*On change le texte de la popup*/
			$('#live').html(LiveText);
			$('#live').css('color', '#CF0202');
			$('#viewersCount').html("🔴 "+result.viewers + ViewersText);
			
			var uptimeText = uptime(result.time);
			$('#uptime').text(uptimeText);
			$('#title').text(result.title);
		}
	
		/*Sauvegarde de l'image courante de la popup*/
		img= $('#brand-logo-channel').attr("src");
	
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
	//Inutile car non affiché !
		/*$('#progress-bar').css('width', function () {
			return Math.floor(player['remaining_xp'] / player['lvl_xp'] * 100)
		});*/
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

});


/*	Détection des évènements "click"
*************************************************/

/*Lors du clic sur le logo "QRCode"*/
$(document).on('click', '#qrcode',function(){

	//Variables de statut
	qrcode = !qrcode;
	snap = false;

	if(qrcode)
	{
		/*On affiche le qrcode*/
		$('#brand-logo-channel').attr("src", QRCodeUrl);
		$('#brand-logo-channel').css('z-index', 11);
	}
	else
	{
		/*On affiche le logo de l'extension*/
		$('#brand-logo-channel').attr("src", img);
		$('#brand-logo-channel').css('z-index', 1);
	}
});

/*Lors du clic sur le logo "snapchat"*/
$(document).on('click', '#snapchat',function(){
	//Variables de statut
	snap = !snap;
	qrcode = false;

	if(snap)
	{
		/*on affiche le texte*/
		$('#live').html(SnapText).show();
		/*On affiche le snapcode*/
		$('#brand-logo-channel').attr("src", SnapCodeUrl);
	}
	else
	{
		/*On affiche le logo de l'extension*/
		$('#brand-logo-channel').attr("src", img);
		/*on affiche un autre message*/
		$('#live').html((live? LiveText: "")).show();
	}
});

/*Lors du clic sur les liens, on utilise les onglets intelligemment*/
$(document).on('click', '.redirect', function(event){
	event.preventDefault();
	manageTabs($(this));
});