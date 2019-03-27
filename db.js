const mongoose = require('mongoose');
const dbHost = 'mongodb://127.0.0.1:27017/';
const dbName = 'test'

mongoose.connect(dbHost + dbName, {useNewUrlParser: true});
console.log('connected.');
// const Schema = mongoose.Schema;

module.exports = mongoose;