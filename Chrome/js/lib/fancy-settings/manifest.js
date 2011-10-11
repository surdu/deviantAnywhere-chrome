// SAMPLE
this.manifest = {
    "name": "deviantAnywhere settings",
    "icon": "/img/fella_icon.png",
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
            "name": "showFella",
            "type": "checkbox",
            "label": i18n.get("showFella")
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
            "group": i18n.get("notifyMsgLabel"),
            "name": "followNotices",
            "type": "checkbox",
            "label": i18n.get("msgNotices")
        },

        {
            "tab": i18n.get("behave"),
            "group": i18n.get("notifyMsgLabel"),
            "name": "followNotices",
            "type": "checkbox",
            "label": i18n.get("msgActivity")
        },

        {
            "tab": i18n.get("behave"),
            "group": i18n.get("notifyMsgLabel"),
            "name": "followReplies",
            "type": "checkbox",
            "label": i18n.get("msgReplies")
        },

        {
            "tab": i18n.get("behave"),
            "group": i18n.get("notifyMsgLabel"),
            "name": "followNotes",
            "type": "checkbox",
            "label": i18n.get("msgNotes")
        },

        {
            "tab": i18n.get("behave"),
            "group": i18n.get("notifyMsgLabel"),
            "name": "followJournals",
            "type": "checkbox",
            "label": i18n.get("msgJournals")
        },

        {
            "tab": i18n.get("behave"),
            "group": i18n.get("notifyMsgLabel"),
            "name": "followComments",
            "type": "checkbox",
            "label": i18n.get("msgComments")
        },

        {
            "tab": i18n.get("behave"),
            "group": i18n.get("notifyMsgLabel"),
            "name": "followDeviations",
            "type": "checkbox",
            "label": i18n.get("msgDeviations")
        },

        {
            "tab": i18n.get("behave"),
            "group": i18n.get("notifyMsgLabel"),
            "name": "followPolls",
            "type": "checkbox",
            "label": i18n.get("msgPolls")
        },

        {
            "tab": i18n.get("behave"),
            "group": i18n.get("notifyMsgLabel"),
            "name": "followContest",
            "type": "checkbox",
            "label": i18n.get("msgContest")
        },

        {
            "tab": i18n.get("behave"),
            "group": i18n.get("notifyMsgLabel"),
            "name": "followNews",
            "type": "checkbox",
            "label": i18n.get("msgNews")
        },

        {
            "tab": i18n.get("behave"),
            "group": i18n.get("notifyMsgLabel"),
            "name": "followAdmin",
            "type": "checkbox",
            "label": i18n.get("msgAdmin")
        },

        {
            "tab": i18n.get("behave"),
            "group": i18n.get("notifyMsgLabel"),
            "name": "followCritiques",
            "type": "checkbox",
            "label": i18n.get("msgCritiques")
        },

        {
            "tab": i18n.get("behave"),
            "group": i18n.get("notifyMsgLabel"),
            "name": "followCorrespondence",
            "type": "checkbox",
            "label": i18n.get("msgCorrespondence")
        },

        {
            "tab": i18n.get("behave"),
            "group": i18n.get("notifyMsgLabel"),
            "name": "followSupport",
            "type": "checkbox",
            "label": i18n.get("msgSupport")
        },

        {
            "tab": i18n.get("behave"),
            "group": i18n.get("notifyMsgLabel"),
            "name": "followBulletin",
            "type": "checkbox",
            "label": i18n.get("msgBulletin")
        },

        {
            "tab": i18n.get("behave"),
            "group": i18n.get("notifyMsgLabel"),
            "name": "followForum",
            "type": "checkbox",
            "label": i18n.get("msgForum")
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
