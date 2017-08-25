/************************************************
*	Page contenant des fonctions réutilisables  *
* 			dans les autres scripts				*
*	Dernière modification : août 2017 			*
************************************************/

/*
*	setBool(value, defaultValue)
*	Paramètres : value = variable inconnue / defaultValue = valeur par défaut du booléen
*	Vérifie le variable value et l'initialise à defaultValue si non valide
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