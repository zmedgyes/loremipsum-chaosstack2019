const express = require('express');
const async = require('async');
const util = require('util');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const port = 3000;
const { prisma } = require('./prisma/generated/prisma-client');

const randomInt = (to) => {
    return Math.round(Math.random() * to);
};

// A `main` function so that we can use async/await
/*async function main() {

    // Create a new user called `Alice`
    const newUser = await prisma.createUser({ username: 'Alice' })
    console.log(`Created new user: ${newUser.username} (ID: ${newUser.id})`)

    // Read all users from the database and print them to the console
    const allUsers = await prisma.users()
    console.log(allUsers)
}

main().catch(e => console.error(e))*/

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
        const getUser = util.callbackify(prisma.user)
        const saveUser = util.callbackify(prisma.createUser);
        async.waterfall(
            [
                (callback) => {
                    getUser({ username: req.body.studentid }, callback);
                },
                (result, callback) => {
                    if (result) {
                        async.setImmediate(callback, null, result);
                    }
                    else {
                        saveUser({ username: req.body.studentid }, callback);
                    }
                }
            ],
            (err, result) => {
                if (err) {
                    res.json({ success: false, data: err });
                }
                else {
                    console.log("loginsuccess")
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
                    getQuestions({ where: { test: { name: "Arts" } } }, callback);
                },
                (questions, callback) => {
                    getAnswers({ where: { question: { id: questions[0].id } } }, (err, result) => {
                        if (err) {
                            callback(err)
                        }
                        else {
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
                            callback(null, ret)
                        }
                    })
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
        )
    }
    else {
        res.json({ success: false, data: "Unauthorized" });
    }
});

//req { questionId: 1, answer:"valasz2"};
app.use('/sendAnswer', (req, res) => {
    const getCorrectAnswer = util.callbackify(prisma.questions)
    
    if (req.session.studentid) {
        getCorrectAnswer({
            where: {
                id: req.body.questionId,
                correctAnswer: { text: req.body.answer }
            }
        },
        (err, result) => {
            if (err) {
                res.json({ success: false, data: err });
            }
            else {
                if (result.length == 0) {
                    res.json({ success: false, data: {correct:false} });
                }
                else {
                    res.json({ success: false, data: { correct: true } });
                }
            }
        })
    }
    else {
        res.json({ success: false, data: "Unauthorized" });
    }
});

app.use('/getScore', (req, res) => {
    if (req.session.studentid) {
        var ret = {
            success: true,
            data: {
                //TODO
            }
        };
        res.json(ret);
    }
    else {
        res.json({ success: false, data: "Unauthorized" });
    }
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));