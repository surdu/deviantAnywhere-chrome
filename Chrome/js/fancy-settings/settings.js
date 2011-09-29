window.addEvent("domready", function () {
    // Option 1: Use the manifest:
    new FancySettings.initWithManifest(function (settings) {
    	j(settings.manifest.bkgcolor.element).addClass("colorInput");
    	j(settings.manifest.textcolor.element).addClass("colorInput");
    	
    	j("<div class='colorSelect'><div></div></div>").insertAfter(".colorInput");
    	
    	j(".colorSelect").each(function(){
    		
    	});
    	    	
    	j(".colorSelect").ColorPicker({
    		
    	});
    });
});
