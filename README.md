## FLICKR FETCHER 🐶

---

To set up, run:

`npm install`

---

To develop run

`npm run dev`

This serves the project at `localhost:1234`.

---

To build for production run,

`npm run build`

this bundles the code to the `dist/` folder.

---

## Description

The gallery fetches a page of 100 images from flickr:s API and presents them in small thumbnails in a dynamic grid view. When the user clicks on an image it is shown in higher resolution.

Some features:

- The gallery's size is dynamic, try to resize the window or change the preset size in `imageGallery.scss`.

- When the user scrolls through the gallery more images are automatically loaded.

- High res images are cached in the dom so they don't have to be reloaded.

- The right and left arrow keys can be used to navigate between images in the preview. This can also be done with the buttons shown under the image.

- The gallery now fetches images on dogs, this can be changed, by editing the `tag`-variable in `flickrFetcher.js`.

For easy access, the project is also hosted on:

https://oscarheimdahl.github.io/flickr-browser.
