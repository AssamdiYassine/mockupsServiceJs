const Jimp = require("jimp");
const path = require("path");
const fs = require("fs");

const compressImages = require("./compressImages");

let isModuleBuilderExecuting = false;
const moduleBuilderQueue = [];

async function makeMockup(logos, i) {
  console.log("start");
  const MOCKUP = [
    {
      name: path.join(process.cwd(), "controllers/MOCKUP/mockup1.jpg"),
      width: 780,
      height: 1100,
      rotation: 1,
      resize: 680,
      place: "FinalMockups/",
    }
    // {
    //   name: path.join(process.cwd(), "controllers/MOCKUP/mockup2.jpg"),
    //   width: 1240,
    //   height: 1400,
    //   rotation: -1.7,
    //   resize: 980,
    //   place: "FinalMockups/",
    // },
    // {
    //   name: path.join(process.cwd(), "controllers/MOCKUP/mockup3.jpg"),
    //   width: 420,
    //   height: 500,
    //   rotation: -2,
    //   resize: 700,
    //   place: "FinalMockups/",
    // },
  ];

  const tasks = MOCKUP.map((MOCKUPs, index) =>
    Jimp.read(MOCKUPs.name).then((mockUP) => {
      return Jimp.read(logos).then((logo) => {
        logo.rotate(MOCKUPs.rotation);
        logo.resize(
          MOCKUPs.resize,
          Jimp.AUTO,
          Jimp.HORIZONTAL_ALIGN_CENTER || Jimp.VERTICAL_ALIGN_TOP
        );
        mockUP.composite(logo, MOCKUPs.width, MOCKUPs.height);
        return mockUP.writeAsync(`${MOCKUPs.place}/nish-${i}/${index}.jpg`);
      });
    })
  );

  await Promise.all(tasks);

  console.log("---done---");
}

async function processModuleBuilderQueue() {
  while (moduleBuilderQueue.length > 0) {
    const { logos, i } = moduleBuilderQueue.shift();
    await makeMockup(logos, i);
    console.log("Finish executing makeMockup");
  }

  // Call your additional function here
  anotherFunction();
}

async function moduleBuilder(logos, i) {
  if (isModuleBuilderExecuting) {
    console.log("moduleBuilder is already executing. Queueing current call.");
    moduleBuilderQueue.push({ logos, i });
    return;
  }

  isModuleBuilderExecuting = true;

  try {
    await makeMockup(logos, i);
    console.log("Finish executing makeMockup");

    if (moduleBuilderQueue.length > 0) {
      await processModuleBuilderQueue();
    } else {
      // Call your additional function here
      anotherFunction();
    }
  } catch (error) {
    console.error("Error occurred:", error);
  } finally {
    isModuleBuilderExecuting = false;
  }
}

function anotherFunction() {
  function buildPath() {
    return path.join(process.cwd(), "state", "state.json");
  }
  
  function extractData(filePath) {
    const jsonData = fs.readFileSync(filePath);
    const data = JSON.parse(jsonData);
    return data;
  }
  
  const filePath = buildPath();
  const AllData = extractData(filePath);
  
  const newDemo = {
    status: "complited"
  };
  const newAllEvents = AllData.map((ev) => {
    return newDemo;
  });

  fs.writeFileSync(filePath, JSON.stringify(newAllEvents));
}

module.exports = moduleBuilder;
