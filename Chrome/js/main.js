var messagesURL = "http://www.deviantart.com/global/difi.php";
var inboxURL 	= "http://my.deviantart.com/messages/";
var loginURL    = "https://www.deviantart.com/users/login";
var donateURL   = "https://www.paypal.com/cgi-bin/webscr"

var inboxId = null;

var messagesInfo  = {"N":{"desc":"Notice::Notices", "pref":"followNotices"},
				 	 "A":{"desc":"Activity Message::Activity Messages", "pref":"followActivity"},
				 	 "R":{"desc":"Reply::Replies", "pref":"followReplies"},
				 	 "UN":{"desc":"Unread Note::Unread Notes", "pref":"followNotes"},
				 	 "J":{"desc":"Journal::Journals", "pref":"followJournals"},
				 	 "C":{"desc":"Comment::Comments", "pref":"followComments"},
				 	 "D":{"desc":"Deviation::Deviations", "pref":"followDeviations"},
				 	 "P":{"desc":"Poll::Polls", "pref":"followPolls"},
				 	 "CA":{"desc":"Contest Announcement::Contest Announcements", "pref":"followContest"},
				 	 "NW":{"desc":"News Article::News Articles", "pref":"followNews"},
				 	 "AM":{"desc":"Admin Message::Admin Messages", "pref":"followAdmin"},
				 	 "WC":{"desc":"Watched Critique::Watched Critiques", "pref":"followCritiques"},
					 "CO":{"desc":"Correspondence Item::Correspondence Items", "pref":"followCritiques"}
					};

var messages  = new Array();
var newMessages = new Array();

var statusText = "";

function init()
{
	log("Starting...");
    var lastMessages = getPref("lastMessages");
    messages = JSON2array(lastMessages);

    if (getPref("customLook"))
    {
    	//TODO: make it actually work
        backgroundColor = getPref("bkgcolor");
        color = getPref("textcolor");
    }

    retrieveMessages();
    
    chrome.extension.onRequest.addListener(handleGetStatusRequest);
    chrome.browserAction.onClicked.addListener(function(){
    	openMessages(true, true);
    });
}

function retrieveMessages()
{
	log("Retrieve messages: start");
	//ro_cvds_daInstance.setIcon("loading");
	
	var getFoldersReq = new HTTPRequest(messagesURL+"?c[]=MessageCenter;get_folders&t=json");
	getFoldersReq.onSuccess = parseFolders;
	getFoldersReq.dataType = "json";
	getFoldersReq.send();
}

function parseFolders(response)
{
	//ro_cvds_daInstance.setIcon("normal");
	if (response.DiFi.status == "SUCCESS")
	{
		log("Parsing folders");
		var folders = response.DiFi.response.calls[0].response.content;
		
		// get the inbox folder id
		for (f=0; f<folders.length;f++)
			if (folders[f].is_inbox)
			{
				inboxId = folders[f].folderid;
				continue;							 		
			}
	
		if (inboxId)
			getMsgContent();
	}
	else
		ro_cvds_daInstance.login();
}

function getMsgContent()
{
	maxItems = 20;
	queryStr = "?"+
	"c[]=MessageCenter;get_views;"+this.inboxId+",oq:fb_comments:0:"+maxItems+":f&"+
	"c[]=MessageCenter;get_views;"+this.inboxId+",oq:fb_replies:0:"+maxItems+":f&"+
	"c[]=MessageCenter;get_views;"+this.inboxId+",oq:notes_unread:0:"+maxItems+":f&"+
	"c[]=MessageCenter;get_views;"+this.inboxId+",oq:notices:0:"+maxItems+":f&"+
	"c[]=MessageCenter;get_views;"+this.inboxId+",oq:contests:0:"+maxItems+":f&"+
	"c[]=MessageCenter;get_views;"+this.inboxId+",oq:fb_activity:0:"+maxItems+":f&"+
	"c[]=MessageCenter;get_views;"+this.inboxId+",oq:correspondence:0:"+maxItems+":f&"+
	"c[]=MessageCenter;get_views;"+this.inboxId+",oq:devwatch:0:"+maxItems+":f:tg=deviations&"+
	"c[]=MessageCenter;get_views;"+this.inboxId+",oq:devwatch:0:"+maxItems+":f:tg=news&"+
	"c[]=MessageCenter;get_views;"+this.inboxId+",oq:devwatch:0:"+maxItems+":f:tg=journals&"+
	"c[]=MessageCenter;get_views;"+this.inboxId+",oq:devwatch:0:"+maxItems+":f:tg=polls";
	
	log("Requesting messages DiFi");
	var getContentReq = new HTTPRequest(messagesURL+queryStr+"&t=json");
	getContentReq.onSuccess = parseMessages;
	getContentReq.dataType = "json";
	getContentReq.send();		
}

function parseMessages(response)
{
	log("Requesting messages DiFi: success");
	newMessages["C"] = parseInt(response.DiFi.response.calls[0].response.content[0].result.matches);
	newMessages["R"] = parseInt(response.DiFi.response.calls[1].response.content[0].result.matches);
	newMessages["UN"]= parseInt(response.DiFi.response.calls[2].response.content[0].result.matches);
	newMessages["N"] = parseInt(response.DiFi.response.calls[3].response.content[0].result.matches);
	newMessages["CA"]= parseInt(response.DiFi.response.calls[4].response.content[0].result.matches);
	newMessages["A"] = parseInt(response.DiFi.response.calls[5].response.content[0].result.matches);
	newMessages["CO"]= parseInt(response.DiFi.response.calls[6].response.content[0].result.matches);
	newMessages["D"] = parseInt(response.DiFi.response.calls[7].response.content[0].result.matches);
	newMessages["NW"]= parseInt(response.DiFi.response.calls[8].response.content[0].result.matches);
	newMessages["J"] = parseInt(response.DiFi.response.calls[9].response.content[0].result.matches);
	newMessages["P"] = parseInt(response.DiFi.response.calls[10].response.content[0].result.matches);
	generateStatus();
}


///////////////////////// UI /////////////////////////

function generateStatus()
{
    hasNew = false;
    statusBarText = "";
	
	statusText = "";
	
    for (var item in newMessages)
    {
		if (getPref(messagesInfo[item].pref))
		{
            var thisIsNew = false;
			var oldValue = messages[item]; 
			var currentValue = newMessages[item];
			var newSuffix = "";
			 
            if ((oldValue==undefined && currentValue!=0) || (oldValue == 0 && oldValue < currentValue) || (oldValue && oldValue < currentValue))
            {
                hasNew = true;
                thisIsNew = true;
            }
            messages[item] = newMessages[item];
			
            if (messages[item]!=0)
            {
				//create statusItem node
				
				var statusItem = $("<span></span>").addClass("statusItem");
				
				if (thisIsNew)
				{
					statusItem.addClass("new");
					if (oldValue != undefined)
						newSuffix = (currentValue - oldValue) + " New";
					else  
						newSuffix = currentValue + " New";
				}
				
				// build the hint
				var tooltipOpts = messagesInfo[item].desc.split("::");
				var tooltip = messages[item]+" "+tooltipOpts[0]+", "+newSuffix;
				if (messages[item]>1)
					tooltip = messages[item]+" "+tooltipOpts[1]+", "+newSuffix;
				
				statusItem.attr("title", tooltip);
				statusItem.html(messages[item]+item);

				// jQuery bug ?
				// hack in order to append the HTML string of the node, instead the node itself
				// if statusBar.append(statusItem), statusItem will loose the css attributes
				// what we do is: make a clone of the statusItem inside a temp div, 
				// get the content of that div and then destroy the div
				statusText += $('<div>').append(statusItem.clone()).remove().html();
            }
		}
    }
	
    if (hasNew)
    {
        if (getPref("playsound"))
            playSound(getPref("sound"));
            
        if (getPref("openMsgOnNew"))
            openURL(inboxURL,getPref("focusTab"));

		chrome.browserAction.setBadgeText({"text":"New!"});
            
        localStorage.lastMessages = array2JSON(newMessages);
    }
	
	if (getPref("autoupdate"))
		setTimeout(retrieveMessages, getPref("checktime")*1000)
	
	updateStatus(statusText);
	
	log("Retrieve messages: end");	
}

function updateStatus(status)
{
	chrome.tabs.getAllInWindow(null, function(tabs) {
		for (var f=0; f<tabs.length; f++)
			chrome.tabs.sendRequest(tabs[f].id, {status: status, action: "set_status"});
	});	
}

function handleGetStatusRequest(request, sender, sendResponse)
{
	if (request.action = "get_status")
		sendResponse({status: statusText})
}

function playSound(sound)
{
	var player = document.getElementById('notifySound');
	player.setAttribute("src", sound)
	player.play();
}

init();



