var favicon_link_html = document.createElement('link');
favicon_link_html.href = 'https://mastersnakou.fr/theme/frontend/img/favicon.png';
favicon_link_html.rel = 'shortcut icon';

try { 
  document.getElementsByTagName('head')[0].appendChild( favicon_link_html ); 
}
catch(e) { }

$(function() {
	setTimeout(function() {
		var domain = "https://ws.game.mastersnakou.fr";

		$.ajaxSetup({
			cache: false
		});

		var display_event = function (after_div, username) {
			var event_notif = '<div class="sticky-message sticky-message--small sticky-message--animated ontop open" id="event"><div class="flex flex--verticalCenter"><div class="header header--small flex__item resub-amt">Affichez votre présence (+25xp) !</div><button type="button" class="button button-primary flex__item" id="send_event">Afficher</button></div></div>';
			if ($('#event').length) {
				$('#event').fadeIn(1000);
			} else {
				after_div.append(event_notif);
				$('#send_event').click(function () {
					$.getJSON('https://game.mastersnakou.fr/event-xp/' + username, function (data) {
						if (data['message'] === 'ERROR') {
							alert("Soit t'as déjà joué, soit tu es arrivé trop tard poto ! ;)");
						}
					});
					$('#event').fadeOut(2000);
				})
			}
		};

		var get_username = function (callback) {
			chrome.storage.local.get('username', function (items) {
				callback(items['username']);
			});
		};

		var launch_event = ()=>{
			get_username((username)=>{
				if(username==null || username=="") {
					return false;
				}
				//Ne s'affiche plus
				display_event($('.chat-room'), username);
			})
		};

		var socket = io.connect(domain);
		socket.on('connect', function () {
			//console.log('Connected !');
		});

		socket.on('event-launch', function() {
			//console.log('New event !');
			launch_event();
		});
	}, 5000);	
});
