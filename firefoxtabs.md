#Gestion des onglets pour firefox

Fichier impacté : `fonctions.js`

```
function manageTabs(elem, url=false)
{
	var redirectURL = url ? elem : $(elem).attr("href");
	
	var querying = browser.tabs.query({currentWindow: true, active: true});
	querying.then(function(tabs){
		if(tabs[0].url == "about:newtab")
		  {
				var updating = browser.tabs.update({url: redirectURL});
				updating.then(onUpdated, onError);
		  }else{
				var creating = browser.tabs.create({
				url:redirectURL
			  });
			  creating.then(onUpdated, onError);
		  }
		  window.close();
	}, onError);

}
```
