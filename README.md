# Image Merger
Developed to be used with google maps images but can be used with any images of same width and height

## Motive
Using google maps API, you can create several drawing and polygons. If you need a PNG image of this, you are out of luck

The static image API could be used to generate an image, however, only one polygon can be drawn. You can't pass in multiple polygons unfortunatly.

## Solution
Solution is to generate several images each containing 1 polygon and the 1 image containing nothing. Then take a diff of these images with the base image to get only the polyons. Then merge these images. 

This is one use case but there can be multiple other

## How to use it

We want to merge these images

![Base Image](https://i.imgur.com/12Lnxm7.png)
![Polygon 1](https://i.imgur.com/rmu2J4x.png)
![Polygon 2](https://i.imgur.com/PMRNbPO.png)

```
const merge = require('../build/.').Merge;
const fs = require('fs');

const img1 = fs.readFileSync('test/base.png');
const img2 = fs.readFileSync('test/poly1.png');
const img3 = fs.readFileSync('test/poly2.png');


merge([img1, img2, img3]).then(imgBuff => fs.writeFileSync('test/out.png', imgBuff));

```

We get this:

![Merged Image](https://i.imgur.com/rFmGQno.png)