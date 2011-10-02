window.addEvent("domready", function () {
    // Option 1: Use the manifest:
    new FancySettings.initWithManifest(function (settings) {
    	j(settings.manifest.bkgColor.element).addClass("colorInput").attr("id", "bkgColorInput");
    	j(settings.manifest.textColor.element).addClass("colorInput").attr("id", "textColorInput");
    	
    	j("<div class='colorSelect'><div></div></div>").insertAfter(".colorInput");
    	
    	j(".colorSelect").each(function(){
			var input = j(this).parent().find("input");
			j(this).find("div").css("backgroundColor", input.val());
    	});
    	    	
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
			}    		
    	});
    });
});
