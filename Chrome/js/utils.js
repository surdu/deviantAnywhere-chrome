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
			for (var item in data)
				query += item + "=" + data[item] + "&";
		
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
	if (newtab)
	{
		if (typeof focus == 'undefined' && focus !== false)
			focus = true;

		if (inContentScript())
		{
			window.open(url)

			if (focus === false)
				window.focus();
		}
		else
			chrome.tabs.create({url: url, selected: focus});
	}
	else
	{
		if (inContentScript())
			window.location = url;
		else
			chrome.tabs.getSelected(null, function(tab){
				chrome.tabs.update(tab.id, {url: url})
			});
	}
}

function openInbox(newtab, focus)
{
	openURL("http://my.deviantart.com/messages/", newtab, focus);
	chrome.extension.sendRequest({action: "reset_new_flag"});
	return false;
}

function log(message)
{
	//dummy for now
	console.log(message);
}

function disable()
{
	// used to disable natural behaviours using jQuery
	return false;
}

