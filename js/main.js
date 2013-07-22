var difiURL = "http://browse.deviantart.com/global/difi/";
var loginURL    = "https://www.deviantart.com/users/login";

var NOCACHE_HEADERS = {"Pragma": "no-cache", "Cache-Control": "no-cache"};

var statusList = {};

var badgeHint;

// the 'timer' used for auto-update
var recheckTimeout;

// used in generateStatus to determine when all the groups finished rendering
var groupsCount;

var hasNewThisRound;

var settings = new Store("settings", defaults);

// what inbox to open when clicking "Go to messages". 0 = main inbox; -1 = no new messages / not determined
var interestingInbox = -1;

// the folders are stored locally for speed optimisation
var foldersCache = [];

// whether or not login was attempted
var loginAttempted = false;

// indicates if the user is logged in or not. Assumed as true if not proven otherwise.
// used to render the popup menu
var loggedIn = true;

function init()
{
	log("Starting...");
    retrieveMessages();
    chrome.extension.onMessage.addListener(handleRequests);
    chrome.runtime.onInstalled.addListener(function(details){
       if(details.reason == "install")
           openURL("http://deviantanywhere.deviantart.com/", true, true);
    });
}

function retrieveMessages(forceFolders)
{
    /***
     *
     *  Start the message retrieving process.
     *
     * Arguments:
     * forceFolders -- Force the re-retrieval of the folders list
     */


    // resetting the interestingInbox to it's default value
    interestingInbox = -1;
    loggedIn = true;
	badgeHint = "";

	log("Retrieve messages: start");

    groupsCount = 0;
    hasNewThisRound = false;

    if (foldersCache.length == 0 || forceFolders)
    {
        settings.set("groups", {});

        // get folders for this user
        var getFoldersReq = new HTTPRequest(difiURL+'?c[]="MessageCenter","get_folders",[]&t=json', "GET", NOCACHE_HEADERS);
        getFoldersReq.onSuccess = parseFolders;
        getFoldersReq.onError = autoupdate;
        getFoldersReq.dataType = "json";
        getFoldersReq.send();
    }
    else
    {
        log("Using cached folders");

        // if we have the folders cached, just use the cache to extract messages
        for (var f=0; f < foldersCache.length; f++)
        {
            var folder = foldersCache[f];
			new MessEx(folder.folderid, folder.title, folder.is_inbox, generateStatus, handleNotLoggedIn);
        }

        autoupdate();
    }
}

function addFolder(folder)
{
    // extract messages from folder
    new MessEx(folder.folderid, folder.title, folder.is_inbox, generateStatus, handleNotLoggedIn);
    foldersCache.push(folder);
}

function parseFolders(response)
{
	if (response.DiFi.status == "SUCCESS")
	{
		var folders = response.DiFi.response.calls[0].response.content;

		foldersCache = [];

        log("Parsing "+ folders.length +" folders");

		// get the inbox folder id
		for (var f=0; f<folders.length;f++)
		{
            var folder = folders[f];

            if (folder.is_inbox)
            {
                addFolder(folder);
            }
            else
            {
                // check to see if folder is a group or not
                // setting the folder as the context of the callback so as to know for which folder we made the check
                chrome.cookies.get({url: "http://www.deviantart.com/", name: "userinfo"}, $.proxy(function(cookie){

                        var folder = this;

                        // for some reason, the cookie is not here sometimes. In that case, just add the folder.
                        if (typeof cookie != 'undefined')
                        {
                            log("Cookies where ok");
                            var checkFolderReq = new HTTPRequest(difiURL, "POST", {"Content-type": "application/x-www-form-urlencoded"});

                            checkFolderReq.onSuccess = function(checkResponse){
                                var isGroup = checkResponse.DiFi.response.calls[0].response.status == "SUCCESS";

                                if (isGroup)
                                {
                                    log("Folder "+ folder.title +" is a group");
                                    var groups = settings.get("groups", {})

                                    addFolder(folder);

                                    groups["i"+folder.folderid] = folder.title;

                                    settings.set("groups", groups);
                                }
                                else
                                    log("Folder "+ folder.title +" is NOT a group");
                            };

                            checkFolderReq.dataType = "json";

                            checkFolderReq.send({
                                ui: cookie.value,
                                "c[]":'"GrusersSubmitToGroupsModule","check_permissions",["'+folder.title+'","'+folder.folderid+'",true]',
                                "t": "json"
                            });
                        }
                        else
                        {
                            log("PROBLEM: Cookies where missing.");
                            addFolder(folder);
                        }
                }, folder));
            }
		}
		
		autoupdate();
	}
	else
        handleNotLoggedIn();
}

function handleNotLoggedIn()
{
    log("PROBLEM: Not logged in ?");
    if (settings.get("useAutoLogin"))
    {
        if (!loginAttempted)
            login();
        else
            updateBadge("Oops", true, "The auto-login has failed.\nPlease check the supplied username and password.");
    }
    else
    {
        updateBadge("Oops", true, "You are not logged in deviantArt.\nPlease use the auto-login option in deviantAnywhere \nor login on deviantArt.");
        loggedIn = false;
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
    log("Logging in ...");
    loginAttempted = true;
	var loginReq = new HTTPRequest(loginURL, "POST", {"Content-Type": "application/x-www-form-urlencoded"});
	loginReq.onSuccess = loginEnded;
	loginReq.send({"username": settings.get("username"), "password": settings.get("password")});
}

function loginEnded()
{
    log("Retry retreiving messages");
    retrieveMessages();
}

///////////////////////// UI /////////////////////////

function generateStatus(result)
{
    var hasNew = false;
	groupsCount ++;
	
	var messages = settings.get("lastMessages_"+result.id, {});
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

	settings.set("lastMessages_"+result.id, newMessages);
	updateStatus("i"+result.id);
	
	if (groupsCount == foldersCache.length)
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
     * focus    -- Should the new tab be focused upon open (default 'True')
     */

	if (newtab)
	{
		if (typeof focus == 'undefined' && focus !== false)
			focus = true;

        if (settings.get("preventMultiInbox", true))
        {
            chrome.windows.getAll({populate: true}, function(windows){

                // search for the first tab that has the URL already opened
                for (var f=0; f<windows.length; f++)
                    for (var g=0; g<windows[f].tabs.length; g++)
                        if (windows[f].tabs[g].url == url)
                        {
                            chrome.tabs.update(windows[f].tabs[g].id, {selected: true});
                            return;
                        }

                // if none, just open a new tab
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
        // cancel the auto-update timer
		if (recheckTimeout)
			clearTimeout(recheckTimeout);

        // allow reattempt to login, if necessary
        loginAttempted = false;

        // retrieve messages, forcing the retrieving of the folders list
		retrieveMessages(true);
		sendResponse({});
	}
	else
	if (request.action == "open_url")
	{
		openURL(request.url, request.newtab, request.focus);
		sendResponse({});
	}
    else
    if (request.action == "open_login")
    {
		openURL(loginURL, request.newtab, request.focus);
		sendResponse({});
    }
    else
    if (request.action == "get_interesting_inbox")
    {
        sendResponse({"interestingInbox": interestingInbox});
    }
    else
    if (request.action == "get_login_status")
    {
        // used to render the popup menu (for now)
        sendResponse({"loggedIn": loggedIn});
    }

}

init();



