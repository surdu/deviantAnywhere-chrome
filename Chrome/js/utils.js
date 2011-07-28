function HTTPRequest(url)
{
	this.dataType = null;
	this.method = "GET"
	this.onSuccess = null;
	this.onError = null;

	this.req = new XMLHttpRequest();		
	this.req.owner = this;
    this.req.open(this.method, url, true);   
    this.req.onreadystatechange = this.handleResponse;
    this.req.setRequestHeader("Pragma", "no-cache");
    this.req.setRequestHeader("Cache-Control", "no-cache");
}

HTTPRequest.prototype =
{
	send: function()
	{
	    this.req.send();
	},

	handleResponse: function()
	{
		if (this.readyState == 4)
		{
			if (this.status == 200 && this.owner.onSuccess) 
			{
				if (this.owner.dataType=="json")
					this.owner.onSuccess(JSON.parse(this.responseText), this.responseText);
				else
					this.owner.onSuccess(this.responseText);
			}
			else
				if (this.owner.onError)
				{
					this.owner.onError(this.status);						
				}
		}
	}
	
}

function getPref(prefValue, defaultValue)
{
	if (typeof prefValue == 'undefined')
		return defaultValue
	
	if (prefValue === "false")
		return false;
	
	if (prefValue === "true")
		return true;

	return prefValue;
}

function openURL(url)
{
	alert("Open URL: "+url);
}

function playSound(sond)
{
	alert("Play sound: "+sound);
}

