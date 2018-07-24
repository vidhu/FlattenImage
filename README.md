# Flatten Image 
Developed to be used with google maps images but can be used with any images, each of same width and height as others.

## Motive
Using google maps API, you can create several drawings and polygons. If you need a PNG image of this, you are out of luck.

The static image API could be used to generate an image, however, only one polygon can be drawn. You can't pass in multiple polygons unfortunatly.

## Solution
Solution is to generate several images each containing 1 polygon and the 1 image containing nothing. Then take a diff of these images with the base image to get only the polyons. Then merge these images. 

This is one use case but there can be multiple others

## Installation
```sh
npm install flatten-image --save
```

## How to use it

We want to merge these images
(download these images to try it out)

![Base Image](https://i.imgur.com/12Lnxm7.png)
![Polygon 1](https://i.imgur.com/rmu2J4x.png)
![Polygon 2](https://i.imgur.com/PMRNbPO.png)

```js
const merge = require('flatten-image').Merge;
const fs = require('fs');

const img1 = fs.readFileSync('base.png');
const img2 = fs.readFileSync('poly1.png');
const img3 = fs.readFileSync('poly2.png');


merge([img1, img2, img3]).then(imgBuff => fs.writeFileSync('out.png', imgBuff));

```

We get this:

![Merged Image](https://i.imgur.com/rFmGQno.png)