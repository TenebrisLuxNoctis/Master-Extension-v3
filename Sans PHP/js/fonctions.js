/************************************************
*	Page contenant des fonctions réutilisables  *
* 			dans les autres scripts				*
*	Dernière modification : Mai 2018 			*
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