var username = $("#username").html();
if(username!=[]){
	chrome.runtime.sendMessage({username: username}, function(response) {
	  //console.log("OK!");
	})
}
else{
	chrome.runtime.sendMessage({username: null}, function(response) {
	  //console.log("OK!");
	})
}