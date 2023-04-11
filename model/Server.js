let db = require('./db');
let Server = db.Server;

let all_server = () => {
    return new Promise((resolve, reject) => {
        Server.find({}, (error, data) => {
            if (error) reject(error);
            resolve(data);
        })
    })
};


let save_server = (serverObj) => {
    return new Promise((resolve, reject) => {
        serverObj['since'] = new Date();
        let server = new Server(serverObj);
        server.save((err, data) => {
            if (err) reject(err);
            resolve(data)
        })
    })
};

let update_server = (serverObj) => {
    return new Promise((resolve, reject) => {
        Server.findOne({ name: serverObj.name }, (error, data) => {
            if (error) {
                reject(error);
            } else {
                data.name = serverObj.name;
                data.url = serverObj.url;
                data.save((err, dat) => {
                    if (err) reject(err);
                    resolve(dat);
                })
            }
        })
    })
}

let delete_server = (servername) => {
    return new Promise((resolve, reject) => {
        Server.deleteOne({ name: servername }, (error, data) => {
            if (error) reject(error);
            resolve('Ok! Server is removed!');
        })
    })
}

let findByServerName = (servername) => {
    return new Promise((resolve, reject) => {
        Server.findOne({ name: servername }, (error, data) => {
            if (data == null || data == undefined) reject('Server not found!', error);
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
        Server.paginate({}, paginateObj, (error, data) => {
            if (error) reject(error);
            resolve(data);
        })
    })
}


module.exports = {
    all_server,
    save_server,
    update_server,
    paginate,
    delete_server,
    findByServerName
}