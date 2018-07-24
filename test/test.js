const merge = require('../build/.').Merge;
const fs = require('fs');


const img1 = fs.readFileSync('test/base.png');
const img2 = fs.readFileSync('test/poly1.png');
const img3 = fs.readFileSync('test/poly2.png');



merge([img1, img2, img3]).then(imgBuff => fs.writeFileSync('test/out.png', imgBuff));
