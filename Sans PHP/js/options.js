/************************************************
*	Page de gestion des options utilisateur		*
* 												*
*	Dernière modification : Novebre 2018 		*
************************************************/

//Variable globale permettant de savoir si on a ou non modifié le champ Date
changedDate = false;
alreadyNotifiedRS = false;

/*	Fonctions
*************************************************/

/**
 * Désactive ou non les boutons 'son' passés en paramètres
 * @param {string} elem1 élément jquery (classe ou id CSS)
 * @param {string} elem2 élément jquery (classe ou id CSS)
 * @param {boolean} bool booléen état des éléments
 */
function disableIt(elem1, elem2, bool)
{
	$(elem1).prop('disabled', bool);
	$(elem2).prop('disabled', bool);
	if(bool){
		$(elem1).children('label').addClass('disable');
		$(elem1).children('label').children('.fa').addClass('disable');
	}
	else{
		$(elem1).children('label').removeClass('disable');
		$(elem1).children('label').children('.fa').removeClass('disable');
	}
		
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
 */
function manageCheckbox(elem, oldclass, newclass, deactivate, activate, checked)
{
		$(elem).children('label').removeClass(oldclass).addClass(newclass);
		$(elem).children('label').children('i').removeClass(deactivate).addClass(activate);
		$(elem).children('label').children(':checkbox').prop('checked', checked);
		
		checkAble();
}

function clicCheckboxHandler(e){
	
	var deactivated = '';
	var activated = '';
	
if(!e.prop('disabled'))
{
  if(e.children('label').hasClass('inactive'))
    {
		if(e.hasClass('mute'))
		{
			deactivated = 'fa-volume-off';
			activated = 'fa-volume-up';
		}
		manageCheckbox(e, 'inactive', 'active', deactivated, activated, true);
    }
    else
      {
		if(e.hasClass('mute'))
		{
			deactivated = 'fa-volume-off';
			activated = 'fa-volume-up';
		}
        manageCheckbox(e, 'active', 'inactive', activated, deactivated, false);
      }
}
}

/**
 * Coche/Décoche la checkbox passée en argument
 * @param {*} elem élément jquery (classe ou id CSS)
 * @param {*} bool booléen état de l'élément
 */
function checkIt(elem, bool)
{
	if(bool && $(elem).children('label').hasClass('inactive')){
		$(elem).get(0).click();
	}	
	else if(!bool && $(elem).children('label').hasClass('active')){
		$(elem).get(0).click();
	}
}

/**
 * Récupère les options depuis le stockage local et prérempli le formulaire
 */
function restaurerLesOptions()
{
	chrome.storage.local.get(['baseurl', 'notif', 'song', 'gamechange', 'songGame', 'youtubenotif', 'songyt', 'RSnotif', 'dateRS', 'RSnotified'], function(result){
		
		console.log(result);
		
		var elem;
		
		elem = $('#notifL');
		result.notif = setBool(result.notif, 1);
		checkIt(elem, (result.notif==1));
		
		elem = $('#songL');
		result.song = setBool(result.song, 1);
		checkIt(elem, (result.song==1));
		
		elem = $('#notifG');
		result.gamechange = setBool(result.gamechange, 0);
		checkIt(elem, (result.gamechange==1));
		
		elem = $('#songG');
		result.songGame = setBool(result.songGame, 0);
		checkIt(elem, (result.songGame==1));
		
		elem = $('#songV');
		result.youtubenotif = setBool(result.youtubenotif, 1);
		checkIt(elem, (result.youtubenotif==1));
		
		elem = $('#songV');
		result.songyt = setBool(result.songyt, 1);
		checkIt(elem, (result.songyt==1));
		
		result.RSnotif = setBool(result.RSnotif, 1);
		checkIt(elem, (result.songyt==1));
		
		result.dateRS = (result.dateRS != null ? result.dateRS : "");
		$('#resubRSC').val(result.dateRS);
		
		result.baseurl = setUrlRedirect(result.baseurl);
		
		alreadyNotifiedRS = result.RSnotified;

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
	var notifRS = ($('#notifRSC').is(':checked'))? 1: 0;
	var dateRS = $('#resubRSC').val();
	
	var dateSub = new Date(dateRS);
	var tmp = Math.floor(getdiffJour(dateSub)/30);
	var ecartMois = tmp > 0 ? tmp : -1;
	//Si on a modifié la date, on reset le système de "déja notifié"
	var RSnotified = changedDate ? true :alreadyNotifiedRS;
	
	/*Sauvegarde en local*/
	chrome.storage.local.set({
		'baseurl': baseurl, 
		'notif': notifL, 
		'song': songL, 
		'gamechange': notifG, 
		'songGame': songG, 
		'youtubenotif': notifV, 
		'songyt': songV,
		'RSnotif': notifRS,
		'dateRS': dateRS,
		'ecartMoisRS': ecartMois,
		'RSnotified' : RSnotified
		}, function(){});
}


/*	Programme principal
*************************************************/

/*Au chargement de la page, on restaure les options*/	
restaurerLesOptions();

$(document).on('change', '#resubRSC', function(){
	changedDate = true;
});

/*Lorsque l'on clique sur enregistrer*/		
$(document).on('click','#save-cfg',function(){  
   enregistrer();

   chrome.notifications.create(channel+'notifO', { 
	   type: "basic", 
	   title: titleOptions, 
	   message: messageOptions, 
	   iconUrl: OptionsIconUrl
	}, function(id) {});
});

/*Lorsque l'on clique sur quitter*/		
$(document).on('click', '#quit-tab',function(){
	window.top.close();
});

/*lorsque l'on coche une checkbox*/
$(document).on('click', '.trigger', function(e){
	e.preventDefault();
	clicCheckboxHandler($(this));
});