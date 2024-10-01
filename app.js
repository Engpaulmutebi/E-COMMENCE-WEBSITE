const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const errorController = require('./controllers/error');
const User = require('./models/user');
const URL = 'mongodb+srv://engpaulmutebi:paul123@cluster2.ovutc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2'

const app = express();

const store = new MongoDBStore({
  uri: URL,
  collection: 'mySessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret:'my session',
  resave:false,
  saveUninitialized:false,
  store: store 
})); 

app.use((req, res, next) => {
  User.findById('5bab316ce0a7c75f783cb8a8')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

//  store = new MongoDBStore({
//   uri: 'mongodb://127.0.0.1:27017/connect_mongodb_session_test',
//   collection: 'mySessions'
// });

mongoose
  .connect(
    URL,{
      useNewUrlParser: true,
      useUnifiedTopology: true,
      writeConcern: { w: 'majority' }
    }
    )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Max',
          email: 'max@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
