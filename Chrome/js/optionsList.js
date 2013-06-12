this.manifest = {
    "name": "deviantAnywhere options",
    "icon": "/img/icons/fella_48.png",
    "settings": [
        {
            "tab": i18n.get("look"),
            "icon": "look",
            "group": i18n.get("colors"),
            "name": "bkgColor",
            "type": "text",
            "label": i18n.get("bkgColor")+":"
        },

        {
            "tab": i18n.get("look"),
            "group": i18n.get("colors"),
            "name": "textColor",
            "type": "text",
            "label": i18n.get("textColor")+":"
        },

        {
            "tab": i18n.get("look"),
            "group": i18n.get("colors"),
            "name": "newTextColor",
            "type": "text",
            "label": i18n.get("newTextColor")+":"
        },

        {
            "tab": i18n.get("behave"),
            "icon": "behave",
            "group": i18n.get("receiveMsg"),
            "name": "openInbox",
            "type": "checkbox",
            "label": i18n.get("openInbox")
        },

        {
            "tab": i18n.get("behave"),
            "group": i18n.get("receiveMsg"),
            "name": "focusInbox",
            "type": "checkbox",
            "label": i18n.get("focusInbox")
        },

        {
            "tab": i18n.get("behave"),
            "group": i18n.get("sound"),
            "name": "playSound",
            "type": "checkbox",
            "label": i18n.get("playSound")
        },

        {
            "tab": i18n.get("behave"),
            "group": i18n.get("sound"),
            "name": "sound",
            "type": "popupButton",
            "label": i18n.get("chooseSound")+":",
            "options":[
            	[ "chrome-extension://__MSG_@@extension_id__/sounds/splat.wav", "Splat"],
            	[ "chrome-extension://__MSG_@@extension_id__/sounds/mix.wav", "Mix"],
            	[ "chrome-extension://__MSG_@@extension_id__/sounds/slice.wav", "Slice"],
            	[ "chrome-extension://__MSG_@@extension_id__/sounds/zing.wav", "Zing"],
            ]
        },

        {
            "tab": i18n.get("behave"),
            "group": i18n.get("sound"),
            "name": "previewSound",
            "type": "button",
            "text": i18n.get("previewSound")
        },

        {
            "tab": i18n.get("behave"),
            "group": i18n.get("widget"),
            "name": "noMsgLook",
            "type": "radioButtons",
            options:[
                ["0", i18n.get("justIcon")],
                ["1", i18n.get("hideWidget")],
                ["2", i18n.get("customText")]
            ],
            "label": i18n.get("noMsgText")
        },

        {
            "tab": i18n.get("behave"),
            "group": i18n.get("widget"),
            "name": "noMsgText",
            "type": "text"
        },

        {
            "tab": i18n.get("connect"),
            "icon": "connect",
            "group": i18n.get("autoupdate"),
            "name": "autoupdate",
            "type": "checkbox",
            "label": i18n.get("useautoupdate")
        },

        {
            "tab": i18n.get("connect"),
            "group": i18n.get("autoupdate"),
            "name": "checkTime",
            "type": "number",
            "min": 1,
            "step": 1,
            "postLabel": "minutes",
            "label": i18n.get("checkMsg")+":"
        },

        {
            "tab": i18n.get("connect"),
            "group": i18n.get("autoLogin"),
            "name": "useAutoLogin",
            "type": "checkbox",
            "label": i18n.get("useAutoLogin")
        },

        {
            "tab": i18n.get("connect"),
            "group": i18n.get("autoLogin"),
            "name": "username",
            "type": "text",
            "label": i18n.get("username")+":"
        },
        {
            "tab": i18n.get("connect"),
            "group": i18n.get("autoLogin"),
            "name": "password",
            "type": "text",
            "masked": true,
            "label": i18n.get("pass")+":"
        }
    ],
    "alignment": [
        [
            "username",
            "password"
        ],
    ]
};

var groups = JSON.parse(localStorage.getItem("store.settings.groups")) || {};

if (groups)
	for (var iid in groups)
	{
		this.manifest.settings.push({
		            "tab": i18n.get("interests"),
		            "icon": "interests",
		            "group": i18n.get("groupFollow"),
		            "name": "followGroup_"+iid,
		            "type": "checkbox",
		            "label": groups[iid]
		});	
		
		this.manifest.settings.push({
		            "tab": i18n.get("look"),
		            "group": groups[iid],
		            "name": "bkgColor_"+iid,
		            "type": "text",
		            "label": i18n.get("bkgColor")+":"
		});	

		this.manifest.settings.push({
		            "tab": i18n.get("look"),
		            "group": groups[iid],
		            "name": "textColor_"+iid,
		            "type": "text",
		            "label": i18n.get("textColor")+":"
		});	

		this.manifest.settings.push({
		            "tab": i18n.get("look"),
		            "group": groups[iid],
		            "name": "newTextColor_"+iid,
		            "type": "text",
		            "label": i18n.get("newTextColor")+":"
		});	

	}
else
	this.manifest.settings.push({
	            "tab": i18n.get("look"),
	            "group": i18n.get("gcolors"),
	            "type": "description",
	            "text": "Once deviantArt syncs with your account, here you'll be able to colorize all your grups."
	});	

for (var name in messagesInfo)
{
	this.manifest.settings.push({
	            "tab": i18n.get("interests"),
	            "icon": "interests",
	            "group": i18n.get("notifyMsgLabel"),
	            "name": messagesInfo[name].pref,
	            "type": "checkbox",
	            "label": messagesInfo[name].desc.split("::")[1]+" ("+name+")"
	});	
}
