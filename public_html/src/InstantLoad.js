/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var InstantLoad = {

    contentSection: null,
    fadeTime:       100,

    init: function () {
        if (this.contentSection === null)
            this.contentSection = "#content";

        this.parseLinks();

        window.onpopstate = function (e) {
            e.preventDefault();
            var href = e.originalTarget.document.URL;
            InstantLoad.loadPage(href);
        };
    },
    
    
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
                        if (typeof callbackFn != "undefined") {
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


    addHistory: function (href) {
        history.pushState(null, null, href);
    },


    getContentSection: function () {
        return this.contentSection;
    },

    setContentSection: function (section) {
        this.contentSection = section;
    },
    
    
    getFadeTime: function () {
        return this.fadeTime;
    },
    
    setFadeTime: function (fadeTime) {
        this.fadeTime = fadeTime;
    },
};