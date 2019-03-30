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
var openQuestion = true;
var topics = ['Arts', 'Sciences', 'History', 'Geography'];
var topicidx = 0;


function getQuestion() {
    document.getElementById("topic").innerHTML = topics[topicidx]
    serverRequest('/getQuestion', { topic: topics[topicidx] }, function (err, result) {
        if (!err && result.success) {
            openQuestion = true;
            questionId = result.data.questionId;
            if (selectedAnswer) {
                selectedAnswer.classList.remove("signed");
                selectedAnswer.classList.remove("correct");
                selectedAnswer.classList.remove("incorrect");
                selectedAnswer = null;
            }
            document.getElementById("question").innerHTML = result.data.question
            for (var i in result.data.answers) {

                document.getElementById("answer-" + i).innerHTML = result.data.answers[i]
            }
        }
        else {
            document.location.href = "/index.html"
        }
    })
}



function onSelect(event) {
    if (openQuestion) {
        if (selectedAnswer) {
            selectedAnswer.classList.remove("signed");
        }
        event.toElement.classList.add("signed")
        selectedAnswer = event.toElement;
    }
    event.preventDefault();
}

function onNext() {
    if (topicidx < topics.length - 1) {
        topicidx++;
        getQuestion();
    }
    else {
        document.location.href = "/results.html"
    }
}
function onAnswer() {

    if (selectedAnswer && questionId && openQuestion) {
        serverRequest('/sendAnswer', { questionId: questionId, answer: selectedAnswer.innerHTML }, function (err, result) {
            if (!err && result.success) {
                
                openQuestion = false;
                selectedAnswer.classList.remove("signed");
                if (result.data.correct) {
                    selectedAnswer.classList.add("correct");
                }
                else {
                    selectedAnswer.classList.add("incorrect");
                }
            }
            else {
                console.log(result)
                document.location.href = "/index.html"
            }
        })
    }
}

document.getElementById("answer-0").addEventListener("click", onSelect);
document.getElementById("answer-1").addEventListener("click", onSelect);
document.getElementById("answer-2").addEventListener("click", onSelect);
document.getElementById("answer-3").addEventListener("click", onSelect);
document.getElementById("next").addEventListener("click", onNext);
document.getElementById("answer").addEventListener("click", onAnswer);

getQuestion()