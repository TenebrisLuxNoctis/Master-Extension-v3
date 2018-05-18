/************************************************
*	Page contenant des fonctions réutilisables  *
* 			dans les autres scripts				*
*	Dernière modification : mai 2018 			*
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