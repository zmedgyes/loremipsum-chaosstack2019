const express = require('express');
const async = require('async');
const util = require('util');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const port = 3000;
const { prisma } = require('./prisma/generated/prisma-client');

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(express.static('public'));

//DEBUG
app.use((req, res, next) => {
    if (req.body.studentid) {
        req.session.studentid = req.body.studentid;
    }
    next();
});

app.use('/login', (req, res) => {
    if (req.body.studentid) {
        const getUser = util.callbackify(prisma.user);
        const saveUser = util.callbackify(prisma.createUser);
        async.waterfall(
            [
                (callback) => {
                    getUser({ username: req.body.studentid}, callback);
                },
                (result, callback) => {
                    if (result) {
                        async.setImmediate(callback, null, result);
                    }
                    else {
                        async.waterfall(
                            [
                                (callback) => {
                                    saveUser({ username: req.body.studentid, points: 0 }, callback);
                                }
                            ],
                            (err, result) => {
                                callback(err, result);
                            }
                        );              
                    }
                }
            ],
            (err, result) => {
                console.log(err,result)
                if (err) {
                    res.json({ success: false, data: err });
                }
                else {
                    req.session.studentid = result.id;
                    res.json({ success: true });
                }
            }
        );
    }
    else {
        res.json({ success: false });
    }
});
app.use('/logout', (req, res) => {
    if (req.session.studentid) {
        req.session.studentid = null;
    }
    res.json({success:true});
});

//req: { topic:(téma) }
app.use('/getQuestion', (req, res) => {
    const getQuestions = util.callbackify(prisma.questions);
    const getAnswers = util.callbackify(prisma.answers);

    if (req.session.studentid) {

        async.waterfall(
            [
                (callback) => {
                    getQuestions({ where: { test: { name: req.body.topic } } }, callback);
                },
                (questions, callback) => {
                    shuffleArray(questions);
                    getAnswers({ where: { question: { id: questions[0].id } } }, (err, result) => {
                        if (err) {
                            callback(err);
                        }
                        else {
                            shuffleArray(result);
                            var ret = {
                                success: true,
                                data: {
                                    questionId: questions[0].id, // ezt majd vissza kell küldene
                                    question: questions[0].text,
                                    answers: [
                                        result[0].text,
                                        result[1].text,
                                        result[2].text,
                                        result[3].text
                                    ]
                                }
                            };
                            callback(null, ret);
                        }
                    });
                }
            ],
            (err, result) => {
                if (err) {
                    res.json({ success: false, data: err });
                }
                else {
                    res.json(result);
                }
            }
        );
    }
    else {
        res.json({ success: false, data: "Unauthorized" });
    }
});

//req { questionId: 1, answer:"valasz2"};
app.use('/sendAnswer', (req, res) => {
    const getCorrectAnswer = util.callbackify(prisma.questions);
    const getUser = util.callbackify(prisma.user);
    const updateUser = util.callbackify(prisma.updateUser);
    let getCorrect = (callback) => {
        getCorrectAnswer({
            where: {
                id: req.body.questionId,
                correctAnswer: { text: req.body.answer }
            }
        },
            (err, result) => {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, result.length === 1);
                }
            });
    };
    let saveResult = (isCorrect, callback) => {

        getUser({ id: req.session.studentid } , (err, result) => {
            if (err) { callback(err); }
            else {
                let point = (isCorrect) ? 1 : 0;
                if (result) {
                    updateUser({ data: { points: result.points + point }, where: { id: req.session.studentid }  }, (err) => {
                        callback(err, isCorrect);
                    });
                }
                else {
                    callback(err, isCorrect);
                }
            }
        });
    };
    
    if (req.session.studentid) {
        async.waterfall(
            [
                getCorrect,
                saveResult
            ],
            (err, isCorrect) => {
                if (err) {
                    res.json({ success: false, data: err });
                }
                else {
                    res.json({ success: true, data: { correct: isCorrect } });
                }
            }
        );
    }
    else {
        res.json({ success: false, data: "Unauthorized" });
    }
});

app.use('/getScore', (req, res) => {
    const getUser = util.callbackify(prisma.user);
    if (req.session.studentid) {
        var par = { id: req.session.studentid };
        if (req.body.user) {
            par = { username: req.body.user}
        }
        getUser(par, (err, result) => {
            if (err) { res.json({ success: false, data: err }) }
            else {
                if (result) {
                    res.json({ success: true, data: { username: result.username, points: result.points } });
                }
                else {
                    res.json({
                        success: true
                    })
                }
            }
        })
    }
    else {
        res.json({ success: false, data: "Unauthorized" });
    }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));