import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Function to fetch a file and return a Blob
const fetchFile = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const filename = url.substring(url.lastIndexOf('/') + 1);
  return { blob, filename };
};

// Function to download multiple files as a single zip in a folder
export const downloadFilesAsZip = async (urls, folderName) => {
  const zip = new JSZip();
  const folder = zip.folder(folderName);

  // Fetch each file and add it to the folder in the zip
  for (const url of urls) {
    const { blob, filename } = await fetchFile(url);
    folder.file(filename, blob);
  }

  // Generate the zip file and trigger download
  zip.generateAsync({ type: 'blob' }).then((content) => {
    saveAs(content, `${folderName}.zip`);
  });
};

// Usage example
// const fileUrls = [
//   'https://example.com/file1.png',
//   'https://example.com/file2.jpg',
//   'https://example.com/file3.pdf'
// ];

// downloadFilesAsZip(fileUrls, 'myFiles');
