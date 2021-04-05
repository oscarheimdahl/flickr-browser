import spinner from '../assets/spinner.png';
import arrowRight from '../assets/arrow-right.png';

let lastPreviewedImage = null;

const buildImagePreviewContainer = () => {
  const imagePreviewContainer = document.createElement('div');
  imagePreviewContainer.id = 'image-preview-container';
  imagePreviewContainer.addEventListener('click', (e) => {
    if (e.target.id === 'image-preview-container') hideImagePreview();
  });

  const buttonRow = buildButtonRow();
  const loadingIndicator = buildPreviewLoadingIndicator();
  const imagePreview = document.createElement('div');
  imagePreview.id = 'image-preview';

  imagePreviewContainer.appendChild(imagePreview);
  imagePreviewContainer.appendChild(buttonRow);

  document.body.appendChild(imagePreviewContainer);
  document.body.appendChild(loadingIndicator);
  setKeybinds();
};

const buildButtonRow = () => {
  const prevImageButton = buildPrevImageButton();
  const nextImageButton = buildNextImageButton();
  const buttonRow = document.createElement('div');
  buttonRow.className = 'preview-button-row';
  buttonRow.appendChild(prevImageButton);
  buttonRow.appendChild(nextImageButton);
  return buttonRow;
};

const buildNextImageButton = () => {
  const nextButton = document.createElement('button');
  nextButton.className = 'preview-button';
  const img = new Image();
  img.alt = 'next';
  img.src = arrowRight;
  nextButton.appendChild(img);
  nextButton.addEventListener('click', showNextImage);
  return nextButton;
};

const buildPrevImageButton = () => {
  const prevButton = document.createElement('button');
  prevButton.className = 'preview-button';
  const img = new Image();
  img.alt = 'previous';
  img.src = arrowRight;
  prevButton.appendChild(img);
  prevButton.addEventListener('click', showPrevImage);
  return prevButton;
};

const buildPreviewLoadingIndicator = () => {
  const loadingIndicator = document.createElement('div');
  loadingIndicator.id = 'image-preview-loading-indicator';
  const img = new Image();
  img.alt = 'Loading';
  img.src = spinner;
  loadingIndicator.appendChild(img);
  return loadingIndicator;
};

const setLoadingIndicatorVisibility = (visibility) => {
  document.getElementById(
    'image-preview-loading-indicator'
  ).style.visibility = visibility;
};

// Hides the preview and all cached images, so only one is show at the time.
const hideImagePreview = () => {
  const imagePreview = document.getElementById('image-preview-container');
  imagePreview.style.display = 'none';
  const images = document.getElementById('image-preview').children;
  for (var i = 0; i < images.length; i++) {
    images[i].style.display = 'none';
  }
};

const previewImage = (image, id, target) => {
  lastPreviewedImage = target;
  const previewContainer = document.getElementById('image-preview-container');
  const cachedImage = document.getElementById(id);
  if (cachedImage) cachedImage.style.display = 'block';
  else appendNewImageToPreviewContainer(image);
  previewContainer.style.display = 'flex';
};

// Loads the new high res image or shows it if it is cached.
const appendNewImageToPreviewContainer = (image) => {
  const images = document.getElementById('image-preview');
  const cacheSize = 50;
  setLoadingIndicatorVisibility('visible');
  image.addEventListener('load', () => setLoadingIndicatorVisibility('hidden'));
  images.appendChild(image);
  if (images.childNodes.length > cacheSize)
    images.removeChild(images.childNodes[0]);
};

const setKeybinds = () => {
  document.body.onkeydown = (e) => {
    // Only accepts keys if the preview is currently opened
    if (
      !lastPreviewedImage ||
      document.getElementById('image-preview-container').style.display ===
        'none'
    )
      return;
    if (e.key === 'Escape') hideImagePreview();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'ArrowRight') showNextImage();
  };
};

const showPrevImage = () => {
  const prevThumbnail = lastPreviewedImage.parentElement.previousSibling;
  if (!prevThumbnail) return;
  const prevImage = prevThumbnail.lastChild;
  hideImagePreview();
  prevImage.dispatchEvent(new MouseEvent('click'));
};

const showNextImage = () => {
  const nextThumbnail = lastPreviewedImage.parentElement.nextSibling;
  if (!nextThumbnail) return;
  const nextImage = nextThumbnail.lastChild;
  hideImagePreview();
  nextImage.dispatchEvent(new MouseEvent('click'));
};

module.exports = { buildImagePreviewContainer, previewImage };
