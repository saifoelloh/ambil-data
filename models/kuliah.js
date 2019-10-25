const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  makul: { type: Schema.Types.ObjectId, ref: 'makul', required: true },
  mahasiswa: { type: Schema.Types.ObjectId, ref: 'mahasiswa', required: true },
  status: String,
});

schema.index({ makul: 1, mahasiswa: 1 }, { unique: true });

const Kuliah = mongoose.model('kuliah', schema);
module.exports = Kuliah;
