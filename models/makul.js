const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  code: { type: String, unique: true },
  name: String,
});

Makul = mongoose.model('makul', schema);
module.exports = Makul;
