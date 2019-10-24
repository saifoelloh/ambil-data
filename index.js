const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/ambil-data', {
  useNewUrlParser: true,
});

const mahasiswaSchema = new Schema({
  ipk: String,
  name: String,
  ipk: Number,
  status: String,
  kuliah: [{ type: Schema.Types.ObjectId, ref: 'kuliah' }],
});

const makulSchema = new Schema({
  name: String,
});

const kuliahSchema = new Schema({
  makul: { type: Schema.Types.ObjectId, ref: 'makul' },
  mahasiswa: { type: Schema.Types.ObjectId, ref: 'mahasiswa' },
  status: String,
});

const Mahasiswa = mongoose.model('mahasiswa', mahasiswaSchema);
const Makul = mongoose.model('makul', makulSchema);
const Kuliah = mongoose.model('kuliah', kuliahSchema);

const buatArray = (base = 0, limit = 1) =>
  [...Array(limit - base)].map((x) => base++);

const arr = buatArray(10054, 10100);

Promise.all(
  arr.map((nim) => {
    request.get(
      `http://en.dinus.ac.id/mahasiswa/A11.2017.${nim}`,
      (error, response, html) => {
        const $ = cheerio.load(html);
        const bazz = $('.row')
          .find('.col-md-5')
          .html();
        if (bazz != null) {
          $('.row')
            .find('.col-md-5')
            .find('table')
            .find('tbody')
            .each((i, el) => {
              const tr = $(el)
                .find('tr')
                .each((id, foo) => {
                  const temp = $(foo).find('td');
                  const label = $(temp[0]).text();
                  const value = $(temp[2])
                    .text()
                    .split(' ');
                  const ipk = parseFloat(value[0]);
                  if (label.includes('IPK')) {
                    const hasil = $(el).find('tr');
                    const bar = $(hasil).find('td');
                    const nama = $(bar[2]).text();
                    console.log({ nim: `A11.2017.${nim}`, nama, ipk });
                    Mahasiswa.save({ nim: `A11.2017.${nim}`, nama, ipk });
                  }
                });
            });
        }
      },
    );
  }),
);

Mahasiswa.find().then((res) => console.log(res));
