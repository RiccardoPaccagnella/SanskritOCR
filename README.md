# SanskritOCR

With this code you can create puppet browser instance that navigates to https://ocr.sanskritdictionary.com/  and uploads the `.png` images that are in your folder `images` one by one as if it were a user.
Then, the puppet browser scrapes the result, appends it to the file `output.txt`, refreshes the page and starts again.
In this way you can bypass the restriction of upload for a single page.

## Installation

To use this code you need to have `nmp` and `node` installed.
Then, run:
```
nmp install puppetteer
```

## Usage

First you should split your PDF into single `.png` images.
For instance, here: https://www.ilovepdf.com/split_pdf.
Move the split images into the folder `images`.
Run:
```
node sanscritocr.js
```
The result will be `output.txt`.

