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

function getScore() {
    var username = document.getElementById("textarea").value
    var par = {};
    if (username) {
        par = { user: username };
    }
    serverRequest('/getScore', par, function (err, result) {
        if (!err && result.success) {
            if (result.data) {
                document.getElementById("username").innerHTML = result.data.username;
                document.getElementById("points").innerHTML = result.data.points;
            }
            else {
                document.getElementById("username").innerHTML = "";
                document.getElementById("points").innerHTML = "";
            }
        }
        else {
            console.log(err, result);
            document.location.href = "/index.html"
        }
    })
}

document.getElementById("search").addEventListener("click", function (event) { getScore() });
getScore();