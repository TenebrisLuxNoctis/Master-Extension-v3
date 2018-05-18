chrome.storage.local.get(['gamechange'], function(result){		
		result.gamechange = setBool(result.gamechange, 0);		

		browser.runtime.sendMessage({"url": e.target.href});
		
		if(result.gamechange == 1){
			window.addEventListener('focus', function(){
				browser.runtime.sendMessage({"gamechangeeffective": false});
			});
			window.addEventListener('blur', function(){
				chrome.runtime.sendMessage({"gamechangeeffective": true});
			});
		}
		
	});