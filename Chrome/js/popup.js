function goToMessages()
{
	openInbox(true, true);
	window.close();	
	return false;
}

function checkNow()
{
	chrome.extension.sendRequest({action: "check_now"});
	window.close();	
	return false;
}

function settings()
{
	openURL(chrome.extension.getURL("/content/options.html"), true);
	window.close();	
	return false;
}
