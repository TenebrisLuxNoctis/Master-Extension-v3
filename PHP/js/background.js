/************************************************
*	Page principale qui gère les notifications  *
* 												*
*	Dernière modification : Septembre 2018			*
*					PHP version					*
************************************************/


/*	Variables globales de fonctionnement
************************************************/

domainurl 	= "PUT_YOUR_DOMAIN_HERE";	/*L'url du chemin de la page php que vous avez upload */
stream 		= "";						/*Stockage du timestamp du live*/
game 		= "";						/*Stockage du jeu joué*/

/*Variables utilisées pour détecter le changement de statut du live (on/off)*/
off 	= 0;
live 	= 0;

/*Variable utilisée pour détecter le changement de jeu*/
oldG = "";
newG = "";
lastGameChange 	= null;

/*	Fonctions
*************************************************/

/**
 * Lance la notification de live à partir des paramètres de l'utilisateur.
 * @param {string[]} options tableau contenant les options de l'utilisateur
 */
function notify(options)
{    	

	/*Si l'utilisateur a activé les notifications*/
	if(options[0] == 1) 
	{
		chrome.notifications.create(channel+'notifL', { 
			type: "basic", 
			title: title, 
			message: messageLive + game + " !", 
			iconUrl: LiveIconUrl
		}, function(id) {});

		chrome.notifications.onClicked.addListener(function(id){
			if(id== channel+'notifL')
			{
				var url = options[2] + channel;
				manageTabs(url, true);
			}
			chrome.notifications.clear(id, function(){});
		});
		/*Si l'utilisateur a activé le son*/
		if(options[1] == 1)
		{
			new Audio(notifsoundLive).play();
		}
	}
	/*Mise à jour de la barre du navigateur*/
	chrome.browserAction.setIcon({path:LiveOn});
	chrome.browserAction.setTitle({title : messageLiveOn});
}


/**
 * Génère une notification pour la vidéo ayant le titre 'title'.
 * @param {string} title titre de la vidéo
 * @param {string} id id de la vidéo
 * @param {string[]} options tableau des options utilisateur
 */
function notifYouTube(title, id, options) {
    if(options[0] == 1)
	{
		var opt = {
			type: "basic",
			title: titleYT,
			message: title,
			iconUrl: VideoIconUrl
		}
		chrome.notifications.create(id+"#YT", opt,function(id){});
		chrome.notifications.onClicked.addListener(function(id){
			if(id.includes("#YT"))
			{
				var url = "https://www.youtube.com/watch?v="+id.replace("#YT", "");
				manageTabs(url, true);
			}
			chrome.notifications.clear(id, function(){});
		});
		if(options[1] == 1)
		{
			new Audio(notifsoundYT).play();
		}
	}
}

/**
 * Récupère les paramètres de l'utilisateur et appelle la fonction notif() pour notifier du lancement du live.
 */
function LaunchNotif()
{
	chrome.storage.local.get(['baseurl', 'notif', 'song'], function(result){		
		result.notif = setBool(result.notif, 1);		
		result.song = setBool(result.song, 1);

		result.baseurl = setUrlRedirect(result.baseurl);

		/*On lance la notification*/
		notify([result.notif, result.song, result.baseurl]);
	});
}

/**
 * Récupère les paramètres de l'utilisateur et appelle la fonction notifYouTube() pour notifier d'une sortie de vidéo.
 * @param {string} title titre de la vidéo
 * @param {string} id id de la vidéo
 */
function LaunchNotifYouTube(title, id)
{
	chrome.storage.local.get(['youtubenotif', 'songyt'], function(result){
	
		result.youtubenotif = setBool(result.youtubenotif, 1);
		result.songyt = setBool(result.songyt, 1);
		
		notifYouTube(title, id, [result.youtubenotif, result.songyt]);
	});
}

/**
 * Détecte si il faut lancer la notification tout en contournant un bug twitch lors d'un switch de jeu (le changement se fait en double)
 * @param {string} oldG jeu avant changement
 * @param {string} newJ jeu après changement
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

/**
 * Détecte si il faut ou non lancer une notification de changement de jeu
 * @param {string} gameL jeu de la requête précédente
 * @param {string} jeu jeu de la requête actuelle
 */
function manageGameNotif(gameL, jeu)
{
	if(live == 1)
	{
		var doIchange = DetectGameSwitch(gameL, jeu);
		
		var isBlacklisted = blacklistGame.indexOf(jeu) != -1;
		
		/*Le jeu actuel vient de changer et il n'est pas dans la liste d'exclusion*/
		if(off == 0 && jeu && gameL != jeu && !isBlacklisted && doIchange)
		{
			/*Récupération des options liées au changement de jeu*/
			chrome.storage.local.get(['gamechange', 'songGame'], function(result){
				
				result.gamechange = setBool(result.gamechange, 0);
				result.songGame = setBool(result.songGame, 0);	

				lastGameChange = Date.now();

				LaunchGameNotif([result.gamechange, result.songGame, jeu]);
			});
		}else if(isBlacklisted){
			lastGameChange = null;
		}
	}
}

/**
 * Lance la notyification du changement de jeu
 * @param {array} opt Paramètres utilisateurs + jeu
 */
function LaunchGameNotif(opt){

	if(opt[0] == 1){
		chrome.tabs.getSelected(null, function(onglet){
			var change = 0;
			let i = 0;

			while(i< urls.length && onglet.url.toLowerCase() != urls[i]+channel.toLowerCase())
			{
				i++;
			}	
			change= (i< urls.length)? true: false;
			gamechangeeffective = (change)? false: true;

			if(gamechangeeffective == 1)
			{
				chrome.notifications.create(channel+'notifG', { 
					type: "basic", 
					title: title, 
					message: messageG + opt[2] +" !", 
					iconUrl: GameIconUrl
				}, function(id) {});

				chrome.notifications.onClicked.addListener(function(id){
					if(id==channel+"notifG")
					{
						chrome.notifications.clear(id, function(){});
					}
				});
				/*Si l'utilisateur a activé le son*/
				if(opt[1] == 1)
				{
					new Audio(notifsoundGame).play();
				}
			}
		});
	}
}

/**	
*	Teste le statut du stream et appelle LaunchNotif() si besoin
*/
function check_stream() {

	var url = domainurl + "/twitch.php";

	fetch(url)
			.then(function(response){
				if(response.status == 200){
					response.json().then(function(data){
						created_at = data.created_at;
						game_tmp = (data.game != "error") ? data.game : "";
						var viewers = (data.viewers != "error") ? data.viewers : "";
						var title = (data.status != "error") ? data.status : "";

						/*Si le live est lancé*/
						if (created_at != "offline" && created_at != "error") {
							manageGameNotif(game, game_tmp);
							game = game_tmp;
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
							if (off == 5 && live == 1) {
								/*Mise à jour de la barre du navigateur*/
								chrome.browserAction.setIcon({ path: LiveOff });
								chrome.browserAction.setTitle({ title: messageLiveOff });
								live = 0;
							}
							off += 1;
						}

						/*Sauvegarde du statut du live en local (pour la popup)*/
						chrome.storage.local.set({ 'living': live, 'game': game, 'viewers' : viewers, 'title': title, 'lastGameChange': lastGameChange }, function () {
						});
					});
				}else{console.error(response.json());}
			})
			.catch(function(error){
				console.error(error);
			});
}

/**
 * Teste le statut des vidéos youtube et lance des notifications si besoin
 */
function checkNewVideos() {

	chrome.storage.local.get(['yt_time'], function (result) {
		var lastTime = null;
		if (result.yt_time)
			lastTime = new Date(result.yt_time);

		var url = domainurl + "/youtube.php" + (lastTime != null ? "?lasttime=" + lastTime : "");
		
		fetch(url)
			.then(function(response){
				if(response.status == 200){
					response.json().then(function(data){
						if (data.items.length > 0) {
							var tmp = data.items[0].snippet.publishedAt;
							var d = new Date(tmp);
							d.setTime(d.getTime() + 1000);
							chrome.storage.local.set({ 'yt_time': d.toISOString() }, function () { });
							for (var video of data.items) {
								LaunchNotifYouTube(video.snippet.title, video.id.videoId);
							}
						}
					});
				}else{console.error(response.json());}
			})
			.catch(function(error){
				console.error(error);
			});
		
	});
}

/**
 * Vérifie si on a dépassé le jour de resub (prime) et le notifie si besoin
 */
function checkReSubDate(){
	//Récupération de la date de resub (prime)
	chrome.storage.local.get(['RSnotif', 'dateRS', 'RSnotified', 'ecartMoisRS', 'songRS'], function(result){
		var resubTime = (result.dateRS != null ? result.dateRS : "");
		
		result.RSnotif = setBool(result.RSnotif, 0);
		result.RSnotified = setBool(result.RSnotified, 0);
		result.songRS = setBool(result.songRS, 1);
		
		//On force la copie de la valeur
		let tmp = result.RSnotified == true;
	
		if(result.dateRS && resubTime != null){	
			resubTime = new Date(result.dateRS);
			let newEcart = Math.floor(getdiffJour(resubTime)/30);
			var ToNotify =  newEcart > result.ecartMoisRS;

			if(ToNotify)
			{
				if(result.RSnotified == 0){
					chrome.notifications.create(channel+'notifRS', { 
						type: "basic", 
						title: titleRS, 
						message: messageRS, 
						iconUrl: iconRS
					}, function(id) {});
					
					//Si la notification est bien créée, on sauvegarde le fait que l'on a notifié l'utilisateur
					tmp = true;
					result.ecartMoisRS = newEcart;
						
					if(result.songRS == 1)
					{
						new Audio(notifsoundRS).play();
					}
	
					chrome.notifications.onClicked.addListener(function(id){
						if(id==channel+"notifRS")
							chrome.notifications.clear(id, function(){});
					});
				}
			}
			else{
				tmp = false;
			}

			if(result.RSnotified != tmp)
				chrome.storage.local.set({'RSnotified': tmp, 'ecartMoisRS' : result.ecartMoisRS }, function(){});
		}	
	});
}

/*	Programme principal
*************************************************/

/*Répétition de check_stream() toutes les 15 secondes*/
setInterval(check_stream,15000);
check_stream();

setInterval(checkNewVideos,60000);
checkNewVideos();

//Répétition de checkReSubDate() toutes les heures
setInterval(checkReSubDate,3600000);
checkReSubDate();

/*On réinitialise l'icône dans la barre du navigateur*/
chrome.browserAction.setIcon({path:LiveOff});

/*Fonctions présentes de base qui permettent de récupérer le pseudo twitch de l'utilisateur*/
var change_username = (username, callback) => {
    chrome.storage.local.set({'username': username}, callback)
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      username = request.username;
      if(request.username==null)
        username = "";
      change_username(username, function(){});
  });
