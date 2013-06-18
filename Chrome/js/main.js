//
// Copyright (c) 2011 Nicolae Surdu
//

var difiURL = "http://www.deviantart.com/global/difi.php";
var loginURL    = "https://www.deviantart.com/users/login";

var NOCACHE_HEADERS = {"Pragma": "no-cache", "Cache-Control": "no-cache"};

var statusList = {};

var badgeHint;
var recheckTimeout;

var groupsCount;
var totalGroupsCount;

var hasNewThisRound;

var settings = new Store("settings", defaults);

// what inbox to open when clicking "Go to messages". 0 = main inbox; -1 = no new messages / not determined
var interestingInbox = -1;

function init()
{
	log("Starting...");
    retrieveMessages();
    chrome.extension.onMessage.addListener(handleRequests);
}

function retrieveMessages()
{
    // reseting the interestingInbox to it's default value
    interestingInbox = -1;

	badgeHint = "";
	log("Retrieve messages: start");
	
	var getFoldersReq = new HTTPRequest(difiURL+'?c[]="MessageCenter","get_folders",[]&t=json', "GET", NOCACHE_HEADERS);
	getFoldersReq.onSuccess = parseFolders;
	getFoldersReq.onError = autoupdate;
	getFoldersReq.dataType = "json";
	getFoldersReq.send();
}

function parseFolders(response)
{
	if (response.DiFi.status == "SUCCESS")
	{
		log("Parsing folders");
		var folders = response.DiFi.response.calls[0].response.content;

		groupsCount = 0;
		totalGroupsCount = 0;
		hasNewThisRound = false;

		var groups = {};
		
		// get the inbox folder id
		for (var f=0; f<folders.length;f++)
		{
			new MessEx(folders[f].folderid, folders[f].title, folders[f].is_inbox, generateStatus);
			if (folders[f].title)
				groups["i"+folders[f].folderid] = folders[f].title;
			totalGroupsCount ++
		}
		
		settings.set("groups", groups);
			
		autoupdate();
	}
	else
		if (settings.get("useAutoLogin"))
			login();
		else
		{
			updateBadge("Oops", true, "You are not logged in deviantArt.\nPlease use the auto-login option in deviantAnywhere \nor login on deviantArt.");
			//TODO: when you click badge, go to login
		}
			
}

function autoupdate()
{
	if (settings.get("autoupdate"))
	{
		var checkTime = parseFloat(settings.get("checkTime"));
		recheckTimeout = setTimeout(retrieveMessages, checkTime*60000);
		log("New auto-update in "+checkTime+" minutes");
	}
}

function login()
{
	var loginReq = new HTTPRequest(loginURL, "POST", {"Content-Type": "application/x-www-form-urlencoded"});
	// this looks very counter-intuitive, but it's the only way i can think
	// now how to determine a successful login:
	// - In case of successful login, we get a redirect from https to http which triggers 
	//   a cross-domain status 0 error. (success)
	// - In case of a bad login, the login page is returned with status code 200 (error)
	loginReq.onSuccess = parseLoginError;
	loginReq.onError = parseLoginSuccess;
	
	loginReq.send({"username": settings.get("username"), "password": settings.get("password")});
}

function parseLoginSuccess(statusCode)
{
	if (statusCode == 0)
		retrieveMessages();
}

function parseLoginError()
{
	//TODO: check this
	updateBadge("Oops", true, "The auto-login has failed.\nPlease check the supplied username and password.");
}

///////////////////////// UI /////////////////////////

function generateStatus(result)
{
    var hasNew = false;
	groupsCount ++;
	
	var lastMessages = settings.get("lastMessages_"+result.id, "[]");
	
	var messages = JSON.parse(lastMessages);
	var newMessages = result.newMessages;
	var hintMessages = "";

	var folderName = result.folderName;
	if (result.isInbox)
		folderName = settings.get("username") || "Main account";
	
	if (!statusList["i"+result.id])
		statusList["i"+result.id] = {
			id: 			result.id, 
			folderName: 	folderName, 
			isInbox: 		result.isInbox, 
			messages:		{}
		};
	
	statusList["i"+result.id].hasMessages = false;

    for (var item in newMessages)
    {
    	if (!statusList["i"+result.id].messages[item])
    		statusList["i"+result.id].messages[item] = {
    			newCount: 0, 
    			desc: messagesInfo[item].desc.split("::")
    		};
    	
		var oldValue = parseInt(messages[item]) || 0; 
		var currentValue = parseInt(newMessages[item]);

        if (currentValue > oldValue && (settings.get("followGroup_i"+result.id, true) || result.isInbox))
        {
            // determine what inbox is displayed when 'Go to messages' is pressed
            // main inbox has priority above all others
            if (result.isInbox)
                interestingInbox = 0;
            else
                // if we don't have a contender, set the current inbox as one
                if (interestingInbox == -1)
                    interestingInbox = result.id;

        	if (!hasNew)
        		hasNew = settings.get(messagesInfo[item].pref);
        	
        	if (statusList["i"+result.id].messages[item].newCount)
        		statusList["i"+result.id].messages[item].newCount += currentValue - oldValue;
        	else
        		statusList["i"+result.id].messages[item].newCount = currentValue - oldValue;

        	if (settings.get(messagesInfo[item].pref))
            	hintMessages += statusList["i"+result.id].messages[item].newCount + item + " ";
        }
        
        if (currentValue < oldValue)
        	statusList["i"+result.id].messages[item].newCount = 0;
        
        if (newMessages[item] != 0 && settings.get(messagesInfo[item].pref))
        	statusList["i"+result.id].hasMessages = true;
        
        statusList["i"+result.id].messages[item].count = newMessages[item];
        statusList["i"+result.id].messages[item].shouldRender = settings.get(messagesInfo[item].pref);
		
    }
	
    if (hasNew)
    {
    	hasNewThisRound = true;

		if (result.isInbox)
			badgeHint += "New for "+folderName + "\n" + hintMessages + "\n";
		else
			badgeHint += "New for "+folderName + "\n" + hintMessages + "\n";
		updateBadge("New", false, badgeHint);
    }

	settings.set("lastMessages_"+result.id, JSON.stringify(newMessages));	
	updateStatus("i"+result.id);
	
	if (groupsCount == totalGroupsCount)
	{
		var globalHasNew = false;
		for (var iid in statusList)
		{
			if (!globalHasNew)
				for (var name in statusList[iid].messages)
				{
					if (statusList[iid].messages[name].newCount)
					{
						globalHasNew = true;
						break;
					}
				}
			else
				break;
		}
		
		if (!globalHasNew)
			updateBadge("", false, "deviantAnywhere");
		
		if (hasNewThisRound)
		{
	        if (settings.get("playSound"))
	            playSound(getExtensionPath(settings.get("sound")));
	        
	        if (settings.get("openInbox"))
	        {
	            openInbox(true,settings.get("focusInbox"));
	            resetNewFlag();
	        }
        }

	}
	
	log("Retrieve messages: end");
}

function sendMessage(request)
{
	chrome.windows.getAll({populate: true}, function(windows){
		for (var f=0; f<windows.length; f++)
			for (var g=0; g<windows[f].tabs.length; g++)
				chrome.tabs.sendMessage(windows[f].tabs[g].id, request);
	});
	
}

function updateBadge(text, error, details)
{
	if (error)
		chrome.browserAction.setBadgeBackgroundColor({color: [207, 0, 22, 255]});
	else
		chrome.browserAction.setBadgeBackgroundColor({color: [22, 207, 0, 255]});
		
	chrome.browserAction.setBadgeText({"text": text});
	
	if (details)
		chrome.browserAction.setTitle({title: details});
	else
		chrome.browserAction.setTitle({title: ""});
}

function updateStatus(iid)
{
	sendMessage({action: "set_status", status: statusList[iid]});
}

function openURL(url, newtab, focus)
{
    /***
     * Open an URL
     *
     * Arguments:
     * url      -- The URL to be opened
     * newtab   -- Should the URL be opened in a new tab (default 'False')
     * focus    -- Should the new tab be focused uppon open (default 'True')
     */

	if (newtab)
	{
		if (typeof focus == 'undefined' && focus !== false)
			focus = true;

        if (settings.get("preventMultiInbox", true))
        {
            chrome.windows.getAll({populate: true}, function(windows){
                for (var f=0; f<windows.length; f++)
                    for (var g=0; g<windows[f].tabs.length; g++)
                        if (windows[f].tabs[g].url == url)
                        {
                            chrome.tabs.update(windows[f].tabs[g].id, {selected: true});
                            return;
                        }
                chrome.tabs.create({url: url, selected: focus});
            });
        }
        else
            chrome.tabs.create({url: url, selected: focus});
	}
	else
		chrome.tabs.getSelected(null, function(tab){
			chrome.tabs.update(tab.id, {url: url})
		});
}

function resetNewFlag()
{
	log("Resetting new flag");
	
	for (var iid in statusList)
	{
		for (var name in statusList[iid].messages)
			statusList[iid].messages[name].newCount = 0;
		
		updateStatus(iid);
	}
	
	updateBadge("", false, "deviantAnywhere");
}

function handleRequests(request, sender, sendResponse)
{
	if (request.action == "get_status")
	{
		for (var iid in statusList)
		{
			statusList[iid].hasMessages = false;
			for (var name in statusList[iid].messages)
			{
				var shouldRender = settings.get(messagesInfo[name].pref);
				statusList[iid].messages[name].shouldRender = shouldRender;
				if (statusList[iid].messages[name].count != 0 &&  shouldRender)
					statusList[iid].hasMessages = true;
			}
		}
		
		sendResponse({statusList: statusList});
	}
	else
	if (request.action == "get_settings")
	{
		sendResponse(settings.toObject());
	}
	else
	if (request.action == "reset_new_flag")
	{
		resetNewFlag();
		sendResponse({});
	}
	else
	if (request.action == "check_now")
	{
		if (recheckTimeout)
			clearTimeout(recheckTimeout);
		retrieveMessages();
		sendResponse({});
	}
	else
	if (request.action == "open_url")
	{
		openURL(request.url, request.newtab, request.focus);
		sendResponse({});
	}
    else
    if (request.action == "get_interesting_inbox")
    {
        sendResponse({"interestingInbox": interestingInbox});
    }

}

init();



