function debug(text)
{
	dump(text+"\n");
}

function deviantAnywhereUtils()
{
    this.boolPref = 1;
    this.intPref = 2;
    this.stringPref = 3;
}

deviantAnywhereUtils.prototype =
{
    getUserData: function()
    {
        try
        {
            var myLoginManager = Components.classes["@mozilla.org/login-manager;1"].getService(Components.interfaces.nsILoginManager);
            var logins = myLoginManager.findLogins({}, "chrome://deviantAnywhere", "User auto-login", null);
            for (var i = 0; i < logins.length; i++)
              if (logins[i].username == "Main User")
                 return logins[i];
        }
        catch(e)
        {
            return null;
        }
        return null;
    },

    getPref: function(prefName,prefType)
    {
        var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
        branch = prefs.getBranch("deviantAnywhere.");
        try
        {
            if (prefType==this.boolPref)
                return branch.getBoolPref(prefName);
            else
            if (prefType==this.intPref)
                return branch.getIntPref(prefName);
            else
                return branch.getCharPref(prefName);
        }
        catch(e)
        {
            return null;
        }
    },

    setPref: function(prefName, prefValue, prefType)
    {
        var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);

        if (prefType==this.boolPref)
            prefs.setBoolPref("deviantAnywhere."+prefName,prefValue);
        else
        if (prefType==this.intPref)
            prefs.setIntPref("deviantAnywhere."+prefName,prefValue);
        else
            prefs.setCharPref("deviantAnywhere."+prefName,prefValue);
    },

    array2JSON: function(array)
    {
        result = "{";
        isFirst = true;
        for (_key in array)
        {
            if (!isFirst)
                result += ",";
            else
                isFirst = false;
            result += _key+":"+array[_key];
        }
        result += "}";
        return result;
    },

    JSON2array: function(json)
    {
        result = new Array();
        if (json!=null && json!="")
        {
            json = json.replace(/{|}/g,"");
            elements = json.split(",");
            for (f=0;f<elements.length;f++)
            {
                parts = elements[f].split(":");
                result[parts[0]] = parts[1];
            }
        }
        return result;
    }
}

var ro_cvds_daUtils = new deviantAnywhereUtils();
