function insertBody()
{
	$("html").append("<iframe id='devany_chrome_iframe' frameborder='0' scrolling='no'></iframe>");

	var req = new HTTPRequest('chrome-extension://cfliabmmnojpbgaaijjhnfhbjklidhfp/content/intruder.html');
	req.onSuccess = handleFrameLoad;
	req.send();
	
	chrome.extension.onRequest.addListener(handleSetStatusRequest);
	chrome.extension.sendRequest({action: "get_status"}, handleGetStatusResponse);
}

function handleSetStatusRequest(request, sender, sendResponse)
{
	if (request.action = "set_status")
	{
		setStatus(request.status)
		sendResponse({});
	}
}

function handleGetStatusResponse(response)
{
	setStatus(response.status);
}

function handleFrameLoad(response)
{
	$('#devany_chrome_iframe').contents().find('html').html(response);
}

function setStatus(status)
{
	if (status)
	{
		// change the status
		var statusBar = $("#statusBar", document.getElementById("devany_chrome_iframe").contentDocument.body);
		statusBar.html(status);
		
		setTimeout(fitContent, 10);
	}
}

function fitContent()
{
	// resize main iframe to fit content
	var  newWidth = $("#statusBar", document.getElementById("devany_chrome_iframe").contentDocument.body).width() + 40;
	$('#devany_chrome_iframe').width(newWidth);
}

insertBody();
