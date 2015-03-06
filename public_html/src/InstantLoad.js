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
    var debug           = 0;
    
    var contentSection  = null;
    var changePageTitle = true;
    var pageTitleDomId  = null;
    var pageTitleBase   = null;
    
    var showFadeFx      = true;
    var fadeTime        = 100;
    
    
    function updatePageTitle () {
        if (debug === 1)
            console.log("InstantLoad::updatePageTitle()");
        
        if (changePageTitle === true) {
            if (typeof pageTitleDomId !== "undefined" && pageTitleDomId !== "") {
                var title = $("#" + pageTitleDomId).html();
                
                if (title !== "undefind")
                    document.title = pageTitleBase + title;
            }
        }
    }
    
    /*
     * Main Implementation
     */
    var Main = {
        
        /**
         * Initializing function
         * 
         * @returns {Void}
         */
        init: function () { 
            if (debug === 1)
                console.log("InstantLoad::init()");
        
           if (contentSection === null)
                contentSection = "#content";

            this.parseLinks();

            window.addEventListener("popstate", function (e) {
                e.preventDefault();
                var href = e.originalTarget.document.URL;
                InstantLoad.loadPage(href, true);
            });
        },


        /**
         * Parse current a tags for links and place click handler
         * 
         * @returns {Void}
         */
        parseLinks: function () {
            if (debug === 1)
                console.log("InstantLoad::parseLinks()");
            
            $("a").each(function () {
                if (typeof $(this).attr("href") !== "undefined" && $(this).attr("target") !== "_blank" && $(this).attr("data-il-ignore") !== true && $(this).attr("data-il-ignore") !== "1" && $(this).attr("data-il-processed") !== "1") {
                    $(this).attr("data-il-processed", "1");
                    $(this).click(function (e) {
                        e.preventDefault();
                        
                        if (typeof $(this).attr("data-il-callbackFn") !== "undefined") {
                            InstantLoad.loadPage($(this).attr("href"), false, $(this).attr("data-il-callbackFn"), true);
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
         * @param {String} href
         * @param {Function} callbackFn
         * @param {Boolean} globalFn
         * @returns {Void}
         */
        loadPage: function (href, noHistory, callbackFn, globalFn) {
            if (debug === 1)
                console.log("InstantLoad::loadPage()");
            
            if (href !== "") {
                if (typeof noHistory === "undefined" || noHistory !== true)
                    noHistory = false;
                
                $.ajax({
                    type:   "get",
                    url:    href + "?instant=1",
                    cache:  false,
                    async:  false,
                    success: function (data) {
                        var contentSection = InstantLoad.getContentSection();
                        var fadeTime = InstantLoad.getFadeTime();

                        if (noHistory !== true) {
                            InstantLoad.addHistory(data, "", InstantLoad.prepareHistoryHref(href));
                        }

                        if (showFadeFx === true) {
                            $(contentSection).fadeOut(fadeTime, function () {
                                $(contentSection).html(data);
                                updatePageTitle();
                                
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
                        }
                        else {
                            $(contentSection).html(data);
                            updatePageTitle();
                            
                            if (typeof callbackFn !== "undefined") {
                                if (globalFn === true) {
                                    InstantLoad.callFn(callbackFn);
                                }
                                else
                                    callbackFn();
                            }
                            
                            InstantLoad.parseLinks();
                        }
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
         * @param {String} href
         * @returns {Void}
         */
        addHistory: function (data, title, href) {
            if (debug === 1)
                console.log("InstantLoad::addHistory()");
            
            history.pushState(data, title, href);
        },


        /**
         * Get currently used content section ID
         * 
         * @returns {String}
         */
        getContentSection: function () {
            if (debug === 1)
                console.log("InstantLoad::getContentSection()");
            
            return contentSection;
        },


        /**
         * Set new content section ID
         * 
         * @param {String} section
         * @returns {Void}
         */
        setContentSection: function (section) {
            if (debug === 1)
                console.log("InstantLoad::setContentSection()");
            
            contentSection = section;
        },


        /**
         * Get current fade time value
         * 
         * @returns {Number}
         */
        getFadeTime: function () {
            if (debug === 1)
                console.log("InstantLoad::getFadeTime()");
            
            return fadeTime;
        },

        /**
         * Set new fade time
         * 
         * @param {Integer} fadeTime
         * @returns {Void}
         */
        setFadeTime: function (newFadeTime) {
            if (debug === 1)
                console.log("InstantLoad::setFadeTime('" + newFadeTime + "')");
            
            fadeTime = newFadeTime;
        },
        
        
        /**
         * Get current DOM id to get the page title from
         * 
         * @returns {String}
         */
        getPageTitleDomId: function () {
            if (debug === 1)
                console.log("InstantLoad::getPageTitleDomId()");
            
            return pageTitleDomId;
        },
        
        /**
         * Set the new DOM id for future page title loadings
         * 
         * @param {String} newPageTitleDomId
         * @returns {Void}
         */
        setPageTitleDomId: function (newPageTitleDomId) {
            if (debug === 1)
                console.log("InstantLoad::setPageTitleDomId('" + newPageTitleDomId + "')");
            
            pageTitleDomId = newPageTitleDomId;
        },
        
        
        /**
         * Get current DOM id to get the page title from
         * 
         * @returns {String}
         */
        getPageTitleBase: function () {
            if (debug === 1)
                console.log("InstantLoad::getPageTitleBase()");
            
            return pageTitleBase;
        },
        
        /**
         * Set the new DOM id for future page title loadings
         * 
         * @param {String} newPageTitleBase
         * @returns {Void}
         */
        setPageTitleBase: function (newPageTitleBase) {
            if (debug === 1)
                console.log("InstantLoad::init()");
            
            pageTitleBase = newPageTitleBase;
        },
        
        
        /**
         * Prepares a href string for use in history, removing all unwanted stuff (like instant=1)
         * 
         * @param {String} href
         * @returns {String}
         */
        prepareHistoryHref: function (href) {
            if (debug === 1)
                console.log("InstantLoad::prepareHistoryHref()");
            
            href = href.replace("?instant=1", "");
            href = href.replace("&instant=1", "");
            
            return href;
        },
        
        
        /**
         * 
         * 
         * @param {String} id
         * @returns {Void}
         */
        callFn: function (id) {
            if (debug === 1)
                console.log("InstantLoad::callFn()");
            
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