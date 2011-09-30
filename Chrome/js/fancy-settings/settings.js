window.addEvent("domready", function () {
    // Option 1: Use the manifest:
    new FancySettings.initWithManifest(function (settings) {
    	j(settings.manifest.bkgColor.element).addClass("colorInput");
    	j(settings.manifest.textColor.element).addClass("colorInput");
    	
    	j("<div class='colorSelect'><div></div></div>").insertAfter(".colorInput");
    	
    	j(".colorSelect").each(function(){
			var input = j(this).parent().find(".colorInput");
			j(this).find("div").css("backgroundColor", input.val());
    	});
    	    	
    	j(".colorSelect").ColorPicker({
    	});
    });
});
