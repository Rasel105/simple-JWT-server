const express = require("express");
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware 

app.use(cors());
app.use(express.json());


const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).send({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: "Forbidden" });
        }
        req.decoded = decoded;
        next();
    })

}

app.post('/login', (req, res) => {
    const user = req.body;
    console.log(user);
    // DANGER: Do not ckeck password here for serious application 
    if (user.email === 'user@gmail.com' && user.password === '123456') {
        const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "5s" });
        res.send({
            success: true,
            accessToken: accessToken
        })
    } else {
        res.send({ success: false });
    }
})

app.get('/orders', verifyJWT, (req, res) => {
    res.send([{ id: 1, item: 'sunglass' }, { id: 2, item: "moonglass" }])
})


app.get('/', (req, res) => {
    res.send("Hello From JWT Server");
});

app.listen(port, () => {
    console.log("Listening to port", port);
});