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
            console.log(err, result)
        }
    )

    if (req.session.studentid) {
       

        


        async.waterfall(
            [
                (callback) => {
                    getTest({ name: req.body.topic }, callback);
                },
                (test, callback) => {
                    getQuestions({ test: test }, callback);
                }
            ],
            (err, result) => {
                console.log(result)
            }
        )

        let ret = {
            success: true,
            data: {
                questionId: 1, // ezt majd vissza kell küldene
                question: "Mia?",
                answers: [
                    'valasz1',
                    'valasz2',
                    'valasz3',
                    'valasz4'
                ]
            }
        };
        res.json(ret);
    }
    else {
        res.json({ success: false, data: "Unauthorized" });
    }
});

//req { questionId: 1, answer:"valasz2"};
app.use('/sendAnswer', (req, res) => {
    if (req.session.studentid) {
        let ret = {
            success: true,
            data: {
                correct: true
            }
        };
        res.json(ret);
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