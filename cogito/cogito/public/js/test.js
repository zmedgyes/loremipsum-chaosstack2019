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


var selectedAnswer;
var questionId;

serverRequest('/getQuestion', { topic: 'Arts' }, function (err, result) {
    if (!err && result.success) {
        questionId = result.data.questionId
        document.getElementById("question").innerHTML = result.data.question
        for (var i in result.data.answers) {

            document.getElementById("answer-" + i).innerHTML = result.data.answers[i]
        }
    }
    else {
        document.location.href = "/index.html"
    }
})



function onSelect(event) {
    if (selectedAnswer) {
        selectedAnswer.classList.remove("signed");
    }
    event.toElement.classList.add("signed")
    selectedAnswer = event.toElement;
    event.preventDefault();
}

function onNext() {
    if (selectedAnswer && questionId) {
        console.log(questionId, selectedAnswer.innerHTML)
    }
}

document.getElementById("answer-0").addEventListener("click", onSelect);
document.getElementById("answer-1").addEventListener("click", onSelect);
document.getElementById("answer-2").addEventListener("click", onSelect);
document.getElementById("answer-3").addEventListener("click", onSelect);
document.getElementById("next").addEventListener("click", onNext);