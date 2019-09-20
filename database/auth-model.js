const db = require('./dbConfig');

async function findById(id) {
    return db('users').where({id}).first();
}

async function findByUsername(username) {
    return db('users').where({username}).first();
}

async function insert(user) {
    return db('users').insert(user)
    .then(ids => findById(ids[0]));
}

async function deleteUser(username) {
    return db('users').where({username}).del();
}

module.exports = {findById, findByUsername, insert, deleteUser};