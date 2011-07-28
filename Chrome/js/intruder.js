function insertBody()
{
	$("body").append("<iframe id='devany_chrome_iframe' frameborder='0' scrolling='no'></iframe>");

	var req = new HTTPRequest('chrome-extension://cfliabmmnojpbgaaijjhnfhbjklidhfp/content/intruder.html');
	req.onSuccess = handleFrameLoad;
	req.send();
}

function handleFrameLoad(response)
{
	$('#devany_chrome_iframe').contents().find('html').html(response);
}

insertBody();
