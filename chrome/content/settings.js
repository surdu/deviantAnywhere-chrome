function deviantAnywhereSettings()
{
//    this.passwordManager = Components.classes["@mozilla.org/login-manager;1"].getService(Components.interfaces.nsILoginManager);
}

deviantAnywhereSettings.prototype =
{
    getMajorVer: function(ver)
    {
        return ver.substr(0,ver.indexOf("."));
    },

    init: function()
    {
	    ver = Components.classes["@mozilla.org/extensions/manager;1"]
	          .getService(Components.interfaces.nsIExtensionManager)
	          .getItemForID("deviantAnywhere@cvds.ro").version;
	    document.getElementById("aboutProdVer").setAttribute("value", "v"+ver)


        document.getElementById("password").value = ro_cvds_daUtils.getUserData()?ro_cvds_daUtils.getUserData().password:"";
        this.handleActionClick();
        this.handleAutoLoginClick();
        this.handleSoundClick();
        this.handleCustomLookClick();
        this.handleAutoUpdateClick();


        info = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo);
        if (info.name=="Firefox" && this.getMajorVer(info.version)<3)
        {
            ro_cvds_daUtils.setPref("useautologin",false,ro_cvds_daUtils.boolPref);
            document.getElementById("autoLoginLabel").setAttribute("label","Automatic login (not available in Firefox "+info.version+")");
            document.getElementById("autoLoginCheck").setAttribute("disabled","true");
        }
		else
		{
		    this.nsLoginInfo = new Components.Constructor("@mozilla.org/login-manager/loginInfo;1",Components.interfaces.nsILoginInfo,"init");
		    this.myLoginManager = Components.classes["@mozilla.org/login-manager;1"].getService(Components.interfaces.nsILoginManager);
		}

		var osString = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime).OS;
		if (osString=="Darwin")
			document.getElementById("winButtons").style.display = "block";
		
		consoleBox = document.getElementById("statusConsole");
		consoleBox.value = "Temporarily disabled the log due to the fact that it might create some issues.";
    },

    setDefaultBkg: function()
    {
        document.getElementById('bkgColor').color = '#728776';
    },


    setDefaultText: function()
    {
        document.getElementById('textColor').color = '#FFFFFF';
    },

    handleActionClick: function()
    {
        document.getElementById("focusCheck").disabled = !ro_cvds_daUtils.getPref("openMsgOnNew",ro_cvds_daUtils.boolPref);;
    },

    handleCustomLookClick: function()
    {
        document.getElementById("bkgColorLabel").disabled =
        document.getElementById("bkgColor").disabled =
        document.getElementById("defultBkg").disabled =
        document.getElementById("textColorLabel").disabled =
        document.getElementById("textColor").disabled =
        document.getElementById("defultText").disabled = !ro_cvds_daUtils.getPref("customLook",ro_cvds_daUtils.boolPref);
    },

    handleAutoLoginClick: function()
    {
        document.getElementById("usernameLabel").disabled =
        document.getElementById("username").disabled =
        document.getElementById("passwordLabel").disabled =
        document.getElementById("password").disabled = !ro_cvds_daUtils.getPref("useautologin",ro_cvds_daUtils.boolPref);
    },

    handleAutoUpdateClick: function()
    {
        document.getElementById("checkTimeLabel").disabled =
        document.getElementById("checktime").disabled =
        document.getElementById("checkTimeSuffix").disabled = !ro_cvds_daUtils.getPref("autoupdate",ro_cvds_daUtils.boolPref);
    },

    handleSoundClick: function()
    {
        document.getElementById("soundLabel").disabled =
        document.getElementById("sound").disabled = !ro_cvds_daUtils.getPref("playsound",ro_cvds_daUtils.boolPref);
    },

    doOK: function()
    {
        user = document.getElementById("username").value;
        pass = document.getElementById("password").value;
        useThem = document.getElementById("autoLoginCheck").checked;

        if (useThem)
        {
            if (user && pass)
            {
                loginData = new this.nsLoginInfo('chrome://deviantAnywhere','User auto-login', null,"Main User", pass, "", "");
                if (ro_cvds_daUtils.getUserData())
                    this.myLoginManager.removeLogin(ro_cvds_daUtils.getUserData());
                this.myLoginManager.addLogin(loginData);
            }
            else
            {
                alert("You must fill both 'Deviant name' and 'Password' fields");
                return false;
            }
        }

        bkgColor = document.getElementById("bkgColor").color;
        textColor = document.getElementById("textColor").color;

        ro_cvds_daUtils.setPref("bkgcolor",bkgColor,ro_cvds_daUtils.stringPref);
        ro_cvds_daUtils.setPref("textcolor",textColor,ro_cvds_daUtils.stringPref);

        browserWindow = Components.classes["@mozilla.org/appshell/window-mediator;1"]
                        .getService(Components.interfaces.nsIWindowMediator)
                        .getMostRecentWindow("navigator:browser");

        var panel = browserWindow.document.getElementById("dAPanel");
        if (ro_cvds_daUtils.getPref("customLook",ro_cvds_daUtils.boolPref))
        {
            if (ro_cvds_daUtils.getPref("showIcon",ro_cvds_daUtils.boolPref))
                panel.setAttribute("showIcon","true");
            else
                panel.removeAttribute("showIcon");
            panel.setAttribute("class","customLook");
            panel.style.backgroundColor = bkgColor;
            panel.style.borderColor = bkgColor;
            panel.style.color = textColor;
        }
        else
        {
            panel.removeAttribute("class");
            panel.style.color = "black";
        }
		
		var logo = browserWindow.document.getElementById("daLogo");
		if (ro_cvds_daUtils.getPref("showIcon",ro_cvds_daUtils.boolPref))
			logo.style.display = "inline";
		else
			logo.style.display = "none";
    }
}

ro_cvds_dASettings = new deviantAnywhereSettings();
