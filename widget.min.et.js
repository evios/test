var NDRSL = {cssLoaded: !1, targetElements: 0, totalElements: 0, containsCarousel: !1, containsWOL: !1};
NDRSL.isLocal = !(!window.location.href.includes("file://") && !window.location.href.includes("localhost")), NDRSL.createWidget = function (e, t) {
    console.log("Creating widget: " + t);
    var i = NDRSL.isLocal ? "http://localhost:3000/render/" + t + "?ref=" + encodeURIComponent(window.location.pathname) : "https://evios.github.io/test/endorsals.html" + "?ref=" + encodeURIComponent(window.location.pathname);
    if (i += e.getAttribute("ndrsl-demo") ? "&demo=true" : "", e.getAttribute("data-product-id")) {
        let t = e.attributes;
        for (let e = 0; e < t.length; e++) {
            let n = t[e];
            "data-product-description" == n.name && n.value && n.value.length > 120 && (n.value = n.value.substr(0, 120).trim() + "..."), "id" != n.name && "class" != n.name && (i += `&${n.name}=${encodeURIComponent(n.value)}`)
        }
    } else if (e.getAttribute("ndrsl-widget-type") && "squarespace" == e.getAttribute("ndrsl-widget-type")) {
        console.log("Is Squarespace");
        let e = document.getElementsByTagName("body")[0].getAttribute("id");
        if (e) {
            e = e.replace("item-", "");
            let t = document.querySelectorAll('script[type="application/ld+json"]');
            for (let n = 0; n < t.length; n++) {
                let l = JSON.parse(t[n].text);
                l["@type"] && "Product" == l["@type"] && (i += "&data-product-name=" + l.name.replace("â€” " + l.brand, "").trim(), i += "&data-product-description=" + (l.description || null), i += "&data-product-id=" + e, i += "&data-product-price=" + (l.offers.price || null), i += "&data-product-image-url=" + (l.image || null), i += "&data-product-url=" + (l.offers.url || window.location.href))
            }
        }
    }
    fetch(i).then(function (e) {
        return console.log("Data returned for widget: " + t), e.text()
    }).then(function (i) {
        i && (e.innerHTML = i, NDRSL.checkForCarousel(i), NDRSL.checkForWOL(i), NDRSL.checkForProductWidget(i, t), NDRSL.checkForImageSlider(i), NDRSL.checkForVideo(i), NDRSL.totalElements += 1)
    })
}, NDRSL.checkForCarousel = function (e) {
    e.includes("ndrsl-carousel") && (NDRSL.containsCarousel = !0)
}, NDRSL.checkForWOL = function (e) {
    e.includes("ndrsl-wall") && (NDRSL.containsWOL = !0)
}, NDRSL.checkForImageSlider = function (e) {
    e.includes("ndrsl-live-images-container-slider") && (NDRSL.containsImageSlider = !0)
}, NDRSL.checkForVideo = function (e) {
    e.includes("ndrsl-live-video-container") && (NDRSL.containsVideo = !0)
}, NDRSL.checkForProductWidget = function (e, t) {
    e.includes("ndrsl-product-reviews") && !NDRSL.ndrslRating && (NDRSL.containsProductWidget = !0, setTimeout(() => {
        NDRSL.ndrslRating = document.querySelector("div[ndrsl-rating='" + t.replace("prod-", "") + "']");
        let e = document.getElementsByTagName("h1");
        if (NDRSL.ndrslRating && e) {
            let t = e[0];
            e.length > 1 && (t = e[0]);
            let i = NDRSL.ndrslRating.cloneNode(!0);
            i.removeAttribute("itemprop"), i.removeAttribute("itemtype"), i.removeAttribute("itemscope"), t.after(i)
        }
    }, 100))
}, NDRSL.renderElements = function (e, t) {
    NDRSL.addAssets();
    for (var i = 0; i < e.length; i++) {
        var n = e[i], l = n.id.replace("ndrsl-", "");
        NDRSL.createWidget(n, l)
    }
    var o = setInterval(function () {
        var e = document.getElementsByClassName("ndrsl-widget");
        if (e && e[0] && NDRSL.totalElements == NDRSL.targetElements && NDRSL.cssLoaded) {
            clearInterval(o);
            for (var t = 0; t < e.length; t++) {
                e[t].style.display = "block"
            }
            var i;
            if (NDRSL.containsCarousel) (i = document.createElement("script")).setAttribute("type", "text/javascript"), i.setAttribute("src", NDRSL.isLocal ? "widgets/carousel.min.js" : "https://cdn.endorsal.io/widgets/carousel.min.js"), document.getElementsByTagName("body")[0].appendChild(i);
            if (NDRSL.containsWOL) console.log("Adding WOL script..."), (i = document.createElement("script")).setAttribute("type", "text/javascript"), i.setAttribute("src", NDRSL.isLocal ? "widgets/wall-of-love.js" : "https://cdn.endorsal.io/widgets/wall-of-love.min.js"), document.getElementsByTagName("body")[0].appendChild(i);
            if (NDRSL.containsProductWidget) (i = document.createElement("script")).setAttribute("type", "text/javascript"), i.setAttribute("src", NDRSL.isLocal ? "widgets/product.min.js" : "https://cdn.endorsal.io/widgets/product.min.js"), document.getElementsByTagName("body")[0].appendChild(i);
            NDRSL.containsImageSlider && setTimeout(() => {
                NDRSL.imageSliderSetup()
            }, 10), NDRSL.containsVideo && setTimeout(() => {
                NDRSL.videoSetup()
            }, 1e3)
        }
    }, 10)
}, NDRSL.imageSliderSetup = function () {
    console.log("Image slider(s) found...");
    let e = document.querySelectorAll(".ndrsl-live-images-container-slider");
    for (let t = 0; t < e.length; t++) {
        let i = e[t];
        if (i.querySelectorAll(".ndrsl-testimonial-image-preview-slide")) if (!i.getAttribute("slideNum") && i.offsetWidth) {
            i.offsetWidth > 720 && i.classList.add("side-by-side"), console.dir(i), i.slides = i.querySelectorAll(".ndrsl-testimonial-image-preview-slide"), i.dots = i.querySelectorAll(".ndrsl-pagination-dot-slider");
            for (let e = 0; e < i.slides.length; e++) {
                let t = i.slides[e];
                console.dir(e, t.offsetWidth, t), t.style.left = e * t.offsetWidth + "px", t.style.zIndex = 100 - e
            }
            if (i.setAttribute("slideNum", 0), i.slideNum = 0, i.NDRSLsetSlideNum = function (e) {
                e >= i.slides.length && (e = 0), i.setAttribute("slideNum", e), i.slideNum = e;
                for (let t = 0; t < i.slides.length; t++) {
                    let n = i.slides[t];
                    n.style.left = (t - e) * n.offsetWidth + "px", n.style.zIndex = 50, t == e && (n.style.zIndex = 100)
                }
                for (let t = 0; t < i.dots.length; t++) {
                    let n = i.dots[t];
                    n.classList.remove("active"), t == e && n.classList.add("active")
                }
            }, i.NDRSLautoplay = function (e) {
                i.stopAutoplay || setTimeout(() => {
                    i && !i.stopAutoplay && (i.NDRSLsetSlideNum(i.slideNum + 1), i.NDRSLautoplay(e))
                }, e)
            }, i.getAttribute("autoplay") && i.slides.length) {
                let e = 1e3 * parseFloat(i.getAttribute("autoplay"));
                i.NDRSLautoplay(e)
            }
        } else i.offsetWidth || setTimeout(() => {
            NDRSL.imageSliderSetup()
        }, 250)
    }
}, NDRSL.addAssets = function () {
    var e;
    (e = document.createElement("link")).setAttribute("rel", "stylesheet"), e.setAttribute("href", `${NDRSL.isLocal ? "http://localhost:3000/css/" : "https://cdn.endorsal.io/widgets/"}endorsal-testimonials.min.css`), document.getElementsByTagName("head")[0].appendChild(e), (e = document.createElement("link")).setAttribute("rel", "stylesheet"), e.setAttribute("href", `${NDRSL.isLocal ? "http://localhost:3000/css/" : "https://cdn.endorsal.io/widgets/"}widget.min.css`), document.getElementsByTagName("head")[0].appendChild(e), e.onload = function (e) {
        NDRSL.cssLoaded = !0
    }
}, NDRSL.readMore = function (e) {
    e.preventDefault();
    let t = e.target.getAttribute("fulltext"), i = e.target.parentNode;
    t && i && (i.innerHTML = '"' + decodeURIComponent(t) + '"', i.style.whiteSpace = "break-spaces");
    let n = document.querySelectorAll("#ndrsl-carousel");
    for (let e = 0; e < n.length; e++) {
        let t = n[e];
        (t && t.slideNum || 0 == t.slideNum) && t.NDRSLsetHeight(t.slideNum)
    }
}, NDRSL.go = function (e) {
    var t = NDRSL.isLocal ? "http://localhost:3000/check/fomo/" + e + "?ref=" + encodeURIComponent(window.location.href) : "https://api.endorsal.io/check/fomo/" + e + "?ref=" + encodeURIComponent(window.location.href);
    fetch(t, {headers: {"Access-Control-Allow-Origin": "*"}}).then(function (e) {
        e && e.ok && e.json().then(e => {
            if (console.log(e), e.success) {
                let t = document.createElement("script");
                t.setAttribute("type", "text/javascript"), t.setAttribute("src", NDRSL.isLocal ? "widgets/fomo.min.js" : "https://cdn.endorsal.io/widgets/fomo.min.js"), t.setAttribute("async", !0), t.setAttribute("defer", !0), t.onload = function () {
                    FOMO.init(e.data)
                }, document.getElementsByTagName("head")[0].appendChild(t)
            }
            if (e.jsonLD) {
                let t = document.createElement("script");
                t.setAttribute("type", "application/ld+json"), t.text = JSON.stringify(e.jsonLD), document.getElementsByTagName("head")[0].appendChild(t)
            }
            if (e.REVIEWHQ) {
                let t = document.createElement("script");
                t.setAttribute("type", "text/javascript"), t.setAttribute("src", NDRSL.isLocal ? "widgets/reviewhq.js" : "https://cdn.endorsal.io/widgets/reviewhq.min.js"), t.setAttribute("async", !0), t.setAttribute("defer", !0), t.onload = function () {
                    REVIEWHQ.init(e.REVIEWHQ)
                }, document.getElementsByTagName("head")[0].appendChild(t)
            }
        })
    });
    var i = document.querySelectorAll("[id^='ndrsl']:not([ndrsl-api])");
    NDRSL.targetElements = i.length, console.log("ELEMENTS:", i), i && i[0] ? NDRSL.renderElements(i, e) : setTimeout(() => {
        var t = document.querySelectorAll("[id^='ndrsl']:not([ndrsl-api])");
        NDRSL.targetElements = t.length, t && t[0] && NDRSL.renderElements(t, e)
    }, 50)
}, NDRSL.showLarge = function (e, t, i = "jpg") {
    if (e = JSON.parse(e), console.log(e), document.getElementsByClassName("ndrsl-image-full-screen")) {
        let e = document.getElementsByClassName("ndrsl-image-full-screen");
        for (let t = 0; t < e.length; t++) e[t].remove()
    }
    let n = `<div class="ndrsl-image-full-screen" id="ndrsl-image-${e._id}" ndrsl-img="${t}" ndrsl-img-total="${e.images.length - 1}" >\n  <div style='width:100%;height:100%;position:relative; z-index:0;' onclick='NDRSL.hideLarge()'></div>`;
    n += '<div class="ndrsl-image-full-screen-inner">', n += `<div id='ndrsl-carousel-controls' >\n    <div class='ndrsl-carousel-controller left' onclick='NDRSL.slideImage("${e._id}",-1,event)' style='z-index=999999999999999999;'>\n      <svg aria-hidden="true" style='display:none;' focusable="false" data-prefix="fas" data-icon="arrow-left" class="svg-inline--fa fa-arrow-left fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M257.5 445.1l-22.2 22.2c-9.4 9.4-24.6 9.4-33.9 0L7 273c-9.4-9.4-9.4-24.6 0-33.9L201.4 44.7c9.4-9.4 24.6-9.4 33.9 0l22.2 22.2c9.5 9.5 9.3 25-.4 34.3L136.6 216H424c13.3 0 24 10.7 24 24v32c0 13.3-10.7 24-24 24H136.6l120.5 114.8c9.8 9.3 10 24.8.4 34.3z"></path></svg>\n    </div>\n    <div class='ndrsl-carousel-controller right' onclick='NDRSL.slideImage("${e._id}",1,event)' style='z-index=999999999999999999;'>\n      <svg aria-hidden="true" style='display:none;' focusable="false" data-prefix="fas" data-icon="arrow-right" class="svg-inline--fa fa-arrow-right fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path></svg>\n    </div>\n  </div>`;
    for (let l = 0; l < e.images.length; l++) n += `<img onclick='NDRSL.hideLarge()' class='ndrsl-testimonial-image-large ${t == l ? "active" : ""}' id='ndrsl-product-image-large-${e.images[l].id}' src='https://ndrsl-images.s3.us-east-2.amazonaws.com/review-images/${e.images[l].id}.${i}' alt='${e.images[l].text ? e.images[l].text : "Review photo " + (l + 1)}' />`;
    n += "</div></div>";
    let l = document.createElement("div");
    l.innerHTML = n, document.body.append(l)
}, NDRSL.hideLarge = function () {
    if (document.getElementsByClassName("ndrsl-image-full-screen")) {
        let e = document.getElementsByClassName("ndrsl-image-full-screen");
        for (let t = 0; t < e.length; t++) e[t].remove()
    }
}, NDRSL.slideImage = function (e, t, i) {
    i.preventDefault();
    let n = document.getElementById(`ndrsl-image-${e}`);
    if (n) {
        let e = n.getAttribute("ndrsl-img"), i = parseInt(n.getAttribute("ndrsl-img-total")), l = parseInt(e) + t;
        l > i && (l = 0), l < 0 && (l = i), n.setAttribute("ndrsl-img", l), console.log(e, t, i, l);
        let o = n.getElementsByClassName("ndrsl-testimonial-image-large");
        for (let e = 0; e < o.length; e++) {
            let t = o[e];
            t.classList.remove("active"), e == l && t.classList.add("active")
        }
    }
}, NDRSL.playVideo = function (e, t, i) {
    let n = document.getElementById(`video-container-${t}`), l = document.getElementById(`video-object-${t}`),
        o = document.getElementById(`video-preview-${t}`);
    n.classList.add("ndrsl-playing"), "probably" === NDRSL.supportsVideoType("webm") ? console.log("Supports webm") : (console.log("Replacing video source with mp4..."), i = i.replace(".webm", ".mp4")), l.src || (l.src = i), l.muted = !1, l.play(), o.pause(), l.pauseVideo = function () {
        NDRSL.pauseVideo(null, t)
    }
}, NDRSL.pauseVideo = function (e, t) {
    let i = document.getElementById(`video-container-${t}`), n = document.getElementById(`video-object-${t}`);
    document.getElementById(`video-preview-${t}`);
    i.classList.remove("ndrsl-playing"), n.muted = !0, n.pause()
}, NDRSL.videoSetup = function () {
    console.log("Setting up video");
    let e = document.getElementsByClassName("ndrsl-live-video-preview");
    for (let t = 0; t < e.length; t++) {
        let i = e[t];
        "probably" === NDRSL.supportsVideoType("webm") ? console.log("Supports webm") : (console.log("Replacing video source with mp4..."), i.src = i.src.replace(".webm", ".mp4")), i.resizeParent = function () {
            console.log(i.parentElement.clientHeight, i.clientHeight), i.parentElement.style.height = i.clientHeight
        }, i.oncanplay = setTimeout(() => {
            i.parentElement.querySelector("video.ndrsl-live-video").setAttribute("height", i.offsetHeight)
        }, 1e3), i.visibilityChecker = setInterval(() => {
            i.getBoundingClientRect().bottom <= (window.innerHeight || document.documentElement.clientHeight) && i.src && "" != i.src && i.src.includes("https") && (setTimeout(() => {
                i.autoplay = !0, i.play()
            }, 10), clearInterval(i.visibilityChecker))
        }, 100)
    }
    let t = document.getElementsByClassName("ndrsl-live-video");
    for (let e = 0; e < t.length; e++) {
        let i = t[e], n = i.parentElement.querySelector(".ndrsl-loading-icon");
        i.pause(), i.onplaying = (e => {
            setTimeout(() => {
                i.classList.remove("ndrsl-hidden"), i.parentElement.querySelector("video.ndrsl-live-video-preview").classList.add("ndrsl-hidden"), i.heightReset || (i.parentElement.style.paddingTop = i.clientWidth * (i.videoHeight / i.videoWidth) + "px", i.heightReset = !0), i.ontimeupdate = function () {
                    n.style.opacity = 0, n.style.zIndex = 0, NDRSL.isVisible(i) || i.pauseVideo()
                };
                let e = document.querySelectorAll("#ndrsl-carousel");
                for (let t = 0; t < e.length; t++) {
                    let i = e[t];
                    i.stopAutoplay = !0, setTimeout(() => {
                        (i && i.slideNum || 0 == i.slideNum) && i.NDRSLsetHeight(i.slideNum)
                    }, 300)
                }
            }, 10)
        }), i.onwaiting = (e => {
            n.style.opacity = 1, n.style.zIndex = 10
        }), i.onstalled = (e => {
            n.style.opacity = 1, n.style.zIndex = 10
        })
    }
}, NDRSL.init = function (e) {
    let t = document;
    "interactive" === t.readyState || "complete" === t.readyState ? setTimeout(() => {
        NDRSL.go(e)
    }, 10) : t.addEventListener("DOMContentLoaded", function () {
        setTimeout(() => {
            NDRSL.go(e)
        }, 10)
    })
}, NDRSL.isVisible = function (e) {
    if (!(e instanceof Element)) throw Error("DomUtil: elem is not an element.");
    const t = getComputedStyle(e);
    if ("none" === t.display) return !1;
    if ("visible" !== t.visibility) return !1;
    if (t.opacity < .1) return !1;
    if (e.offsetWidth + e.offsetHeight + e.getBoundingClientRect().height + e.getBoundingClientRect().width === 0) return !1;
    const i = {
        x: e.getBoundingClientRect().left + e.offsetWidth / 2,
        y: e.getBoundingClientRect().top + e.offsetHeight / 2
    };
    if (i.x < 0) return !1;
    if (i.x > (document.documentElement.clientWidth || window.innerWidth)) return !1;
    if (i.y < 0) return !1;
    if (i.y > (document.documentElement.clientHeight || window.innerHeight)) return !1;
    let n = document.elementFromPoint(i.x, i.y);
    do {
        if (n === e) return !0
    } while (n = n.parentNode);
    return !0
}, NDRSL.supportsVideoType = function (e) {
    let t;
    return t || (t = document.createElement("video")), t.canPlayType({
        ogg: 'video/ogg; codecs="theora"',
        h264: 'video/mp4; codecs="avc1.42E01E"',
        webm: 'video/webm; codecs="vp8, vorbis"',
        vp9: 'video/webm; codecs="vp9"',
        hls: 'application/x-mpegURL; codecs="avc1.42E01E"'
    }[e] || e)
};
