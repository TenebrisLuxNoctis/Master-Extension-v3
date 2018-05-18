/************************************************
*	Page de gestion des options utilisateur		*
* 												*
*	Dernière modification : août 2017 			*
************************************************/


/*	Variables globales
************************************************/

channel = "MasterSnakou";


/*	Fonctions
*************************************************/

/**
 * Désactive ou non les boutons son passés en paramètres
 * @param {string} elem1 élément jquery (classe ou id CSS)
 * @param {string} elem2 élément jquery (classe ou id CSS)
 * @param {boolean} bool booléen état des éléments
 */
function disableIt(elem1, elem2, bool)
{
	$(elem1).prop('disabled', bool);
	$(elem2).prop('disabled', bool);
	if(bool)
		$(elem1).children('label').addClass('disable');
	else
		$(elem1).children('label').removeClass('disable');
}

/**
 * Vérifie si la case "son" doit être activée ou non
 */
function checkAble()
{
	disableIt($('#songL'), $('#songLC'), !$('#notifLC').is(':checked'));
		
	disableIt($('#songG'), $('#songGC'), !$('#notifGC').is(':checked'));
	
	disableIt($('#songV'), $('#songVC'), !$('#notifVC').is(':checked'));
}

/**
 * Gère l'affichage des checkbox-boutons (cochées ou non)
 * @param {string} elem élément jquery (classe ou id CSS)
 * @param {string} oldclass élément jquery (classe ou id CSS)
 * @param {string} newclass élément jquery (classe ou id CSS)
 * @param {string} deactivate élément jquery (classe ou id CSS)
 * @param {string} activate élément jquery (classe ou id CSS)
 * @param {boolean} checked booléen état des éléments
 * @param {boolean} texte booléen état des éléments
 */
function manageCheckbox(elem, oldclass, newclass, deactivate, activate, checked, texte)
{
		$(elem).children('label').removeClass(oldclass).addClass(newclass);
		$(elem).children('label').children('i').removeClass(deactivate).addClass(activate);
		$(elem).children('label').children(':checkbox').prop('checked', checked);
		if(texte){$(elem).children('label').children('span').text(texte);}
		
		checkAble();
}

/**
 * Coche/Décoche la checkbox passée en argument
 * @param {*} elem élément jquery (classe ou id CSS)
 * @param {*} bool booléen état de l'élément
 */
function checkIt(elem, bool)
{
	if(bool && $(elem).children('label').hasClass('btn-danger')){
		$(elem).get(0).click();
	}	
	else if(!bool && $(elem).children('label').hasClass('btn-success')){
		$(elem).get(0).click();
	}
}

/**
 * Récupère les options depuis le stockage local et prérempli le formulaire
 */
function restaurerLesOptions()
{
	chrome.storage.local.get(['baseurl', 'notif', 'song', 'gamechange', 'songGame', 'youtubenotif', 'songyt'], function(result){
		var bool = [0, 1];
		var urls = ["https://www.twitch.tv/", "http://multitwitch.tv/", "http://speedrun.tv/", "http://kadgar.net/live/"];
				
		result.notif = setBool(result.notif, 1);
		checkIt($('#notifL'), (result.notif==1));
			
		result.song = setBool(result.song, 1);
		checkIt($('#songL'), (result.song==1));
		
		result.gamechange = setBool(result.gamechange, 0);
		checkIt($('#notifG'), (result.gamechange==1));
		
		result.songGame = setBool(result.songGame, 0);
		checkIt($('#songG'), (result.songGame==1));
		
		result.youtubenotif = setBool(result.youtubenotif, 1);
		checkIt($('#songG'), (result.youtubenotif==1));
		
		result.songyt = setBool(result.songyt, 1);
		checkIt($('#songG'), (result.songyt==1));
		
		
		if (jQuery.inArray(result.baseurl, urls) == -1){
			result.baseurl = "https://www.twitch.tv/";
		}
		var choix = $('#baseurl > option');
		for (var i = 0; i < choix.length; i++)
			{
			if (choix[i].value == result.baseurl)
				{
				choix[i].selected = "true";
				break;
				}
			}
		
		checkAble();
	});
}

/**
 * Enregistre les options, fonction appelée par clic sur le bouton
 */
function enregistrer()
{			
	/*Récupération des données saisies*/
	var baseurl = $('#baseurl').val();
	var notifL = ($('#notifLC').is(':checked'))? 1: 0;
	var songL = ($('#songLC').is(':checked'))? 1: 0;
	var notifG = ($('#notifGC').is(':checked'))? 1: 0;
	var songG = ($('#songGC').is(':checked'))? 1: 0;
	var notifV = ($('#notifVC').is(':checked'))? 1: 0;
	var songV = ($('#songVC').is(':checked'))? 1: 0;
	
	/*Sauvegarde en local*/
	chrome.storage.local.set({'baseurl': baseurl, 'notif': notifL, 'song': songL, 'gamechange': notifG, 'songGame': songG, 'youtubenotif': notifV, 'songyt': songV}, function(){});
}


/*	Programme principal
*************************************************/

/*Au chargement de la page, on restaure les options*/	
restaurerLesOptions();

/*Lorsque l'on clique sur enregistrer*/		
$(document).on('click','#save-cfg',function(){
	var title 			= channel + " - Changements effectués !";
	var message 		= "Vos changements d'options ont bien été pris en compte !";
	var url				= "/images/icon128.png";
   
   enregistrer();
   
   chrome.notifications.create('notifO', { type: "basic", title: title, message: message, iconUrl: url}, function(id) {});

});

/*Lorsque l'on clique sur quitter*/		
$(document).on('click', '#quit-tab',function(){
	window.top.close();
});

/*lorsque l'on coche une checkbox*/
$(document).on('click', '.trigger', function(e){
	e.preventDefault();
	
	var deactivated = 'fa-warning';
	var activated = 'fa-check';
	var texte = "";
	
if(!$(this).prop('disabled'))
{
  if($(this).children('label').hasClass('btn-danger'))
    {
		texte = "Activé";
		if($(this).hasClass('mute'))
		{
			deactivated = 'fa-volume-off';
			activated = 'fa-volume-up';
			texte = null;
		}
		manageCheckbox($(this), 'btn-danger', 'btn-success', deactivated, activated, true, texte);
    }
    else
      {
		texte = "Désactivé";
		if($(this).hasClass('mute'))
		{
			deactivated = 'fa-volume-off';
			activated = 'fa-volume-up';
			texte = null;
		}
        manageCheckbox($(this), 'btn-success', 'btn-danger', activated, deactivated, false, texte);
      }
}
});