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
  const pageLoadingIndicator = buildPageLoadingIndicator();

  imageGalleryContainer.append(imageGallery);
  imageGalleryContainer.append(pageLoadingIndicator);
  parent.append(imageGalleryContainer);

  fetchNextPage();
  buildImagePreviewContainer();
};

// Try to load the next page from flickr and builds the thumbnails to the gallery
const fetchNextPage = () => {
  setLoadingMessage('Loading images...');
  getPhotoPage(pageToFetch)
    .then(appendImagesFromPage)
    .catch((e) => {
      setLoadingMessage('Could not load images');
    });
};

const appendImagesFromPage = (pageData) => {
  pageData.photos.photo.forEach((photoInfo) => {
    appendThumbnail(photoInfo);
  });
  pageToFetch++;
  if (pageToFetch > pageData.photos.pages) setLoadingMessage('No more images');
  else setLoadingMessage('');
};

const buildPageLoadingIndicator = () => {
  const indicatorContainer = document.createElement('div');
  indicatorContainer.id = 'load-page-container';

  const loadingText = document.createElement('h4');
  loadingText.id = 'page-loading-indicator';
  indicatorContainer.appendChild(loadingText);

  return indicatorContainer;
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

const setLoadingMessage = (message) => {
  document.getElementById('page-loading-indicator').innerText = message;
};

const onGalleryScroll = (e) => {
  const gallery = e.target;
  if (gallery.offsetHeight + gallery.scrollTop >= gallery.scrollHeight - 500) {
    if (!canLoad()) return;
    fetchNextPage();
  }
};

// Prevents the endless scroll from triggering too frequently.
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

const onThumbnailClick = (e) => {
  const photoInfo = JSON.parse(e.target.getAttribute('photoInfo'));
  const image = buildPreviewImage(photoInfo);
  previewImage(image, photoInfo.id, e.target);
};

export default buildImageGallery;
