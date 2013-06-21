function MessEx(folderId, folderName, isInbox, onSuccess, onError)
{
	//Messages Extractor
	
	this.id = folderId;
	this.isInbox = isInbox;
	this.folderName = folderName;
	this.onSuccess = onSuccess;
	this.onError = onError;

	this.getMsgContent();
}

MessEx.prototype = 
{
	getMsgContent: function()
	{
		var maxItems = 20;
		var queryStr = '?c[]="MessageCenter","get_views",'+
		'["'+this.id+'","oq:fb_comments:0:'+maxItems+':f"],'+
		'["'+this.id+'","oq:fb_replies:0:'+maxItems+':f"],'+
		'["'+this.id+'","oq:notes_unread:0:'+maxItems+':f"],'+
		'["'+this.id+'","oq:notices:0:'+maxItems+':f"],'+
		'["'+this.id+'","oq:contests:0:'+maxItems+':f"],'+
		'["'+this.id+'","oq:fb_activity:0:'+maxItems+':f"],'+
		'["'+this.id+'","oq:correspondence:0:'+maxItems+':f"],'+
		'["'+this.id+'","oq:devwatch:0:'+maxItems+':f:tg=deviations"],'+
		'["'+this.id+'","oq:devwatch:0:'+maxItems+':f:tg=journals"],'+
		'["'+this.id+'","oq:devwatch:0:'+maxItems+':f:tg=polls"],'+
		'["'+this.id+'","oq:devwatch:0:'+maxItems+':f:tg=forums"],'+
		'["'+this.id+'","oq:devwatch:0:'+maxItems+':f:tg=critiques"],'+
        '["'+this.id+'","oq:devwatch:0:'+maxItems+':f:tg=activities"],'+
		'["'+this.id+'","oq:zendesk:0:'+maxItems+':f"],'+
		'["'+this.id+'","oq:bulletins:0:'+maxItems+':f"]';

		
		log("Requesting messages DiFi");
		var getContentReq = new HTTPRequest(difiURL+queryStr+"&t=json", "GET", NOCACHE_HEADERS);
		getContentReq.onSuccess = $.proxy(this.parseMessages, this);
		getContentReq.dataType = "json";
		getContentReq.send();		
	},
	
	parseMessages: function(response)
	{
        if (response.DiFi.status == "SUCCESS")
        {
            this.newMessages = {
                "C":    parseInt(response.DiFi.response.calls[0].response.content[0].result.matches),
                "R":    parseInt(response.DiFi.response.calls[1].response.content[0].result.matches),
                "UN":   parseInt(response.DiFi.response.calls[2].response.content[0].result.matches),
                "HT":   parseInt(response.DiFi.response.calls[3].response.content[0].result.matches),
                "CA":   parseInt(response.DiFi.response.calls[4].response.content[0].result.matches),
                "AM":   parseInt(response.DiFi.response.calls[5].response.content[0].result.matches),
                "CO":   parseInt(response.DiFi.response.calls[6].response.content[0].result.matches),
                "D":    parseInt(response.DiFi.response.calls[7].response.content[0].result.matches),
                "J":    parseInt(response.DiFi.response.calls[8].response.content[0].result.matches),
                "P":    parseInt(response.DiFi.response.calls[9].response.content[0].result.matches),
                "F":    parseInt(response.DiFi.response.calls[10].response.content[0].result.matches),
                "WC":   parseInt(response.DiFi.response.calls[11].response.content[0].result.matches),
                "A":    parseInt(response.DiFi.response.calls[12].response.content[0].result.matches),
                "S":    parseInt(response.DiFi.response.calls[13].response.content[0].result.matches),
                "B":    parseInt(response.DiFi.response.calls[14].response.content[0].result.matches)
            };

            this.onSuccess({
                id: 			this.id,
                folderName: 	this.folderName,
                isInbox: 		this.isInbox,
                newMessages:	this.newMessages
            });
        }
        else
            if (this.onError)
                this.onError();
	}
}