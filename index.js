const fs = require("fs");
const ytdl = require("ytdl-core");
const readline = require("readline");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function startDownload() {
  rl.question("Enter the YouTube video URL: ", (url) => {
    ytdl
      .getInfo(url)
      .then((info) => {
        const videoFormats = info.formats.filter(
          (format) => format.hasVideo && format.hasAudio
        );

        const qualityOptions = videoFormats.map(
          (format) => `${format.qualityLabel} (${format.container})`
        );
        console.log("\nAvailable video qualities:");
        qualityOptions.forEach((option, index) => {
          console.log(`${index + 1}. ${option}`);
        });

        rl.question(
          "\nEnter the desired quality option number: ",
          (qualityOptionNumber) => {
            const qualityOption = parseInt(qualityOptionNumber, 10) - 1;
            if (qualityOption >= 0 && qualityOption < videoFormats.length) {
              const format = videoFormats[qualityOption];
              console.log(`\nTitle: ${info.videoDetails.title}`);
              console.log(`Download started for ${format.qualityLabel}`);

              // Sanitize filename to avoid invalid characters
              const sanitizedTitle = path
                .parse(info.videoDetails.title)
                .name.replace(/[^\w\s\.-]/g, "_");
              const fileName = `${sanitizedTitle}.${format.container}`;

              const scriptDir = path.dirname(require.main.filename); // Get script directory
              const downloadsPath = path.join(scriptDir, "Downloads"); // Downloads folder path
              const filePath = path.join(downloadsPath, fileName);

              // Create Downloads folder with write permissions if it doesn't exist
              createDownloadsFolder(downloadsPath, () => {
                console.log("File Path:", filePath);
                downloadVideo(filePath, format, url);
              });
            } else {
              console.error("Invalid quality option number!");
              rl.close();
            }
          }
        );
      })
      .catch((err) => {
        console.error("Error occurred:", err.message);
        rl.close();
      });
  });
}

function createDownloadsFolder(folderPath, callback) {
  if (!fs.existsSync(folderPath)) {
    try {
      fs.mkdirSync(folderPath, { recursive: true });
      fs.chmodSync(folderPath, 0o755); // Set write permission for user, group, and others
      callback();
    } catch (err) {
      console.error("Error creating Downloads folder:", err.message);
      rl.close();
    }
  } else {
    callback();
  }
}

function downloadVideo(filePath, format, url) {
  const downloadStream = ytdl(url, { format: format });
  const fileStream = fs.createWriteStream(filePath);

  let totalBytes = 0;
  let downloadedBytes = 0;
  let lastProgressUpdate = 0;

  downloadStream.on("response", (response) => {
    totalBytes = parseInt(response.headers["content-length"], 10);
  });

  downloadStream.on("data", (chunk) => {
    downloadedBytes += chunk.length;
    const now = Date.now();
    if (now - lastProgressUpdate > 500) {
      updateProgressBar(downloadedBytes, totalBytes);
      lastProgressUpdate = now;
    }
  });

  downloadStream.pipe(fileStream);

  downloadStream.on("end", () => {
    console.log("\nDownload completed!");
    rl.question("Do you want to download another video (y/n)? ", (answer) => {
      if (answer.toLowerCase() === "y") {
        startDownload();
      } else {
        console.log("Exiting app...");
        rl.close();
      }
    });
  });

  downloadStream.on("error", (err) => {
    console.error("Error occurred during download:", err.message);
    rl.close();
  });
}

function updateProgressBar(downloadedBytes, totalBytes) {
  const percentage = Math.floor((downloadedBytes / totalBytes) * 100);

  const progressBarLength = 100;
  const completedChars = Math.round((percentage / 100) * progressBarLength);
  const remainingChars = progressBarLength - completedChars;

  let progressBar = "[";
  progressBar += "#".repeat(completedChars);
  progressBar += "-".repeat(remainingChars);
  progressBar += "]";

  console.clear();
  console.log(`Downloaded: ${percentage}% ${progressBar}`);
}

startDownload();
