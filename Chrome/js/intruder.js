var iFrameContent;

function insertBody()
{
	$("html").append("<iframe id='devany_chrome_iframe' frameborder='0' scrolling='no'></iframe>");

	intruderURL = chrome.extension.getURL('content/intruder.html')
	var req = new HTTPRequest(intruderURL);
	req.onSuccess = handleFrameLoad;
	req.send();
	
	chrome.extension.onRequest.addListener(handleRequests);
	chrome.extension.sendRequest({action: "get_status"}, handleGetStatusResponse);
}

function initLook(bkgColor, textColor, showFella)
{
	if (bkgColor != null)
		$(iFrameContent).css("backgroundColor", bkgColor);
	
	if (textColor != null)
		$("#da_wrap", iFrameContent).css("color", textColor);
		
	if (showFella != null)
	{
		if (showFella == true)
			$("#fellaIcon", iFrameContent).css("display", "inline").addClass("visible");
		else
			$("#fellaIcon", iFrameContent).css("display", "none").removeClass("visible");
			
		setTimeout(fitContent, 10);
	}
}

function handleRequests(request, sender, sendResponse)
{
	if (request.action == "set_status")
	{
		setStatus(request.status)
		sendResponse({});
	}
	else
	if (request.action == "change_ui")
		initLook(request.bkgColor, request.textColor, request.showFella);
	
}

function handleGetStatusResponse(response)
{
	setStatus(response.status);
}

function handleFrameLoad(response)
{
	//get extension's IDs
	var regExp = /chrome-extension:\/\/(.*?)\//; 
	var match = regExp.exec(chrome.extension.getURL('/'));
	if (match != null) 
	    extId = match[1];
	else
	{
		alert("There is a big problem with deviantAnywhere. Please disable it and report to the extension's developer");
		return;
	}

	// replace all the id predefined messages in the HTML with the extension's id
	response = response.replace(/__MSG_@@extension_id__/g, extId);
	
	// fill the iframe and initialize it
	$('#devany_chrome_iframe').contents().find('html')
	.html(response)
	.dblclick(function(){openMessages(true, true);});

	iFrameContent = document.getElementById("devany_chrome_iframe").contentDocument.body;

	// disable selection
	iFrameContent.onselectstart = disable;
	
	// disable right click
	$(iFrameContent).bind("contextmenu", disable);
}

function setStatus(status)
{
	if (status)
	{
		// change the status
		var statusBar = $("#statusBar", iFrameContent);
		statusBar.html(status);
		
		setTimeout(fitContent, 10);
	}
}

function fitContent()
{
	//icon size factor
	var iconVisible = $("#fellaIcon", iFrameContent).hasClass("visible");
	var iconFactor = iconVisible ? 24 : 0;
	
	// resize main iframe to fit content
	var  newWidth = $("#statusBar", iFrameContent).width() + 16 + iconFactor;
	$('#devany_chrome_iframe').width(newWidth);
}

insertBody();
