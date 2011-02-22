function getOwner(){return this.owner;}	
function setOwner(owner){this.owner = owner;}
XMLHttpRequest.prototype.setOwner = setOwner;
XMLHttpRequest.prototype.getOwner = getOwner;

function dAServiceRequest(url, dataType)
{
	this.dataType = dataType;
	this.method = "GET"
	this.onSuccess = null;
	this.onError = null;

	this.req = new XMLHttpRequest();		
	this.req.setOwner(this);
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
			var owner = this.getOwner(); 
			if (owner == undefined)
				ro_cvds_daInstance.log("Error occured. Please press 'Check now' to retry. [will be fixed!]")
			if (this.status == 200 && owner.onSuccess) 
			{
				if (owner.dataType=="json")
					owner.onSuccess(JSON.parse(this.responseText), this.responseText);
				else
					owner.onSuccess(this.responseText);
			}
			else
				if (owner.onError)
				{
					owner.onError(this.status);						
				}
		}
	}
}
