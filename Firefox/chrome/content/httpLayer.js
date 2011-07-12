function dAServiceRequest(url, dataType)
{
	this.dataType = dataType;
	this.method = "GET"
	this.onSuccess = null;
	this.onError = null;

	this.req = new XMLHttpRequest();		
	this.req.owner = this;
    this.req.open(this.method, url, true);   
    this.req.onreadystatechange = this.handleResponse;
	this.req.channel.loadFlags |= Components.interfaces.nsIRequest.LOAD_BYPASS_CACHE;
    this.req.setRequestHeader("Pragma", "no-cache");
    this.req.setRequestHeader("Cache-Control", "no-cache");
}

dAServiceRequest.prototype =
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
