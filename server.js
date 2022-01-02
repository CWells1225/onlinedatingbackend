
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();
//Import Routes
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const cors = require('cors'); 

//Connect to DB
mongoose.connect(process.env.DB_CONNECT,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    },
    () => console.log('connected to db!')
);


//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));


//Route middleware
app.use('/api', authRoute);
app.use('/api/user', userRoute);

app.listen(3003, () => console.log('Server is up and running...'))