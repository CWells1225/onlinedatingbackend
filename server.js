
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();
//Import Routes
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const cors = require('cors'); 
// const session = require('express-session');
// const MongoDBStore = require('connect-mongodb-session')(session);

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
//Setup Cors middleware
// const whitelist = ['http://localhost:3000', 'https://wheresinglesmeet-frontend.herokuapp.com']
// const corsOptions = {
//     origin: (origin, callback) => {
//         if(whitelist.indexOf(origin) !== -1 || !origin) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     }, 

//     credentials: true
// }

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use('/uploads', express.static('uploads'));
// app.set('trust proxy', 1)

// app.use(session({
//     secret: process.env.SECRET,
//     resave: false, 
//     saveUnitialized: false, 
//     store: new MongoDBStore({
//         url: process.env.MongoDBURI, 
//         collection: 'mySessions'
//     }), 
//     cookie: {
//         sameSite: 'none', 
//         secure:true
//     } 
// }))


//Route middleware
app.use('/api', authRoute);
app.use('/api/user', userRoute);

app.listen(3003, () => console.log('Server is up and running...'))