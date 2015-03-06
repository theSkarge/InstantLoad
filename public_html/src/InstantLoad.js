/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function($, global) {
    /*
     * Namespace declaration
     */
    if (typeof InstantLoad === "undefined") {
        InstantLoad = global.InstantLoad = {};
    }
    
    
    /*
     * Private variables
     */
    var contentSection  = null;
    var fadeTime        = 100;
    
    
    /*
     * Main Implementation
     */
    var Main = {
        
        /**
         * Initializing function
         * 
         * @returns void
         */
        init: function () { 
           if (contentSection === null)
                contentSection = "#content";

            this.parseLinks();

            window.onpopstate = function (e) {
                e.preventDefault();
                var href = e.originalTarget.document.URL;
                InstantLoad.loadPage(href);
            };
        },


        /**
         * Parse current a tags for links and place click handler
         * 
         * @returns void
         */
        parseLinks: function () {
            $("a").each(function () {
                if (typeof $(this).attr("href") !== "undefined" && $(this).attr("target") !== "_blank" && $(this).attr("data-il-ignore") !== true && $(this).attr("data-il-ignore") !== "1") {
                    $(this).click(function (e) {
                        e.preventDefault();
                        
                        if (typeof $(this).attr("data-il-callbackFn") !== "undefined") {
                            InstantLoad.loadPage($(this).attr("href"), $(this).attr("data-il-callbackFn"), true);
                        }
                        else
                            InstantLoad.loadPage($(this).attr("href"));
                        
                    });
                }
            });
        },


        /**
         * Load given URL and display retreived content into contentSection. 
         * If defined callbackFn will be called.
         * 
         * @param string href
         * @param function callbackFn
         * @param boolean globalFn
         * @returns void
         */
        loadPage: function (href, callbackFn, globalFn) {
            if (href !== "") {
                this.addHistory(this.prepareHistoryHref(href));
                $.ajax({
                    type:   "get",
                    url:    href + "?instant=1",
                    cache:  false,
                    async:  false,
                    success: function (data) {
                        var contentSection = InstantLoad.getContentSection();
                        var fadeTime = InstantLoad.getFadeTime();

                        $(contentSection).fadeOut(fadeTime, function () {
                            $(contentSection).html(data);
                            if (typeof callbackFn !== "undefined") {
                                if (globalFn === true) {
                                    InstantLoad.callFn(callbackFn);
                                }
                                else
                                    callbackFn();
                            }
                            $(contentSection).fadeIn(fadeTime, function () {
                                InstantLoad.parseLinks();
                            });
                        });
                    },
                    error: function () {
                        alert ("Error");
                    }
                });
            }
        },

        
        /**
         * Add URL to History API
         * 
         * @param string href
         * @returns void
         */
        addHistory: function (href) {
            history.pushState(null, null, href);
        },


        /**
         * Get currently used content section ID
         * 
         * @returns string
         */
        getContentSection: function () {
            return contentSection;
        },


        /**
         * Set new content section ID
         * 
         * @param string section
         * @returns void
         */
        setContentSection: function (section) {
            contentSection = section;
        },


        /**
         * Get current fade time value
         * 
         * @returns integer
         */
        getFadeTime: function () {
            return fadeTime;
        },

        /**
         * Set new fade time
         * 
         * @param integer fadeTime
         * @returns void
         */
        setFadeTime: function (fadeTime) {
            fadeTime = fadeTime;
        },
        
        
        /**
         * Prepares a href string for use in history, removing all unwanted stuff (like instant=1)
         * 
         * @param string href
         * @returns string
         */
        prepareHistoryHref: function (href) {
            href = href.replace("?instant=1", "");
            href = href.replace("&instant=1", "");
            
            return href;
        },
        
        
        /**
         * Possibility to call global functions
         * 
         * @param string id
         * @returns void
         */
        callFn: function (id) {
            var objects = id.split(".");
            var obj = window;

            for (var i = 0, len = objects.length; i < len && obj; i++)
                obj = obj[objects[i]];

            if (typeof obj === "function")
                obj();
        }
    };
    
    
    /*
     * Extend global InstantLoad object with Main implementation
     */
    $.extend(InstantLoad, Main);
    
})(jQuery, this);