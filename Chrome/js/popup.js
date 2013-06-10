function closePopup()
{
	// if we are not in Windows
	if(navigator.platform.toLowerCase().indexOf("win") == -1)
		window.close();
}

function goToMessages()
{
	openInbox(true, true);
	closePopup();
	return false;
}

function checkNow()
{
	chrome.extension.sendMessage({action: "check_now"});
	window.close();
	return false;
}

function markAsRead()
{
	chrome.extension.sendMessage({action: "reset_new_flag"});
	window.close();
	return false;
}

function settings()
{
	openURL(chrome.extension.getURL("/content/options.html"), true);
	closePopup();
	return false;
}

function donate()
{
	openURL("http://postal2600.deviantart.com/", true);
	closePopup();
	return false;
}

function about()
{
	openURL("http://deviantanywhere.deviantart.com/", true);
	closePopup();
	return false;
}

document.addEventListener('DOMContentLoaded', function ()
{
    document.querySelector('#gotoBtn').addEventListener('click', goToMessages);
    document.querySelector('#checkBtn').addEventListener('click', checkNow);
    document.querySelector('#markReadBtn').addEventListener('click', markAsRead);

    document.querySelector('#settingsBtn').addEventListener('click', settings);

    document.querySelector('#donateBtn').addEventListener('click', donate);
    document.querySelector('#aboutBtn').addEventListener('click', about);
});