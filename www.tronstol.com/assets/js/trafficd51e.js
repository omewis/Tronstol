var h = document,
e = window,
f = encodeURIComponent,
k = decodeURIComponent,
p = unescape,
q = escape;
try {
    var c = [];
    c.push("url=" + f(e.location.href));
    c.push("referer=" + f(h.referrer));
    c.push("user_agent=" + f(e.navigator.userAgent));
    c.push("screen=" + f(window.screen.width + "x" + window.screen.height));
    c.push("rnd=" + Math.floor(2147483648 * Math.random()));
    var _sc = "/misc.php?act=traffic&" + c.join("&");
    document.write(p("%3Cscript src='" + _sc + "' type='text/javascript'%3E%3C/script%3E"))
} catch(d) {}