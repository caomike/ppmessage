function startCheckInterval() {
    var count = 30;
    var interval_mark = document.querySelector("#interval-mark");
    var interval = setInterval(function () {
        if (count == 0) {
            clearInterval(interval);
            interval_mark.setAttribute("disabled", true);
            interval_mark.setAttribute("value", "Page is outdated, please refresh.");
            return;
        }
        count = count - 1;
        interval_mark.setAttribute("value", "Authorize application (" + count + "s)");
    }, 1000);
}
