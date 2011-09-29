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
            "name": "bkgcolor",
            "type": "text",
            "label": i18n.get("bkgColor")+":"
        },

        {
            "tab": i18n.get("look"),
            "group": i18n.get("colors"),
            "name": "textcolor",
            "type": "text",
            "label": i18n.get("textColor")+":"
        },

    ]
};
