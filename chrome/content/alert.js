function deviantAnywhereNotifier()
{
    this.finalHeight;
    this.heightSoFar=0;

    this.animTime = 15;
    this.showTime = 5000;

    this.closeTimer;
    this.shouldAutoClose = true;
}

deviantAnywhereNotifier.prototype =
{
    mouseIn: function()
    {
        this.shouldAutoClose = false;
        clearTimeout(this.closeTimer);
    },

    mouseOut: function(event)
    {
        this.shouldAutoClose = true;
//        closeTimer = seTimeout("ro_cvds_dANotifier.animClose()",this.showTime/2);
    },

    initNotifier: function()
    {

        this.initContent()
        sizeToContent();
        this.finalHeight = window.outerHeight;
        window.outerHeight = 0;
        window.moveTo(screen.availLeft + screen.availWidth - window.outerWidth, screen.availHeight - window.outerHeight);
//        seTimeout("ro_cvds_dANotifier.animOpen()",this.animTime);
    },

    initContent: function()
    {
        o = window.opener

        notifyContent = document.getElementById("notificationContent");


        label = document.createElement("label");
        label.setAttribute("id","title");
        label.setAttribute("value","deviantAnywhere");
        notifyContent.appendChild(label);

        items = o.ro_cvds_daInstance.prev_deviations;
        for(f=0;f<items.length;f++)
        {
            box = document.createElement("box");
            box.setAttribute("class","entry deviation");

            label1 = document.createElement("label");
            label1.setAttribute("value",items[f][0]);
            label1.setAttribute("class","text-link");
            label1.setAttribute("href",items[f][1]);
            label1.setAttribute("onclick","window.opener.openURL(this.getAttribute('href'),true);return false;");
            box.appendChild(label1);

            label2 = document.createElement("label");
            label2.setAttribute("value","submitted deviation");
            box.appendChild(label2);

            label3 = document.createElement("label");
            label3.setAttribute("value",items[f][2]);
            label3.setAttribute("class","text-link");
            label3.setAttribute("href",items[f][3]);
            label3.setAttribute("onclick","window.opener.openURL(this.getAttribute('href'),true);return false;");
            box.appendChild(label3);

            notifyContent.appendChild(box);
        }

        items = o.ro_cvds_daInstance.prev_notes;
        for(f=0;f<items.length;f++)
        {
            box = document.createElement("box");
            box.setAttribute("class","entry note");

            label1 = document.createElement("label");
            label1.setAttribute("value",items[f][0]);
            label1.setAttribute("class","text-link");
            label1.setAttribute("href",items[f][1]);
            label1.setAttribute("onclick","window.opener.openURL(this.getAttribute('href'),true);return false;");
            box.appendChild(label1);

            label2 = document.createElement("label");
            label2.setAttribute("value","sent you the note");
            box.appendChild(label2);

            label3 = document.createElement("label");
            label3.setAttribute("value",items[f][2]);
            label3.setAttribute("class","text-link");
            label3.setAttribute("href",items[f][3]);
            label3.setAttribute("onclick","window.opener.openURL(this.getAttribute('href'),true);return false;");
            box.appendChild(label3);

            notifyContent.appendChild(box);
        }

        items = o.ro_cvds_daInstance.prev_favs;
        for(f=0;f<items.length;f++)
        {
            box = document.createElement("box");
            box.setAttribute("class","entry fav");

            label1 = document.createElement("label");
            label1.setAttribute("value",items[f][0]);
            label1.setAttribute("class","text-link");
            label1.setAttribute("href",items[f][1]);
            label1.setAttribute("onclick","window.opener.openURL(this.getAttribute('href'),true);return false;");
            box.appendChild(label1);

            label2 = document.createElement("label");
            label2.setAttribute("value","has added");
            box.appendChild(label2);

            label3 = document.createElement("label");
            label3.setAttribute("value",items[f][2]);
            label3.setAttribute("class","text-link");
            label3.setAttribute("href",items[f][3]);
            label3.setAttribute("onclick","window.opener.openURL(this.getAttribute('href'),true);return false;");
            box.appendChild(label3);

            label4 = document.createElement("label");
            label4.setAttribute("value","to their");
            box.appendChild(label4);

            label5 = document.createElement("label");
            label5.setAttribute("value",items[f][4]);
            label5.setAttribute("class","text-link");
            label5.setAttribute("href",items[f][5]);
            label5.setAttribute("onclick","window.opener.openURL(this.getAttribute('href'),true);return false;");
            box.appendChild(label5);

            notifyContent.appendChild(box);
        }

        items = o.ro_cvds_daInstance.prev_watch;
        for(f=0;f<items.length;f++)
        {
            box = document.createElement("box");
            box.setAttribute("class","entry watch");

            label1 = document.createElement("label");
            label1.setAttribute("value",items[f][0]);
            label1.setAttribute("class","text-link");
            label1.setAttribute("href",items[f][1]);
            label1.setAttribute("onclick","window.opener.openURL(this.getAttribute('href'),true);return false;");
            box.appendChild(label1);

            label2 = document.createElement("label");
            label2.setAttribute("value","has added you to their deviantWATCH");
            box.appendChild(label2);

            notifyContent.appendChild(box);
        }

        items = o.ro_cvds_daInstance.prev_comments;
        for(f=0;f<items.length;f++)
        {
            box = document.createElement("box");
            box.setAttribute("class","entry message");

            label1 = document.createElement("label");
            label1.setAttribute("value",items[f][0]);
            label1.setAttribute("class","text-link");
            label1.setAttribute("href",items[f][1]);
            label1.setAttribute("onclick","window.opener.openURL(this.getAttribute('href'),true);return false;");
            box.appendChild(label1);

            label2 = document.createElement("label");
            label2.setAttribute("value","posted a");
            box.appendChild(label2);

            label3 = document.createElement("label");
            label3.setAttribute("value","comment");
            label3.setAttribute("class","text-link");
            label3.setAttribute("href",items[f][4]);
            label3.setAttribute("onclick","window.opener.openURL(this.getAttribute('href'),true);return false;");
            box.appendChild(label3);

            label4 = document.createElement("label");
            label4.setAttribute("value","on");
            box.appendChild(label4);

            label5 = document.createElement("label");
            label5.setAttribute("value",items[f][2]);
            label5.setAttribute("class","text-link");
            label5.setAttribute("href",items[f][3]);
            label5.setAttribute("onclick","window.opener.openURL(this.getAttribute('href'),true);return false;");
            box.appendChild(label5);

            notifyContent.appendChild(box);
        }

        items = o.ro_cvds_daInstance.prev_critiques;
        for(f=0;f<items.length;f++)
        {
            box = document.createElement("box");
            box.setAttribute("class","entry critique");

            label1 = document.createElement("label");
            label1.setAttribute("value",items[f][0]);
            label1.setAttribute("class","text-link");
            label1.setAttribute("href",items[f][1]);
            label1.setAttribute("onclick","window.opener.openURL(this.getAttribute('href'),true);return false;");
            box.appendChild(label1);

            label2 = document.createElement("label");
            label2.setAttribute("value","posted a");
            box.appendChild(label2);

            label3 = document.createElement("label");
            label3.setAttribute("value","critique");
            label3.setAttribute("class","text-link");
            label3.setAttribute("href",items[f][2]);
            label3.setAttribute("onclick","window.opener.openURL(this.getAttribute('href'),true);return false;");
            box.appendChild(label3);

            label4 = document.createElement("label");
            label4.setAttribute("value","of");
            box.appendChild(label4);

            label5 = document.createElement("label");
            label5.setAttribute("value",items[f][4]);
            label5.setAttribute("class","text-link");
            label5.setAttribute("href",items[f][3]);
            label5.setAttribute("onclick","window.opener.openURL(this.getAttribute('href'),true);return false;");
            box.appendChild(label5);

            label6 = document.createElement("label");
            label6.setAttribute("value","by");
            box.appendChild(label6);

            label7 = document.createElement("label");
            label7.setAttribute("value",items[f][5]);
            label7.setAttribute("class","text-link");
            label7.setAttribute("href",items[f][6]);
            label7.setAttribute("onclick","window.opener.openURL(this.getAttribute('href'),true);return false;");
            box.appendChild(label7);


            notifyContent.appendChild(box);
        }

        items = o.ro_cvds_daInstance.prev_journals;
        for(f=0;f<items.length;f++)
        {
            box = document.createElement("box");
            box.setAttribute("class","entry journal");

            label1 = document.createElement("label");
            label1.setAttribute("value",items[f][0]);
            label1.setAttribute("class","text-link");
            label1.setAttribute("href",items[f][1]);
            label1.setAttribute("onclick","window.opener.openURL(this.getAttribute('href'),true);return false;");
            box.appendChild(label1);

            label2 = document.createElement("label");
            label2.setAttribute("value","wrote journal entry");
            box.appendChild(label2);

            label3 = document.createElement("label");
            label3.setAttribute("value",items[f][2]);
            label3.setAttribute("class","text-link");
            label3.setAttribute("href",items[f][3]);
            label3.setAttribute("onclick","window.opener.openURL(this.getAttribute('href'),true);return false;");
            box.appendChild(label3);

            notifyContent.appendChild(box);
        }


    },

    animOpen: function()
    {
        if (this.heightSoFar<this.finalHeight)
        {
            window.screenY -= 1 - screen.availTop;
            this.heightSoFar++;
            window.outerHeight = this.heightSoFar;
//            seTimeout("ro_cvds_dANotifier.animOpen()",this.animTime);
        }
        else
            if (this.shouldAutoClose)
//                closeTimer = seTimeout("ro_cvds_dANotifier.animClose()",this.showTime);
    },

    animClose: function()
    {
        if (this.heightSoFar>0)
        {
            this.heightSoFar--;
            window.screenY += 1 + screen.availTop;
            window.outerHeight = this.heightSoFar;
//            seTimeout("ro_cvds_dANotifier.animClose()",this.animTime);
        }
        else
            window.close();
    }
}

ro_cvds_dANotifier = new deviantAnywhereNotifier();
