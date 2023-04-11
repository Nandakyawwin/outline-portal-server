const mongoose = require('mongoose'),
    paginate = require('mongoose-paginate'),
    autoIncrement = require('simple-mongoose-autoincrement');

const URL = 'mongodb://127.0.0.1:27017/outlineportalDatabase';
const connect = mongoose.connect(URL, { useNewUrlParser: true });
let Schema = mongoose.Schema;

let AdminScheme = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
    password: { type: String, required: true },
    since: { type: Date, required: true }
});

let ServerScheme = new Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
    since: { type: Date, required: true }
});

let KeyScheme = new Schema({
    name: { type: String, required: true },
    sskey: { type: String, required: true },
    data_limit: { type: String, required: true },
    date_limit: { type: String, required: true },
    since: { type: Date, required: true }
});

AdminScheme.plugin(autoIncrement, { field: 'adminID' });
AdminScheme.plugin(paginate);
let Admin = mongoose.model('admin', AdminScheme);

ServerScheme.plugin(autoIncrement, { field: 'serverID' });
ServerScheme.plugin(paginate);
let Server = mongoose.model('server', ServerScheme);

KeyScheme.plugin(autoIncrement, { field: 'keyID' });
KeyScheme.plugin(paginate);
let Key = mongoose.model('key', KeyScheme);

module.exports = {
    Admin,
    Server,
    Key
}