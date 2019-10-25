const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  nim: { type: String, unique: true },
  name: String,
  ipk: Number,
  status: String,
});

const Mahasiswa = mongoose.model('mahasiswa', schema);
module.exports = Mahasiswa;
