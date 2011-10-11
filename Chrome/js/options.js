//
// Copyright (c) 2011 Nicolae Surdu
//

var settings_g;

window.addEvent("domready", function () {
    new FancySettings.initWithManifest(function (settings) {
    	
    	//we need to call some functions outside this function
    	//that need to acces the settings
    	settings_g = settings;
    	
    	//insert the color pickers and buttons after color inputs
    	j(settings.manifest.bkgColor.element).addClass("colorInput").attr("id", "bkgColorInput");
    	j(settings.manifest.textColor.element).addClass("colorInput").attr("id", "textColorInput");
    	
    	j("<div class='colorSelect'><div></div></div> <button class='defaultBtn'>Default color</button>").insertAfter(".colorInput");
    	
    	j(".defaultBtn").click(resetColor);
    	
		// align pickers
    	var bkgLabelWidth = settings.manifest.bkgColor.label.offsetWidth;
    	var textLabelWidth = settings.manifest.textColor.label.offsetWidth;
    	
    	if (bkgLabelWidth < textLabelWidth)
    		j(settings.manifest.bkgColor.label).css("marginRight", textLabelWidth - bkgLabelWidth +14);
    	else
    		j(settings.manifest.textColor.label).css("marginRight", bkgLabelWidth - textLabelWidth +14);
    	
    	j(".colorSelect").each(function(){
			var input = j(this).parent().find("input");
			j(this).find("div").css("backgroundColor", input.val());
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
				
				if (input.attr("id")=="bkgColorInput")
				{
					settings.manifest.bkgColor.set("#"+color);
					applyUIChanges("#"+color, null, null);
				}
				else
				{
					settings.manifest.textColor.set("#"+color);
					applyUIChanges(null, "#"+color, null);
				}
			}    		
    	});
    	
    	j(settings.manifest.showFella.element).change(showFellaChanged);
    	j(settings.manifest.openInbox.element).change(openInboxChanged);
    	j(settings.manifest.playSound.element).change(playSoundChanged);
    	j(settings.manifest.autoupdate.element).change(autoupdateChanged);
    	j(settings.manifest.useAutoLogin.element).change(useAutoLoginChanged);
    	
    	openInboxChanged();
    	playSoundChanged();
    	autoupdateChanged();
    	useAutoLoginChanged();
    	
		j(settings.manifest.previewSound.element).click(function () {
			playSound(getExtensionPath(settings.manifest.sound.get()));
		});
		
		j(settings.manifest.loginBtn.element).click(function () {
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = login;
			xhr.open("POST", "https://www.deviantart.com/users/login", true);
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.send("username=postal2600&password=udtpcssonzdszz&remember_me=1");
		});    	
    });
});

function login() 
{
	if (this.readyState == 4 & this.status == 200)
		console.log(this.responseText);
}

function applyUIChanges(bkgColor, textColor, showFella)
{
	chrome.windows.getAll({populate: true}, function(windows){
		for (var f=0; f<windows.length; f++)
			for (var g=0; g<windows[f].tabs.length; g++)
				chrome.tabs.sendRequest(windows[f].tabs[g].id, {bkgColor: bkgColor, textColor: textColor, showFella: showFella, action: "change_ui"});
	});
}

function resetColor()
{
	var parent = j(this).parent();
	var input = parent.find("input");
	var colorSelect = parent.find(".colorSelect div");

	if (input.attr("id")=="bkgColorInput")
	{
		settings_g.manifest.bkgColor.set(defaults["bkgColor"]);
		colorSelect.css("backgroundColor", defaults["bkgColor"]);
		applyUIChanges(defaults["bkgColor"], null, null);
	}
	else
	{
		settings_g.manifest.textColor.set(defaults["textColor"]);
		colorSelect.css("backgroundColor", defaults["textColor"]);
		applyUIChanges(null, defaults["textColor"], null);
	}
}

function showFellaChanged()
{
	if (j(settings_g.manifest.showFella.element).attr("checked"))
		applyUIChanges(null, null, true);
	else
		applyUIChanges(null, null, false);
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
	}
	else
	{
		j(settings_g.manifest.sound.label).attr("disabled", "disabled");
		j(settings_g.manifest.sound.element).attr("disabled", "disabled");
	}
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
