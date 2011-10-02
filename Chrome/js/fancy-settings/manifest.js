// SAMPLE
this.manifest = {
    "name": "deviantAnywhere settings",
    "icon": "/img/fella_icon.png",
    "settings": [
        {
            "tab": i18n.get("look"),
            "group": i18n.get("colors"),
            "name": "customLook",
            "type": "checkbox",
            "label": i18n.get("usecolors")
        },

        {
            "tab": i18n.get("look"),
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
            "label": i18n.get("chooseSound")
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
            "tab": i18n.get("connect"),
            "group": i18n.get("autoupdate"),
            "name": "autoupdate",
            "type": "checkbox",
            "label": i18n.get("useautoupdate")
        },

        {
            "tab": i18n.get("connect"),
            "group": i18n.get("autoupdate"),
            "name": "checkTime",
            "type": "text",
            "label": i18n.get("checkMsg")
        },

        {
            "tab": i18n.get("connect"),
            "group": i18n.get("autoLogin"),
            "name": "useautologin",
            "type": "checkbox",
            "label": i18n.get("useAutoLogin")
        },

        {
            "tab": i18n.get("connect"),
            "group": i18n.get("autoLogin"),
            "name": "deviantName",
            "type": "text",
            "label": i18n.get("deviantName")
        },
        {
            "tab": i18n.get("connect"),
            "group": i18n.get("autoLogin"),
            "name": "password",
            "type": "text",
            "label": i18n.get("pass")
        },


    ],
    "alignment": [
        [
            "deviantName",
            "password"
        ],
    ]
};
