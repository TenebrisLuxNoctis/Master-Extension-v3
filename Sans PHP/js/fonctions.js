/************************************************
*	Page contenant des fonctions réutilisables  *
* 			dans les autres scripts				*
*	Dernière modification : Septembre 2018 			*
************************************************/

/**
 * Vérifie le variable 'value' et l'initialise à 'defaultValue' si non valide
 * @param {boolean} value variable inconnue
 * @param {boolean} defaultValue valeur par défaut du booléen
 */
function setBool(value, defaultVal)
{
	var bool = [0, 1];
	var res = value;
	
	if (bool.indexOf(value) == -1){
		res = defaultVal;
	}
	return res;
}

/**
 * Vérifie que la variable 'url' est bien définie dans la liste de la configuration et retourne twitch par défaut
 * @param {string} url Lien vers la page pour regarder le stream 
 */
function setUrlRedirect(url){
	var res = url;

	if (urls.indexOf(res) == -1){
		res = "https://www.twitch.tv/";
	}

	return res;
}

/**
* Renvoie la différence en jour entre une date et aujourd'hui
* @param {Date} dateSub Date de resub
*/
function getdiffJour(dateSub){
	var today = new Date(Date.now());
	var diff=today.getTime() - dateSub.getTime();
	
	return Math.floor(diff/8640000);
}

/**
 * Vérifie si l'onglet courant est utilisé ou non puis l'utilise ou en crée un nouveau selon le résultat
 * @param {string} elem élément jquery (classe ou id CSS)
 * @param {boolean} url si true elem est une url de type string
 */
function manageTabs(elem, url=false)
{
	/*On récupère les infos sur l'onglet courant*/
	chrome.tabs.getSelected(null, function(onglet){
		var redirectURL = url ? elem : $(elem).attr("href");
		console.log(redirectURL);
		//Si c'est un nouvel onglet
		if(onglet.url == "chrome://newtab/")
		{
			//On l'utilise
			chrome.tabs.update(onglet.id,{url:redirectURL});
		}
		else{
			//Sinon, on en crée un nouveau
			chrome.tabs.create({url:redirectURL});
		}
		//on ferme la popup
		window.close();
	});
}