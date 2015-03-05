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
                        console.log("Link: " + $(this).attr("href"));
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
         * @returns void
         */
        loadPage: function (href, callbackFn) {
            if (href !== "") {
                this.addHistory(href);
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
        }
    };
    
    
    /*
     * Extend global InstantLoad object with Main implementation
     */
    $.extend(InstantLoad, Main);
    
})(jQuery, this);