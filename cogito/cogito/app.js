const express = require('express');
const async = require('async');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(session({
    secret: 'fdzsfdjgzghjg',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}));

//DEBUG
app.use((req, res, next) => {
    if (req.body.studentid) {
        req.session.studentid = req.body.studentid;
    }
    next();
});

app.get('/login', (req, res) => {
    if (req.body.studentid) {

        req.session.studentid = req.body.studentid;
        res.json({ success: true });
    }
    else {
        res.json({ success: false });
    }
});
app.get('/logout', (req, res) => {
    if (req.session.studentid) {
        req.session.studentid = null;
    }
    res.json({success:true});
});

//req: { topic:(téma) }
app.get('/getQuestion', (req, res) => {
    if (req.session.studentid) {
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
app.post('/sendAnswer', (req, res) => {
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

app.get('/getScore', (req, res) => {
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


app.listen(port, () => console.log(`Example app listening on port ${port}!`))