const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/ambil-data', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { Kuliah, Mahasiswa, Makul } = require('./models');

const buatArray = (base = 0, limit = 1) =>
  [...Array(limit - base)].map((x) => base++);

const arr = buatArray(10054, 11000);

arr.map((nim) => {
  request(
    `https://en.dinus.ac.id/mahasiswa/A11.2017.${nim}`,
    async (error, response, html) => {
      const $ = cheerio.load(html);
      const check = $('.row')
        .find('.col-md-5')
        .html();
      if (check != null) {
        const table = $(html).find('table');
        const biodata = $(table[0])
          .find('tbody')
          .find('tr');
        // console.log($(biodata[3]).html());
        const kuliah = $(table[1])
          .find('tbody')
          .find('tr');
        const name = $(biodata[0])
          .find('td')
          .next()
          .next()
          .text();
        const nim = $(biodata[1])
          .find('td')
          .next()
          .next()
          .text();
        const ipk = parseFloat(
          $(biodata[3])
            .find('td')
            .next()
            .next()
            .text()
            .split(' ')[0],
        );
        const mhs = Mahasiswa({ nim, name, ipk });
        await mhs.save();
        $(kuliah).each(async (id, tr) => {
          const td = $(tr).find('td');
          const code = $(td[1]).text();
          const name = $(td[3]).text();
          const status = $(td[5]).text();
          let makul = {};
          const temp = Makul.find({ name });
          if (temp.length == undefined) {
            makul = Makul({ code, name });
            await makul.save();
          } else {
            makul = temp[0];
          }
          const kuliah = Kuliah({
            mahasiswa: mhs._id,
            makul: makul._id,
            status,
          });
          await kuliah.save();
          console.log({ nim: `A11.2017.${nim}`, success: true });
        });
      }
    },
  );
});
