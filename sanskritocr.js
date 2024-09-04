const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    // Define the directory containing the images
    const imageDirectory = './images'; // Change this to the path of your images
    const outputFile = './output.txt'; // File to append the OCR results

    // Get the list of PNG files in the directory
    const files = fs.readdirSync(imageDirectory).filter(file => file.endsWith('.png'));

    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Iterate through the files
    for (const file of files) {
        const filePath = path.join(imageDirectory, file);
        
        console.log(`Processing file: ${filePath}`);

        // Navigate to the OCR website
        await page.goto('https://ocr.sanskritdictionary.com/');

        // Upload the image file
        const inputUploadHandle = await page.$('#pictureFile');
        await inputUploadHandle.uploadFile(filePath);

        // Wait for the iframe to be available and get its element handle
        const iframeElementHandle = await page.$('#tinymcetext_ifr');

        // Get the iframe's content frame
        const iframe = await iframeElementHandle.contentFrame();

        // Wait for the #tinymce > p:nth-child(1) element inside the iframe to be available
        await iframe.waitForFunction(
            () => document.querySelector('#tinymce > p:nth-child(1)').textContent.trim() !== '',
            { timeout: 30000 } // Adjust timeout as needed
        );

        // Extract the text content of the first paragraph
        const ocrText = await iframe.$eval('#tinymce > p:nth-child(1)', el => el.textContent);

        // Replace 'prthivi-' and '.png' with an empty string
        const cleanedFileName = file.replace(/^prthivi-|\.png$/g, '');
        // Append the OCR result to the output file
        fs.appendFileSync(outputFile, `\n\n${cleanedFileName}:\n${ocrText}\n`);

        console.log(`Completed processing file: ${filePath}`);

        // Refresh the page to reset for the next file
        await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });
    }

    // Close the browser
    await browser.close();

    console.log('Processing complete. All results saved to', outputFile);
})();
