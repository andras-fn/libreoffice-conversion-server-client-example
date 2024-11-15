import fs from "fs";
import path from "path";
import { performance } from "perf_hooks";

async function main() {
  try {
    const startTime = performance.now();

    console.log("Reading file");
    const readStart = performance.now();
    const fileBuffer = fs.readFileSync(process.argv[2]); // Read the file as a buffer
    const fileName = path.basename(process.argv[2]);
    const readEnd = performance.now();
    console.log(`File read in ${(readEnd - readStart).toFixed(2)} ms`);

    console.log("Creating form data");
    const formDataStart = performance.now();
    // Create a new FormData instance
    const form = new FormData();

    // Append the file
    form.append("file", new Blob([fileBuffer]), fileName);

    // Append the convert_to field
    form.append("convert_to", process.argv[3]);
    const formDataEnd = performance.now();
    console.log(
      `Form data created in ${(formDataEnd - formDataStart).toFixed(2)} ms`
    );

    console.log("Sending request");
    const requestStart = performance.now();
    const response = await fetch("http://localhost:5000/convert", {
      method: "POST",
      body: form,
    });
    const requestEnd = performance.now();
    console.log(`Request sent in ${(requestEnd - requestStart).toFixed(2)} ms`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log("Getting arraybuffer from response");
    const arrayBufferStart = performance.now();
    const arraybuffer = await response.arrayBuffer();
    const arrayBufferEnd = performance.now();
    console.log(
      `ArrayBuffer received in ${(arrayBufferEnd - arrayBufferStart).toFixed(
        2
      )} ms`
    );

    console.log("Creating buffer");
    const bufferStart = performance.now();
    const buffer = Buffer.from(arraybuffer);
    const bufferEnd = performance.now();
    console.log(`Buffer created in ${(bufferEnd - bufferStart).toFixed(2)} ms`);

    console.log("Writing file");
    const writeStart = performance.now();
    fs.writeFileSync(`output.${process.argv[3]}`, buffer); // Make sure the extension is correct
    const writeEnd = performance.now();
    console.log(`File written in ${(writeEnd - writeStart).toFixed(2)} ms`);

    const endTime = performance.now();
    console.log(`Total time taken: ${(endTime - startTime).toFixed(2)} ms`);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
