var defaults = {
    
    "lastMessages": "[]",
    
    "autoupdate": true,
    "checkTime": 5,
    "useAutoLogin": false,
    "openInbox": false,
    "focusInbox": true,
    "openNotification": true,
    "playSound": true,
    "sound": "chrome-extension://__MSG_@@extension_id__/sounds/splat.wav",
    
    "customLook": true,
    "bkgColor": "#728776",
    "textColor": "#FFFFFF",
    "showFella": true,
    
    "followNotices": true,
    "followActivity": true,
    "followReplies": true,
    "followNotes": true,
    "followJournals": true,
    "followComments": true,
    "followDeviations": true,
    "followPolls": true,
    "followContest": true,
    "followNews": true,
    "followAdmin": true,
    "followCritiques": true,
    "followCorrespondence": true,
    "followSupport": true,
    "followBulletin": true,
    "followForum": true,
};

var settings = new Store("settings", defaults);