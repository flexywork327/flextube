from os import path
from tkinter import *
from tkinter import filedialog
from moviepy import *
from moviepy.editor import VideoFileClip
from pytube import YouTube
import shutil


# function to select path
def select_path():
    # allow user to select a path and store it in global var path
    path = filedialog.askdirectory()
    path_label.config(text=path)


# function to download video
def download_video():
    # get the link from the link field
    link = link_field.get()

    # get the path from the path field
    path = path_label.cget("text")
    screen.title("Downloading...")

    # get the video stream
    mp4_video = YouTube(link).streams.get_highest_resolution().download()
    vid_clip = VideoFileClip(mp4_video)
    vid_clip.close()
    screen.title("flextube - a youtube video downloader")


    # move the video to the selected path
    shutil.move(mp4_video, path)

    # show success message
    Label(screen, text="Download Finished", font=("jost", 15)).pack()


screen = Tk()
title = screen.title("flextube - a youtube video downloader")
canvas = Canvas(screen, width=500, height=500)
canvas.pack()

# image logo
logo = PhotoImage(file="download.png")

# resize image
logo = logo.subsample(2, 2)

canvas.create_image(250, 80, image=logo)

# link feild
link_field = Entry(screen, width=50)
link_label = Label(screen, text="Enter the link here: ", font=("jost", 15))

# select path to save the downloaded file
path_label = Label(screen, text="Select path for download: ", font=("jost", 15))
select_button = Button(screen, text="Select", font=("jost", 15), command=select_path)

# Add to window
canvas.create_window(250, 280, window=path_label)
canvas.create_window(250, 330, window=select_button)

# Add widgets to screen
canvas.create_window(250, 170, window=link_label)
canvas.create_window(250, 220, window=link_field)

# download button
download_button = Button(screen, text="Download", font=("jost", 15), bg="red", fg="white", command=download_video)
canvas.create_window(250, 390, window=download_button)

screen.mainloop()
