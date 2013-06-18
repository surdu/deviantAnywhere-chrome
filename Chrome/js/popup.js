function closePopup()
{
	// if we are not in Windows
	if(navigator.platform.toLowerCase().indexOf("win") == -1)
		window.close();
}

function goToMessages()
{
    chrome.extension.sendMessage({action: 'get_interesting_inbox'}, function(response) {

        // 0 = inbox; -1 = no new messages, so we go as well to inbox
        if (response.interestingInbox == 0 || response.interestingInbox == -1)
            openInbox(true, true);
        else
            openInbox(true, true, response.interestingInbox);

        closePopup();
        return false;
    });
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
	openURL("https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=Z2JMSB3YPXYB6&lc=RO&item_name=deviantAnywhere&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donate_SM%2egif%3aNonHosted", true);
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