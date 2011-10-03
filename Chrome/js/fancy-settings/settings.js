var settings_g;

window.addEvent("domready", function () {
    new FancySettings.initWithManifest(function (settings) {
    	
    	//we need to call the xxChanged functions manualy at first
    	//so that's why we need this global variable
    	settings_g = settings;
    	
    	j(settings.manifest.bkgColor.element).addClass("colorInput").attr("id", "bkgColorInput");
    	j(settings.manifest.textColor.element).addClass("colorInput").attr("id", "textColorInput");
    	
    	j("<div class='colorSelect'><div></div></div>").insertAfter(".colorInput");
    	
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
					settings.manifest.bkgColor.set("#"+color);
				else
					settings.manifest.textColor.set("#"+color);
			}    		
    	});
    	
    	j(settings.manifest.openInbox.element).change(openInboxChanged);
    	j(settings.manifest.playSound.element).change(playSoundChanged);
    	j(settings.manifest.autoupdate.element).change(autoupdateChanged);
    	j(settings.manifest.useAutoLogin.element).change(useAutoLoginChanged);
    	
    	openInboxChanged();
    	playSoundChanged();
    	autoupdateChanged();
    	useAutoLoginChanged();
    });
});

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
		j(settings_g.manifest.deviantName.label).removeAttr("disabled");
		j(settings_g.manifest.deviantName.element).removeAttr("disabled");

		j(settings_g.manifest.password.label).removeAttr("disabled");
		j(settings_g.manifest.password.element).removeAttr("disabled");
	}
	else
	{
		j(settings_g.manifest.deviantName.label).attr("disabled", "disabled");
		j(settings_g.manifest.deviantName.element).attr("disabled", "disabled");

		j(settings_g.manifest.password.label).attr("disabled", "disabled");
		j(settings_g.manifest.password.element).attr("disabled", "disabled");
	}
}
