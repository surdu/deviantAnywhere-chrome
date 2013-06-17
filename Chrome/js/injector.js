//
// Copyright (c) 2011 Nicolae Surdu
//

var iFrameContent;

var options;
function insertBody()
{
	$("html").append("<iframe id='devany_chrome_iframe' frameborder='0' scrolling='no'></iframe>");

	var injectorURL = chrome.extension.getURL('content/injector.html')
	var req = new HTTPRequest(injectorURL);
	req.onSuccess = handleFrameLoad;
	req.send();
	
	chrome.extension.onMessage.addListener(handleRequests);
}

function initLook()
{
	chrome.extension.sendMessage({action: 'get_settings'}, function(settings) {

		var bkgColor = settings.bkgColor;
		var textColor = settings.textColor;
		var newTextColor = settings.newTextColor;
		
		$("#inbox", iFrameContent).css("backgroundColor", bkgColor);
		$("#inbox", iFrameContent).css("color", textColor);
		$("#inbox b", iFrameContent).css("color", newTextColor);
		
		var groups = settings.groups || "{}";
		
		for (var iid in groups)
		{
			var id = iid.substr(1);
			
			if (settings["bkgColor_"+iid])
				$("#inbox_"+id, iFrameContent).css("backgroundColor", settings["bkgColor_"+iid]);
			else
				$("#inbox_"+id, iFrameContent).css("backgroundColor", defaults["bkgColor"]);
	
			if (settings["textColor_"+iid])
				$("#inbox_"+id, iFrameContent).css("color", settings["textColor_"+iid]);
			else
				$("#inbox_"+id, iFrameContent).css("color", defaults["textColor"]);
	
			if (settings["newTextColor_"+iid])
				$("#inbox_"+id+" b", iFrameContent).css("color", settings["newTextColor_"+iid]);
			else
				$("#inbox_"+id+" b", iFrameContent).css("color", defaults["newTextColor"]);
		}
	});
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
	{
		initLook();
		sendResponse({});
	}
	else
	if (request.action == "redraw_messages")
	{
		chrome.extension.sendMessage({action: "get_status"}, handleGetStatusResponse);
		sendResponse({});
	}
}

function handleGetStatusResponse(response)
{
	for (var id in response.statusList)
		setStatus(response.statusList[id]);
}

function handleFrameLoad(response)
{
	var extId = getExtensionId;
	if (!extId)
	{
		alert("There is a big problem with deviantAnywhere. Please disable it and report to the extension's developer");
		return;
	}

	// replace all the id predefined messages in the HTML with the extension's id
	response = response.replace(/__MSG_@@extension_id__/g, extId);
	
	// fill the iframe and initialize it
	$('#devany_chrome_iframe').contents().find('html')
	.html(response);

	iFrameContent = document.getElementById("devany_chrome_iframe").contentDocument.body;

	// disable selection
	iFrameContent.onselectstart = disable;
	
	// disable right click
	$(iFrameContent).bind("contextmenu", disable);

	if ($.cookie('hide_devanybar'))
	{
		$("#collapseBtn", iFrameContent).toggle(showBar, hideBar);
		$("#collapseBtn", iFrameContent).css("background-image", "url('"+getExtensionPath("chrome-extension://__MSG_@@extension_id__/img/collapse_left.png")+"')").attr("title", "Show deviantAnywhere bar");
	}
	else
		$("#collapseBtn", iFrameContent).toggle(hideBar, showBar);

    initLook();
    chrome.extension.sendMessage({action: "get_status"}, handleGetStatusResponse);
}

function hideBar()
{
	var bar = $("#devany_chrome_iframe");
	
	bar.animate({"right": -bar.width()+13});
	$("#collapseBtn", iFrameContent).css("background-image", "url('"+getExtensionPath("chrome-extension://__MSG_@@extension_id__/img/collapse_left.png")+"')").attr("title", "Show deviantAnywhere bar");
	$.cookie('hide_devanybar', true, { expires: 2600, path: '/' });
}

function showBar()
{
	var bar = $("#devany_chrome_iframe");
	
	bar.animate({"right": 0});
	$("#collapseBtn", iFrameContent).css("background-image", "url('"+getExtensionPath("chrome-extension://__MSG_@@extension_id__/img/collapse_right.png")+"')").attr("title", "Collapse deviantAnywhere bar");

	$.cookie('hide_devanybar', null, { path: '/' });
}


function setStatus(status)
{
    chrome.extension.sendMessage({action: 'get_settings'}, function(settings) {

        var inboxId = "inbox_"+status.id;
        if (status.isInbox)
            inboxId = "inbox";

        $("#sysMessages", iFrameContent).addClass("empty");

        var interesting = typeof settings["followGroup_i"+status.id] == 'undefined' ? true : settings["followGroup_i"+status.id];

        if (status.hasMessages && (interesting || status.isInbox ))
        {
            var msgText = $("#"+inboxId+" .messagesText", iFrameContent);

            if ($("#"+inboxId, iFrameContent).length == 0)
            {
                var msgWrap = $("<div></div>").attr("id", inboxId);


                if (status.isInbox)
                {
                    msgWrap.dblclick(function(){openInbox(true, true);})
                    // this peace of shit bug must be investigated
                    msgWrap.css("marginRight", "-4px");
                }
                else
                    msgWrap.dblclick(function(){openInbox(true, true, status.id);})


                var msgIcon = $("<img />");

                if (status.isInbox)
                    msgIcon.attr("src", getExtensionPath("chrome-extension://__MSG_@@extension_id__/img/status_icons/normal.gif"));
                else
                    msgIcon.attr("src", getExtensionPath("chrome-extension://__MSG_@@extension_id__/img/status_icons/group.gif"));

                msgIcon.attr("title", status.folderName);

                msgText = $("<div></div>");

                msgWrap.append(msgIcon);
                msgWrap.append(msgText)

                if (status.isInbox)
                    $("#collapseBtn", iFrameContent).after(msgWrap);
                else
                    $(iFrameContent).append(msgWrap);

                msgWrap.addClass("messagesWrap");
                msgIcon.addClass("messagesIcon");
                msgText.addClass("messagesText");
            }
            else
            {
                $("#"+inboxId, iFrameContent).removeClass("empty");
                msgText.empty();
            }

            for (var name in status.messages)
            {
                if (status.messages[name].count != 0 && status.messages[name].shouldRender)
                {
                    var statusItem = $("<span></span>");
                    var newSuffix = "";

                    if (status.messages[name].newCount)
                    {
                        statusItem = $("<b></b>");
                        newSuffix = status.messages[name].newCount + " New";
                    }

                    // detect singular or plural
                    var suffix = status.messages[name].desc[Math.abs(status.messages[name].count > 1)];

                    var tooltip = "";

                    if (status.messages[name].newCount == status.messages[name].count)
                        tooltip = status.folderName+"\n"+newSuffix+" "+suffix;
                    else
                    {
                        if (newSuffix)
                            newSuffix = ", "+newSuffix;
                        tooltip = status.folderName+"\n"+status.messages[name].count+" "+suffix+newSuffix;
                    }

                    statusItem.attr("title", tooltip);
                    statusItem.text(status.messages[name].count+name);

                    msgText.append(statusItem);
                }
            }
        }
        else
            $("#"+inboxId, iFrameContent).addClass("empty");

        var barWidth = 0;
        var ICON_WIDTH = 16;
        var PADDING_WIDTH = 15;
        var allEmpty = true;

        $(".messagesText", iFrameContent).each(function(){
            if (!$(this).parent().hasClass("empty"))
            {
                barWidth += $(this).width() + ICON_WIDTH + PADDING_WIDTH;
                allEmpty = false;
            }
        });

        if (allEmpty)
        {
            $("#sysMessages", iFrameContent).removeClass("empty");

            switch (parseInt(settings["noMsgLook"]))
            {
                case 0:
                    $("#sysMessages .messageItem", iFrameContent).text("");
                    $('#devany_chrome_iframe').css("display", "block");
                    break;

                case 1:
                    $('#devany_chrome_iframe').css("display", "none");
                    break;

                case 2:
                    $("#sysMessages .messageItem", iFrameContent).text(settings["noMsgText"]);
                    $('#devany_chrome_iframe').css("display", "block");
                    break;
            }

            barWidth = $("#sysMessages .messagesText", iFrameContent).width() + ICON_WIDTH + PADDING_WIDTH;
        }
        else
            $('#devany_chrome_iframe').css("display", "block");

        $('#devany_chrome_iframe').width(barWidth+13);

        if ($.cookie('hide_devanybar'))
            $('#devany_chrome_iframe').css("right", -barWidth);

        initLook();
    });
}

insertBody();
