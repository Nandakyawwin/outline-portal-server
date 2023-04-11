let db = require('./db');
let Key = db.Key;

let all_key = () => {
    return new Promise((resolve, reject) => {
        Key.find({}, (error, data) => {
            if (error) reject(error);
            resolve(data);
        })
    })
};


let save_key = (keyObj) => {
    return new Promise((resolve, reject) => {
        keyObj['since'] = new Date();
        let server = new Server(keyObj);
        server.save((err, data) => {
            if (err) reject(err);
            resolve(data)
        })
    })
};

let update_key = (keyObj) => {
    return new Promise((resolve, reject) => {
        Key.findOne({ name: keyObj.name }, (error, data) => {
            if (error) {
                reject(error);
            } else {
                data.name = keyObj.name;
                data.sskey = keyObj.sskey;
                data.data_limit = keyObj.data_limit;
                data.date_limit = keyObj.date_limit;
                data.save((err, dat) => {
                    if (err) reject(err);
                    resolve(dat);
                })
            }
        })
    })
}

let delete_key = (keyname) => {
    return new Promise((resolve, reject) => {
        Key.deleteOne({ name: keyname }, (error, data) => {
            if (error) reject(error);
            resolve('Ok! Server is removed!');
        })
    })
}

let findByKeyName = (sskey) => {
    return new Promise((resolve, reject) => {
        Server.findOne({ sskey: sskey }, (error, data) => {
            if (data == null || data == undefined) reject('Key not found!', error);
            resolve(data);
        })
    })
}

let paginate = (start, count) => {
    let paginateObj = {
        sort: { since: -1 },
        lean: true,
        page: start,
        limit: count
    };
    return new Promise((resolve, reject) => {
        Key.paginate({}, paginateObj, (error, data) => {
            if (error) reject(error);
            resolve(data);
        })
    })
}



module.exports = {
    all_key,
    save_key,
    update_key,
    paginate,
    delete_key,
    findByKeyName
}