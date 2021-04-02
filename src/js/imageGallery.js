import { getPhotoPage, imageInfoToURL } from './flickrFetcher';
import { buildImagePreviewContainer, previewImage } from './imagePreview';

let pageToFetch = 1;
let loadedAll = false;
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

  appendImagesFromPage(pageToFetch);
  buildImagePreviewContainer();
};

const appendImagesFromPage = (page) => {
  showLoading(true);
  getPhotoPage(page)
    .then((pageData) => {
      pageData.photos.photo.forEach((photoInfo) => {
        appendThumbnail(photoInfo);
      });
      showLoading(false);
      pageToFetch++;
      if (pageToFetch > pageData.photos.pages) loadedAll = true;
    })
    .catch((e) => {
      alert(e);
    });
};

const buildEndlessScrollIndicator = () => {
  const indicatorContainer = document.createElement('div');
  indicatorContainer.id = 'endless-scroll-indicator-container';
  const helpText = document.createElement('h4');
  helpText.id = 'endless-scroll-indicator';
  helpText.innerText = 'Loading images...';
  indicatorContainer.appendChild(helpText);
  return indicatorContainer;
};

const showLoading = (loading) => {
  let text = loading ? 'Loading images...' : 'Scroll to bottom to load more...';
  if (loadedAll) text = 'No more images';
  document.getElementById('endless-scroll-indicator').innerText = text;
};

const onGalleryScroll = (e) => {
  const gallery = e.target;
  console.log(`Here!`);
  if (gallery.offsetHeight + gallery.scrollTop >= gallery.scrollHeight) {
    if (!canLoad()) return;
    appendImagesFromPage(pageToFetch);
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
  var img = new Image();
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
  previewImage(image, photoInfo.id);
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
