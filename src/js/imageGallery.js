import { getPhotoPage, imageInfoToURL } from './flickrFetcher';
import { buildImagePreviewContainer, previewImage } from './imagePreview';

let pageToFetch = 1;
let preventLoad = false;

const buildImageGallery = (parent) => {
  const imageGalleryContainer = document.createElement('div');
  imageGalleryContainer.id = 'image-gallery-container';
  imageGalleryContainer.onscroll = onGalleryScroll;

  const imageGallery = document.createElement('div');
  imageGallery.id = 'image-gallery';
  imageGalleryContainer.append(imageGallery);

  const endlessScrollIndicator = buildEndlessScrollIndicator();
  imageGalleryContainer.append(endlessScrollIndicator);

  parent.append(imageGalleryContainer);

  appendImagesFromPage();
  buildImagePreviewContainer();
};

const appendImagesFromPage = () => {
  setLoadingMessage('Loading images...');
  getPhotoPage(pageToFetch)
    .then((pageData) => {
      pageData.photos.photo.forEach((photoInfo) => {
        appendThumbnail(photoInfo);
      });
      pageToFetch++;
      if (pageToFetch > pageData.photos.pages)
        setLoadingMessage('No more images');
      else setLoadingMessage('');
    })
    .catch((e) => {
      setLoadingMessage('Could not load images');
    });
};

const buildEndlessScrollIndicator = () => {
  const indicatorContainer = document.createElement('div');
  indicatorContainer.id = 'load-page-container';

  const loadingText = document.createElement('h4');
  loadingText.id = 'page-loading-indicator';
  indicatorContainer.appendChild(loadingText);

  return indicatorContainer;
};

const setLoadingMessage = (message) => {
  document.getElementById('page-loading-indicator').innerText = message;
};

const onGalleryScroll = (e) => {
  const gallery = e.target;
  if (gallery.offsetHeight + gallery.scrollTop >= gallery.scrollHeight - 500) {
    if (!canLoad()) return;
    appendImagesFromPage();
  }
};

// Prevent the endless scroll from loading more images too frequently.
const canLoad = () => {
  if (preventLoad) return false;
  preventLoad = true;
  setTimeout(() => (preventLoad = false), 1000);
  return true;
};

const appendThumbnail = (photoInfo) => {
  const imageGallery = document.getElementById('image-gallery');
  const thumbnailContainer = buildThumbnailContainer();
  const image = buildThumbnailImage(photoInfo);
  image.addEventListener('load', () =>
    thumbnailContainer.childNodes[0].remove()
  );
  thumbnailContainer.appendChild(image);
  imageGallery.append(thumbnailContainer);
};

const buildThumbnailContainer = () => {
  const thumbnailContainer = document.createElement('div');
  thumbnailContainer.className = 'thumbnail-container';
  const loadingAnimation = document.createElement('div');
  loadingAnimation.className = 'loading-animation';
  thumbnailContainer.appendChild(loadingAnimation);
  return thumbnailContainer;
};

const buildImage = (photoInfo, size) => {
  const img = new Image();
  img.loading = 'lazy';
  img.alt = `Title: ${photoInfo.title}`;
  img.setAttribute('photoInfo', JSON.stringify(photoInfo));
  img.src = imageInfoToURL(
    photoInfo.server,
    photoInfo.id,
    photoInfo.secret,
    size
  );
  return img;
};

const onThumbnailClick = (e) => {
  const photoInfo = JSON.parse(e.target.getAttribute('photoInfo'));
  const image = buildPreviewImage(photoInfo);
  previewImage(image, photoInfo.id, e.target);
};

const buildThumbnailImage = (photoInfo) => {
  const img = buildImage(photoInfo, 'q');
  img.className = 'thumbnail';
  img.addEventListener('click', onThumbnailClick);
  return img;
};

const buildPreviewImage = (photoInfo) => {
  const img = buildImage(photoInfo, 'b');
  img.className = 'image-preview';
  img.id = photoInfo.id;
  return img;
};

export default buildImageGallery;
