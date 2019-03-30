function serverRequest(url, body, callback) {
    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
            var res;
            var err;
            try {
                res = JSON.parse(xmlhttp.response);
            }
            catch (e) {
                err = e;
            }
            callback(err, res);
        }
    };
    xmlhttp.open("POST", url);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify(body));
}

document.getElementById("submitLogin").addEventListener("click", function (event) {
    event.preventDefault();
    serverRequest('/login', { studentid: document.getElementById("textarea").value }, function (err, result) {
        if (!err && result.success) {
            document.location.href = "/test.html"
        }
    });
});