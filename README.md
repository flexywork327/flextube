# Welcome to FlexTube

FlexTube is a minimalistic command line node js application that allows users to download YouTube videos. It is built using the Express framework and the youtube-dl library.

## Installation

1. Clone the repository
2. Run `npm install` to install the dependencies
3. Run `npm start` to start the server

## Usage

To download a video, simply run the following command in your terminal:

```bash
node index.js
```

You will be prompted to enter the URL of the video you want to download. You can enter the URL in the following format:

```bash
Enter the YouTube video URL: https://www.youtube.com/watch?v=xxxxxxxxxxx
```

After entering the URL, you will prompted to select the video quality you want to download. You can select the quality by entering the number corresponding to the quality you want to download.

```bash
Select Available video qualities:
    1. 360p
    2. 720p
```

After selecting the quality, the video will be downloaded to the `downloads` folder in the root directory of the project.

## Author

- [Felix Asare - GitHub](https://github.com/flexywork327)
