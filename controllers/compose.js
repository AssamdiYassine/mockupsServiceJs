var path = require("path");
const fs = require("fs");
const archiver = require("archiver");
const toAbsoluteUrl = (pathname) => process.env.PUBLIC_URL + pathname;
const moduleBuilder = require("./composite");

const crypto = require("crypto");
function buildPath() {
  return path.join(process.cwd(), "state", "state.json");
}

function extractData(filePath) {
  const jsonData = fs.readFileSync(filePath);
  const data = JSON.parse(jsonData);
  return data;
}

let i = 0;
module.exports = {
  UploadDesign: async (req, res) => {
    const filePath = buildPath();
    const AllData = extractData(filePath);

    const newDemo = {
      status: "inprocess",
    };
    const newAllEvents = AllData.map((ev) => {
      return newDemo;
    });

    fs.writeFileSync(filePath, JSON.stringify(newAllEvents));

    try {
      let files = req.files.file;

      if (!Array.isArray(files)) {
        files = [files];
      }

      for (const file of files) {
        await file.mv(toAbsoluteUrl(`/${file.name}`), async (err) => {
          if (err) {
            console.error(err);
            return res.status(500).send(err);
          }
        });
        // Usage example
        (async () => {
          console.log("Start executing moduleBuilder");
          await moduleBuilder(toAbsoluteUrl(`/${file.name}`), i);
          console.log("Finish executing moduleBuilder");
        })();

        i++;
      }
      res.status(200).json({ message: "Upload complete", process: "uploaded" });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },
  makeZipFile: async (req, res) => {
    try {
      const uploadsFolder = path.join(process.cwd(), 'FinalMockups');
      const output = fs.createWriteStream(path.join(process.cwd(), 'toZip/compressedImages.zip'));
      const archive = archiver('zip', { zlib: { level: 9 } });
  
      output.on('close', () => {
        console.log('Compression completed');
        res.status(200).json({ process: 'compress' });
      });
  
      archive.on('error', (err) => {
        console.error('Compression error:', err);
        res.status(500).json({ error: 'Compression error' });
      });
  
      archive.pipe(output);
      archive.directory(uploadsFolder, false);
      archive.finalize();
  
      await new Promise((resolve) => {
        archive.on('finish', resolve);
      });
    } catch (err) {
      console.error('Error creating zip file:', err);
      res.status(500).json({ error: 'Error creating zip file' });
    }
  },

  
  
  Dowinload: async (req, res) => {

    const zipPath = path.join(process.cwd(), 'toZip/compressedImages.zip');

 
    res.set('Content-Disposition', 'attachment; filename=download.zip');
    res.set('Content-Type', 'application/zip');
 

  
    res.sendFile(path.resolve(zipPath));

  },
};
