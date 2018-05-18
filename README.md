# Proposition d'amélioration de la Master Extension

Documentation de ma proposition d'amélioration de la Master Extension (Version chrome uniquement, pour le moment). Une version demo est disponible sur le [chrome webstore](https://chrome.google.com/webstore/detail/master-sans-cou/caklmgbmfcingplfkkdadejihhjocjpi/related?hl=fr)

Le code source est disponible ici, dans ce repository. (note : ce code n'est pas réalisé en intégration continue, via Git)

__Note :__ *Ceci est un petit projet sans prétention aucune. Il a été initié en juillet 2017 pour le fun avant tout ! C'est à coup de petites retouches ponctuelles quand j'en ai l'envie que je le mets à jour, et il s'écoule parfois un long moment avant que je n'y retouche* :)

## Présentation

### Nouvelles fonctionnalités

Ma proposition regroupe plusieurs nouvelles fonctionalités :
  * affichage du jeu actuel dans la notification du navigateur et dans la popup 
  * changement de l'icône dans la barre du navigateur quand le stream est lancé 
  * meilleure **gestion des onglets** (si il n'est pas occupé on l'utilise au lieu d'en ouvrir un nouveau) pour les liens de la popup
  * ajout d'une liste de liens vers les réseaux sociaux dans la popup 
  * ajout d'une notification lors d'un **changement de jeu** *(paramétrable)*
    * La notification est désactivée lorsque la page twitch est active *(**en cours de développement**)*
  * ajout d'une notification lorsqu'une nouvelle **vidéo** youtube sort *(paramétrable)*
    * Le clic sur la notification ouvre directement la page de la vidéo
  * ajout d'une page **"options"** qui permet de :
    * désactiver les notifications 
    * désactiver le son des notifications 
    * modifier le site vers lequel redirige le lien de la chaîne twitch
  * ajout d'un QRcode pour rejoindre la page twitch directement depuis la popup
  * ajout de l'**uptime** du live, du **titre** ainsi que le **nombre de viewers** dans la popup
  * utilisation du stockage local afin d'avoir des options différentes sur des périphériques différents
  * suppression de l'appel à l'API twitch dans la popup
  * optimisation de taille (suppression de librairies inutilisées)
  * possibilité de cacher la clé twitch dans l'extension (cf la partie Documentation, 3.2) 

### Images tirées de l'extension

![Icon Live Off](https://github.com/TenebrisLuxNoctis/Master-Extension-v3/blob/master/images/bariconoff.PNG)
![Icon Live On](https://github.com/TenebrisLuxNoctis/Master-Extension-v3/blob/master/images/bariconon.PNG)

![Icon Live On](https://github.com/TenebrisLuxNoctis/Master-Extension-v3/blob/master/images/notif.PNG)

![Icon Live On](https://github.com/TenebrisLuxNoctis/Master-Extension-v3/blob/master/images/showcase%20snakou.png)

![Icon Live On](https://github.com/TenebrisLuxNoctis/Master-Extension-v3/blob/master/images/options.png)

## Documentation

Ma solution contient deux versions :
  * l'une appelant directement les API twitch et youtube
  * l'autre utilisant des scripts PHP intermédiaires

La première est construite de la même façon que l'extension actuelle. La seconde utilise des scripts externes afin de camoufler les clés API, et ainsi éviter toute utilisation par une autre personne (elle sont affichées en clair dans les sources de l'extension actuelle)

Les deux versions utilisent la clé API twitch de l'extension actuelle.

Une clé API youtube a été crée spécialement pour l'occasion mais peut être modifiée aisément dans les deux versions.


L'ensemble du code js modifié (background.js, popup.js, options.js) est commenté afin de faciliter la lecture ainsi que la compréhension. Les autres scripts (html,css) ont subies de légères modifications.

NOTE : L'évènement de la master extension pour le master game ne s'affiche plus, il faudrait voir à changer la classe pour l'afficher correctement

### Intégration version PHP

  * upload les fichiers `php/twitch.php` et `php/youtube.php`
  * reporter l'url du répertoire dans `js/background.js` à la 12e ligne : `domainurl = "PUT_YOUR_DOMAIN_NAME_HERE";`
  * Publier l'extension mise à jour

### Intégration version sans PHP

Cette version ne nécessite aucune manipulation autre que de publier la mise à jour de l'extension



La modification des clé d'API se fait depuis le fichier `js/background.js`  aux lignes 16 et 17 :
```
API_key_twitch = "1low3gl5nz7ep5o6•••••••••••••••••";
API_key_youtube = "AIzaSyAANw33DQWRi5O•••••••••••••••••";
```

## Améliorations possibles

La perfection n'existe pas, et on a toujours plein d'idées pour s'en approcher.

  * Réparer l'event de lancement du live (+25xp) (il faudrait chercher la nouvelle classe css à cibler (peut être `chat-resub-notification` ?)
  * Modifier le son en fonction de la notification (vidéo/live/changement de jeu)
  * Modifier l'image des notifications
  * Ajouter l'uptime sur le jeu courant
  * ...

## Support

N'hésitez pas à me contacter pour toute question
