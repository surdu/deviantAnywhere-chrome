/***
 * Copyright (c) 2011 - 2013 Nicolae Surdu
 */

var settings_g;

window.addEvent("domready", function () {
    new FancySettings.initWithManifest(function (settings) {
    	
    	//we need to call some functions outside this function
    	//that need to acces the settings
    	settings_g = settings;
    	
    	//insert the color pickers and buttons after color inputs
    	makeColorPicker("bkgColor", "bkgColor");
    	makeColorPicker("textColor", "textColor");
    	makeColorPicker("newTextColor", "newTextColor");

		var groups = JSON.parse(localStorage.getItem("store.settings.groups")) || {};
    	
		// align pickers
    	var labels = [
    		settings.manifest.bkgColor.label,
    		settings.manifest.textColor.label,
    		settings.manifest.newTextColor.label
    	]
		
		//build the grups' color pickers here to save one itteration
    	for (var iid in groups)
		{
	    	makeColorPicker("bkgColor_"+iid, "bkgColor");
	    	makeColorPicker("textColor_"+iid, "textColor");
	    	makeColorPicker("newTextColor_"+iid, "newTextColor");
	    	
	    	labels.push(settings.manifest["bkgColor_"+iid].label);
	    	labels.push(settings.manifest["textColor_"+iid].label);
	    	labels.push(settings.manifest["newTextColor_"+iid].label);
	    	
	    	if (localStorage.getItem("store.settings.followGroup_"+iid) === null)
	    		settings.manifest["followGroup_"+iid].set(true);
	    	
	    	settings.manifest["followGroup_"+iid].addEvent("action", redrawMessages);
    	}

    	
    	var labelWidts = new Array();
    	for (var f=0; f<labels.length; f++)
    		labelWidts.push(labels[f].offsetWidth)
    	
    	var maxWidth = Math.max.apply(null, labelWidts);
    	
    	for (var f=0; f<labels.length; f++)
    		j(labels[f]).css("marginRight", maxWidth - labels[f].offsetWidth +14);

		    	
    	j(".colorSelect").each(function(){
			var input = j(this).parent().find("input");
			if (input.val())
				j(this).find("div").css("backgroundColor", input.val());
			else
			console.log(j(this).find("div").css("backgroundColor"))
				// input.val();
    	});
    	
    	// create the color pickers
    	j(".colorSelect").ColorPicker({
    		onBeforeShow: function(picker, trigger)
    		{
    			var input = trigger.parent().find("input");
    			j(this).ColorPickerSetColor(input.val());
    		},
    		
			onChange: function (trigger, color) {
				var input = trigger.parent().find("input");
				input.val("#"+color);
				trigger.find("div").css("backgroundColor", "#"+color);
				
				settings.manifest[input.attr("id")].set("#"+color);
				applyUIChanges();
			}    		
    	});
    	
    	settings.manifest.openInbox.addEvent("action", openInboxChanged);
    	settings.manifest.playSound.addEvent("action", playSoundChanged);
        settings.manifest.noMsgLook.addEvent("action", noMsgLookChanged);
    	settings.manifest.autoupdate.addEvent("action", autoupdateChanged);
    	settings.manifest.useAutoLogin.addEvent("action", useAutoLoginChanged);

    	openInboxChanged();
    	playSoundChanged();
        noMsgLookChanged();
    	autoupdateChanged();
    	useAutoLoginChanged();
    	
		j(settings.manifest.previewSound.element).click(function () {
			playSound(getExtensionPath(settings.manifest.sound.get()));
		});
		
		for (var name in messagesInfo)
	        settings.manifest[messagesInfo[name].pref].addEvent("action", redrawMessages);
    });
});

function redrawMessages()
{
	chrome.windows.getAll({populate: true}, function(windows){
		for (var f=0; f<windows.length; f++)
			for (var g=0; g<windows[f].tabs.length; g++)
				chrome.tabs.sendMessage(windows[f].tabs[g].id, {action: "redraw_messages"});
	});
}

function makeColorPicker(inputName, className)
{
	var input = j(settings_g.manifest[inputName].element);
	input.addClass("colorInput").attr("id", inputName);
	
	if (!input.val())
		input.val(defaults[className])
	
	var defaultBtn = j("<button>Default color</button>").addClass(className).attr("data-input", inputName).click(resetColor);
	var selectorCore = j("<div></div>");
	var selector = j("<div class='colorSelect'></div>").append(selectorCore);
	selector.insertAfter("#"+inputName);
	defaultBtn.insertAfter(selector);
}

function applyUIChanges()
{
	var settings = {};
	for(var item in settings_g.manifest)
		if (settings_g.manifest[item].params.type != "button")
			settings[item] = settings_g.manifest[item].get();
	
	chrome.windows.getAll({populate: true}, function(windows){
		for (var f=0; f<windows.length; f++)
			for (var g=0; g<windows[f].tabs.length; g++)
				chrome.tabs.sendMessage(windows[f].tabs[g].id, {action: "change_ui", settings: settings});
	});
}

function resetColor()
{
	var colorSelect = j(this).parent().find(".colorSelect div");;

	settings_g.manifest[j(this).attr("data-input")].set(defaults[j(this).attr("class")]);
	colorSelect.css("backgroundColor", defaults[j(this).attr("class")]);
	applyUIChanges();
}

function openInboxChanged()
{
	if (j(settings_g.manifest.openInbox.element).attr("checked"))
	{
		j(settings_g.manifest.focusInbox.label).removeAttr("disabled");
		j(settings_g.manifest.focusInbox.element).removeAttr("disabled");
	}
	else
	{
		j(settings_g.manifest.focusInbox.label).attr("disabled", "disabled");
		j(settings_g.manifest.focusInbox.element).attr("disabled", "disabled");
	}
}

function playSoundChanged()
{
	if (j(settings_g.manifest.playSound.element).attr("checked"))
	{
		j(settings_g.manifest.sound.label).removeAttr("disabled");
		j(settings_g.manifest.sound.element).removeAttr("disabled");
		j(settings_g.manifest.previewSound.element).removeAttr("disabled");
	}
	else
	{
		j(settings_g.manifest.sound.label).attr("disabled", "disabled");
		j(settings_g.manifest.sound.element).attr("disabled", "disabled");
		j(settings_g.manifest.previewSound.element).attr("disabled", "disabled");
	}
}

function noMsgLookChanged()
{
    var selectedValue = "";

    for (var f in settings_g.manifest.noMsgLook.elements)
        if (settings_g.manifest.noMsgLook.elements[f].checked)
        {
            selectedValue = settings_g.manifest.noMsgLook.elements[f].value;
            break;
        }

    if (selectedValue == "2")
        j(settings_g.manifest.noMsgText.element).removeAttr("disabled");
    else
        j(settings_g.manifest.noMsgText.element).attr("disabled", "disabled");

    redrawMessages();
}

function autoupdateChanged()
{
	if (j(settings_g.manifest.autoupdate.element).attr("checked"))
	{
		j(settings_g.manifest.checkTime.label).removeAttr("disabled");
		j(settings_g.manifest.checkTime.element).removeAttr("disabled");
	}
	else
	{
		j(settings_g.manifest.checkTime.label).attr("disabled", "disabled");
		j(settings_g.manifest.checkTime.element).attr("disabled", "disabled");
	}
}

function useAutoLoginChanged()
{
	if (j(settings_g.manifest.useAutoLogin.element).attr("checked"))
	{
		j(settings_g.manifest.username.label).removeAttr("disabled");
		j(settings_g.manifest.username.element).removeAttr("disabled");

		j(settings_g.manifest.password.label).removeAttr("disabled");
		j(settings_g.manifest.password.element).removeAttr("disabled");
	}
	else
	{
		j(settings_g.manifest.username.label).attr("disabled", "disabled");
		j(settings_g.manifest.username.element).attr("disabled", "disabled");

		j(settings_g.manifest.password.label).attr("disabled", "disabled");
		j(settings_g.manifest.password.element).attr("disabled", "disabled");
	}
}
