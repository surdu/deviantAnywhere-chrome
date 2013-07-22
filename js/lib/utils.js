function HTTPRequest(url, method, headers)
{
	if (!method)
		method = "GET";
		
	this.dataType = null;
	this.method = method;
	this.onSuccess = null;
	this.onError = null;

	this.req = new XMLHttpRequest();		
	this.req.owner = this;
    this.req.open(this.method, url, true);   
    this.req.onreadystatechange = this.handleResponse;
    for (var header in headers)
    	this.req.setRequestHeader(header, headers[header]);
}

HTTPRequest.prototype =
{
	send: function(data)
	{
		var query = "";
		
		if (data)
        {
			for (var item in data)
				query += item + "=" + data[item] + "&";

            // remove the last apersand
            query = query.substring(0, query.length-1);
        }
		
	    this.req.send(query);
	},

	handleResponse: function()
	{
		if (this.readyState == 4)
		{
			if (Math.round(this.status/100) == 2) 
			{
				if (this.owner.onSuccess)
				{
					if (this.owner.dataType=="json")
						this.owner.onSuccess(JSON.parse(this.responseText), this.responseText);
					else
						this.owner.onSuccess(this.responseText);
				}
			}
			else
				if (this.owner.onError)
				{
					this.owner.onError(this.status);						
				}
		}
	}
	
}

function str(value)
{
	return ""+value;
}

function inContentScript()
{
    try 
    {
        if (chrome.bookmarks)
            return false;
		return true;
    }
    catch (e) {
        return true;
    }	
}

function getExtensionId()
{
	var regExp = /chrome-extension:\/\/(.*?)\//; 
	var match = regExp.exec(chrome.extension.getURL('/'));
	if (match != null)
	    return match[1];
	return null;
}


function getExtensionPath(path)
{
	return path.replace("__MSG_@@extension_id__", getExtensionId());
}

function playSound(soundFile)
{
	var player = document.getElementById('soundPlayer');
	player.setAttribute("src", soundFile);
	player.play();
}

//deprecated
function array2JSON(array)
{
    result = "{";
    isFirst = true;
    for (var key in array)
    {
        if (!isFirst)
            result += ",";
        else
            isFirst = false;
        result += key+":"+array[key];
    }
    result += "}";
    return result;
}

//deprecated
function JSON2array(json)
{
    result = new Array();
    if (json!=null && json!="")
    {
        json = json.replace(/{|}/g,"");
        elements = json.split(",");
        for (f=0;f<elements.length;f++)
        {
            parts = elements[f].split(":");
            result[parts[0]] = parts[1];
        }
    }
    return result;
}

function openURL(url, newtab, focus)
{
	chrome.extension.sendMessage({action: "open_url", url: url, newtab: newtab, focus: focus});
}

function openInbox(newtab, focus, groupid)
{
    /***
     * Open a deviantArt inbox
     *
     * Arguments:
     * newtab   -- Should the inbox be opened in a new tab (default 'False')
     * focus    -- Should the inbox tab be focused uppon open (default 'True')
     * groupid  -- The id of the deviantArt inbox
     */

	var suffix = "";
	if (groupid)
		suffix = "#view="+groupid;
	openURL("http://www.deviantart.com/messages/"+suffix, newtab, focus);
	chrome.extension.sendMessage({action: "reset_new_flag"});
	return false;
}

function log(message)
{
	var now = new Date();
	console.log("["+now.format("m/dd/yy, HH:MM:ss")+"] "+message);
}

function disable()
{
	// used to disable natural behaviours using jQuery
	return false;
}

