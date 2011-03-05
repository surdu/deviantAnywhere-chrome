function deviantAnywhere()
{
	this.logInfo = new Array();
	this.settingWindow;
	
    this.messagesURL = "http://www.deviantart.com/global/difi.php";
	this.inboxURL = "http://my.deviantart.com/messages/";
    this.loginURL    = "https://www.deviantart.com/users/login";
    this.donateURL   = "https://www.paypal.com/cgi-bin/webscr"
	
	this.inboxId = null;
		
    this.messagesInfo = {"N":{"desc":"Notice::Notices", "pref":"followNotices"},
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
	
	this.messages  = new Array();
	this.newMessages = new Array();
	
    this.loginReq = new XMLHttpRequest();

    this.loginRetry = 0;
    this.timer = null;

    this.status = {};

    this.status.message = "Started...";
    this.status.error = false;

    this.panel = null;

    this.alertUrl = null;
    this.firstTime = true;
}

deviantAnywhere.prototype =
{
    init: function()
    {
		this.log("Starting...");
        panel = document.getElementById("dAPanel");
        lastMessages = ro_cvds_daUtils.getPref("lastMessages");
        this.messages = ro_cvds_daUtils.JSON2array(lastMessages);

        if (ro_cvds_daUtils.getPref("customLook",ro_cvds_daUtils.boolPref))
        {
            if (ro_cvds_daUtils.getPref("showIcon",ro_cvds_daUtils.boolPref))
                panel.setAttribute("showIcon","true");
            panel.setAttribute("class","customLook");
            panel.style.backgroundColor = ro_cvds_daUtils.getPref("bkgcolor",ro_cvds_daUtils.stringPref);
            panel.style.borderColor = ro_cvds_daUtils.getPref("bkgcolor",ro_cvds_daUtils.stringPref);
            panel.style.color = ro_cvds_daUtils.getPref("textcolor",ro_cvds_daUtils.stringPref);
        }

		var logo = document.getElementById("daLogo");
		if (!ro_cvds_daUtils.getPref("showIcon",ro_cvds_daUtils.boolPref))
			logo.style.display = "none";

        this.retrieveMessages();
    },

	handleTimerEvent: function()
	{
		ro_cvds_daInstance.retrieveMessages();
	},

	setIcon: function(icon)
	{
		var iconEl = document.getElementById("daLogo");
		iconEl.setAttribute("src", "chrome://devany/skin/images/status_icons/"+icon+".gif")
	},

    retrieveMessages: function()
    {
        ro_cvds_daInstance.log("Retrieve messages: start");
		ro_cvds_daInstance.setIcon("loading");
		
		var getFoldersReq = new dAServiceRequest(ro_cvds_daInstance.messagesURL+"?c[]=MessageCenter;get_folders&t=json");
		getFoldersReq.onSuccess = ro_cvds_daInstance.parseFolders;
		getFoldersReq.dataType = "json";
		getFoldersReq.send();
		
        if (ro_cvds_daUtils.getPref("autoupdate",ro_cvds_daUtils.boolPref))
        {
			var event = { notify: ro_cvds_daInstance.handleTimerEvent };
			this.timer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);
			
			this.timer.initWithCallback(event,ro_cvds_daUtils.getPref("checktime",ro_cvds_daUtils.intPref)*1000,Components.interfaces.nsITimer.TYPE_ONE_SHOT);
		}
    },

	parseFolders: function(response)
	{
		ro_cvds_daInstance.setIcon("normal");
		if (response.DiFi.status == "SUCCESS")
		{
			ro_cvds_daInstance.log("Parsing folders");
			var folders = response.DiFi.response.calls[0].response.content;
			
			// get the inbox folder id
			for (f=0; f<folders.length;f++)
				if (folders[f].is_inbox)
				{
					ro_cvds_daInstance.inboxId = folders[f].folderid;
					continue;							 		
				}

			if (ro_cvds_daInstance.inboxId)
				ro_cvds_daInstance.getMsgContent();
		}
		else
			ro_cvds_daInstance.login();

	},

    getMsgContent: function()
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
		
		ro_cvds_daInstance.log("Requesting messages DiFi");
		var getContentReq = new dAServiceRequest(this.messagesURL+queryStr+"&t=json");
		getContentReq.onSuccess = ro_cvds_daInstance.parseMessages;
		getContentReq.dataType = "json";
		getContentReq.send();		
    },

	parseMessages: function(response)
	{
		ro_cvds_daInstance.log("Requesting messages DiFi: success");
		ro_cvds_daInstance.newMessages["C"] = response.DiFi.response.calls[0].response.content[0].result.matches;
		ro_cvds_daInstance.newMessages["R"] = response.DiFi.response.calls[1].response.content[0].result.matches;
		ro_cvds_daInstance.newMessages["UN"]= response.DiFi.response.calls[2].response.content[0].result.matches;
		ro_cvds_daInstance.newMessages["N"] = response.DiFi.response.calls[3].response.content[0].result.matches;
		ro_cvds_daInstance.newMessages["CA"]= response.DiFi.response.calls[4].response.content[0].result.matches;
		ro_cvds_daInstance.newMessages["A"] = response.DiFi.response.calls[5].response.content[0].result.matches;
		ro_cvds_daInstance.newMessages["CO"]= response.DiFi.response.calls[6].response.content[0].result.matches;
		ro_cvds_daInstance.newMessages["D"] = response.DiFi.response.calls[7].response.content[0].result.matches;
		ro_cvds_daInstance.newMessages["NW"]= response.DiFi.response.calls[8].response.content[0].result.matches;
		ro_cvds_daInstance.newMessages["J"] = response.DiFi.response.calls[9].response.content[0].result.matches;
		ro_cvds_daInstance.newMessages["P"] = response.DiFi.response.calls[10].response.content[0].result.matches;
		ro_cvds_daInstance.setStatus();
	},

	log: function(text)
	{
		//TODO: implement this to log on a file that will be sent to developers for debugging
	},

    checkNow: function()
    {
    	if (this.timer)
        	this.timer.cancel();
        loginRetry = 0;
        this.retrieveMessages();
    },
	
///////////////////////// UI ///////////////////////// 
    setStatus: function()
    {
        hasNew = false;
        statusBarText = "";

        //build the status bar message & tooltip
        hasNew = false;
		var statusWrap = document.getElementById("statusWrap");
		
		//clean old message labels
		var oldMessageLabels = statusWrap.getElementsByClassName("msgLabel");		
		while(oldMessageLabels.length > 0)
			statusWrap.removeChild(oldMessageLabels[0]);
		
		var newMessages = ro_cvds_daInstance.newMessages;
		
        for (item in newMessages)
        {
			if (ro_cvds_daUtils.getPref(this.messagesInfo[item].pref, ro_cvds_daUtils.boolPref))
			{
	            var thisIsNew = false;
				var oldValue = this.messages[item]; 
				var currentValue = newMessages[item];
				var newSuffix = "";
				 
				//alert (item+" - "+oldValue+" - "+currentValue);
	            if ((oldValue==undefined && currentValue!=0) || (oldValue == 0 && oldValue < currentValue) || (oldValue && oldValue < currentValue))
	            {
	                hasNew = true;
	                thisIsNew = true;
	            }
	            this.messages[item] = newMessages[item];
				
	            if (this.messages[item]!=0)
	            {
					//create a label node and add it to the status
					var msgLabel =  document.createElement("label");
					msgLabel.setAttribute("class", "msgLabel");
					if (thisIsNew)
					{
						msgLabel.setAttribute("class", "msgLabel newMsg");
						if (oldValue != undefined)
							newSuffix = (currentValue - oldValue) + " New";
						else  
							newSuffix = currentValue + " New";
					}
					msgLabel.setAttribute("value", this.messages[item]+item);
					
					var tooltipOpts = this.messagesInfo[item].desc.split("::");
					var tooltip = tooltipOpts[0];
					if (this.messages[item]>1)
						tooltip = tooltipOpts[1];
					msgLabel.setAttribute("tooltiptext", this.messages[item]+" "+tooltip+"\n"+newSuffix);
					statusWrap.appendChild(msgLabel);
	            }
			}
        }
		
        if (hasNew)
        {
            if (ro_cvds_daUtils.getPref("playsound",ro_cvds_daUtils.boolPref))
                this.playSound(ro_cvds_daUtils.getPref("sound"));
            if (ro_cvds_daUtils.getPref("openMsgOnNew",ro_cvds_daUtils.boolPref))
                ro_cvds_daInstance.openURL(ro_cvds_daInstance.inboxURL,ro_cvds_daUtils.getPref('focusTab',ro_cvds_daUtils.boolPref));
            ro_cvds_daUtils.setPref("lastMessages",ro_cvds_daUtils.array2JSON(newMessages),ro_cvds_daUtils.stringPref);
        }
		ro_cvds_daInstance.log("Retrieve messages: end");
    },

    clearURL: function(url)
    {
        return url.replace(/\\/g, "");
    },

    openURL: function(URL, alsoFocus)
    {
        if (alsoFocus)
            gBrowser.selectedTab = gBrowser.addTab(URL);
        else
            gBrowser.addTab(URL);
    },

    openWindow: function(url,name,panel)
    {
        var windowMediator = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
        var topWindow = windowMediator.getMostRecentWindow(name);

        if (topWindow)
            topWindow.focus();
        else
        {
            topWindow = windowMediator.getMostRecentWindow(null);
            return topWindow.openDialog(url, "_blank", "chrome,toolbar,centerscreen", panel);
        }
    },

    openConfig: function()
    {
        this.settingWindow = this.openWindow("chrome://devany/content/UI/settings.xul","devAny:settings",["dA-main"])
    },

    openLog: function()
    {
        this.settingWindow = this.openWindow("chrome://devany/content/UI/settings.xul","devAny:settings",["dA-connect"])
    },


    openAbout: function()
    {
        this.settingWindow = this.openWindow("chrome://devany/content/UI/settings.xul","devAny:settings",["dA-about"])
    },


    playSound: function(userSound)
    {
      var sample = Components.classes["@mozilla.org/sound;1"].createInstance().QueryInterface(Components.interfaces.nsISound);
      var ioService = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
      sample.play(ioService.newURI(userSound, null, null));
    },

    login: function()
    {
		ro_cvds_daInstance.log("Loging user in");
        password = ro_cvds_daUtils.getUserData()?ro_cvds_daUtils.getUserData().password:null;
        if (ro_cvds_daUtils.getPref("useautologin",ro_cvds_daUtils.boolPref) && ro_cvds_daUtils.getPref("username",ro_cvds_daUtils.stringPref) && password)
        {
			ro_cvds_daInstance.log("... using autologin");
	        var dataString = "username="+ro_cvds_daUtils.getPref("username",ro_cvds_daUtils.stringPref)+"&password="+password+"&reusetoken=1";
	
	        this.loginReq.open("POST", this.loginURL, true);
	        this.loginReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	        this.loginReq.onreadystatechange = this.loginEnd;
	        this.loginReq.sendAsBinary(dataString);
        }
        else
        {
			ro_cvds_daInstance.log("... not using auto-login. Login on deviantart.com to continue");
            panel.setAttribute("label","Not logged in");
        }
		
    },

    loginEnd: function()
    {
        if(this.readyState == 4 && this.status == 200)
        {
            if (ro_cvds_daInstance.loginRetry<2)
            {
                ro_cvds_daInstance.loginRetry++;
				ro_cvds_daInstance.timer.cancel();
                ro_cvds_daInstance.retrieveMessages();
            }
            else
            {
                panel.setAttribute("label","Not logged in");
				ro_cvds_daInstance.log("Login failed: invalid deviant name/password provided in auto-login");
            }
        }
    },

	donate: function()
	{
		var windowManager = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
		var browserWindow = windowManager.getMostRecentWindow("navigator:browser");
		var browser = browserWindow.getBrowser();

		var dataString = "cmd=_donations&business=contact@cvds.ro&lc=US&item_name=deviantAnywhere&currency_code=USD&bn=PP-DonationsBF:btn_donateCC_LG.gif:NonHostedGuest";
		var stringStream = Components.classes["@mozilla.org/io/string-input-stream;1"].createInstance(Components.interfaces.nsIStringInputStream);
		stringStream.setData(dataString, dataString.length);
		
		var postData = Components.classes["@mozilla.org/network/mime-input-stream;1"].createInstance(Components.interfaces.nsIMIMEInputStream);
		postData.addContentLength = true;
		postData.setData(stringStream);

		if(browser.mCurrentBrowser.currentURI.spec == "about:blank")
		    browserWindow.loadURI(ro_cvds_daInstance.donateURL, null, postData, false);
		else
		    browser.loadOneTab(ro_cvds_daInstance.donateURL, null, null, postData, false, false);		
	},

    openStatus: function()
    {
        this.openWindow("chrome://devany/content/UI/status.xul","devAny:status",[])
    },

    showNotification: function()
    {
        window.open("chrome://devany/content/UI/alert.xul","notifier","chrome,dialog=yes,titlebar=no,popup=yes");
    },

    openMessages: function()
    {
        this.openURL(this.inboxURL,true);
    }
}

var ro_cvds_daInstance = new deviantAnywhere();

function ro_cvds_initDa()
{
    ro_cvds_daInstance.init();
}

window.addEventListener("load", ro_cvds_initDa, false);



