const fs = require("fs");
const ytdl = require("ytdl-core");
const readline = require("readline");
const path = require("path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

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
            if (!fs.existsSync(downloadsPath)) {
              try {
                fs.mkdirSync(downloadsPath, { recursive: true });
                fs.chmodSync(downloadsPath, 0o755); // Set write permission for user, group, and others
              } catch (err) {
                console.error("Error creating Downloads folder:", err);
                rl.close();
                return;
              }
            }

            console.log("File Path:", filePath);

            downloadVideo(filePath, format, url);
          } else {
            console.error("Invalid quality option number!");
            rl.close();
          }
        }
      );
    })
    .catch((err) => {
      console.error("Error occurred:", err);
      rl.close();
    });
});

function downloadVideo(filePath, format, url) {
  const downloadStream = ytdl(url, { format: format });
  const fileStream = fs.createWriteStream(filePath);

  downloadStream.on("progress", (chunkLength, downloaded, total) => {
    const percentage = (downloaded / total) * 100;
    console.log(`Downloaded: ${percentage.toFixed(2)}%`);
  });

  downloadStream.pipe(fileStream);

  downloadStream.on("end", () => {
    console.log("\nDownload completed!");
    rl.close();
  });

  downloadStream.on("error", (err) => {
    console.error("Error occurred during download:", err);
    rl.close();
  });
}
