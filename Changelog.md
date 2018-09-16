# Notes de versions

Un grand merci à toutes les personnes qui m'aident à tester cette extension, qui me font remonter les bugs et qui me fournissent des idées pour avancer ! Vraiment, merci :)

## A venir 

*Pas de nouvelle version prévue*

## Version courante


### Version 2.7.3

* [Beta] Ajout d'une notification pour le resub (à paramétrer depuis la page d'options)

## Anciennes versions


### Version 2.7.2

* Modification de la notification de mise à jour des options

### Version 2.7.1

* Modifications graphiques légères de la page options

### Version 2.7.0

* Meilleure gestion des onglets au clic sur les notifications
* Ajout de liens de feedback pour l'équipe de testeurs dans la page d'options

### Version 2.6.9

* Correctif d'un bug d'affichage lors du clic successif sur le bouton ts et le bouton snap
* Correctif d'un bug d'affichage de l'uptime du jeu courant
* Design de la page d'options responsive (utilisation de grid CSS)

### Version 2.6.8

* Correctifs :
   * Correction d'un bug dans les options
   * Ajout d'un texte plutôt que d'un lien pour le TeamSpeak
   * Améliorations du design responsive de la page d'options (adaptabilité aux écrans de toute taille)

### Version 2.6.7

* Modifications du design des pages d'options et popup
* Remplacement de l'icône des clips par celle de twitch (pour faciliter la compréhension)
* Suppression du code QR (jugé inutile), remplacé par l'adresse du TeamSpeak

### Version 2.6.6

* Optimisation du chargement de la popup
* Correctif du rafraîchissement d'image dans la popup (lors du clic sur le code QR puis snapchat) 
* Ajout de différentes notifications sonores en fonction des notifications

### Version 2.6.5

* Suppression du debug dans la fonctionnalité de changement de jeu
* Correctif notification changement de jeu (le changement pouvait être détecté plusieurs fois de suite)
* Ajout de l'uptime du jeu courant dans la popup (disponible uniquement si l'extension était active lors du changement de jeu)
* Ajout d'images pour les différentes notifications :
    * Live                  - logo classique
    * Vidéo                 - masterOMG
    * Changement de jeu     - masterGOTY
    * Changement options    - masterKC
* Ajout d'une page de configuration de l'extension
* Ajout du snapcode lors du clic sur le bouton correspondant dans la popup

### Version 2.6.4

* Correctif notification des vidéos youtube

### Version 2.6.3

* Correction de l'apparition possible de notifications parasites anciennes lorsqu'une nouvelle notification apparaît
* Modification complète de la fonctionnalité de désactivation des notifications de changement de jeu lorsque la page twitch du live est active
* Ajout du lien de la vidéo au clic sur la notification d'une vidéo youtube
* Centralisation des variables globales communes dans le fichier `fonctions.js`

### Version 2.6.2

* Mise en place d'un système pour bloquer les notification de jeu lorsque la page du live est active

### Version 2.6.1
 
* Correction d'un bug dans la requête aux services web de Twitch
* Désactivation de l'événement '+25 xP' à la suite de plusieurs soucis d'affichage

### Version 2.6.0 

* Ajout du nombre de viewers courant dans la popup
* Ajout du titre du live dans la popup
* Ajout d'un lien vers les clips de la chaîne depuis la popup
* Modification de style (CSS)
    * Diminution de la taille des boutons dans la popup
    * Diminution de la taille des éléments liés au Master Game (avatar, pseudo et niveau)
    * Réaffichage de l'événement '+25 xP' en début de live
* Supression de bibliothèques inutilisées
    
### Version 2.5.0

Deuxième version stable
* Fonctionnalité principale :  Gestion des vidéos youtube

### Version 2.4.0

Première version stable
* Fonctionnalité principale : Gestion du jeu dans l'extension
* Fonctionnalité secondaire : Modifications graphiques et structurelles de l'interface utilisateur

### Version 2.3.0

[Version actuelle](https://chrome.google.com/webstore/detail/master-snakou/lcjhokogmfjbhdfnhpgpamfpjjgckejn?hl=fr) publiée de la Master Extension 
