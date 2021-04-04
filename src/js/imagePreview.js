import spinner from '../assets/spinner.png';

let lastPreviewedImage = null;

const buildImagePreviewContainer = () => {
  const loadingIndicator = buildPreviewLoadingIndicator();

  const imagePreviewContainer = document.createElement('div');
  imagePreviewContainer.id = 'image-preview-container';
  imagePreviewContainer.addEventListener('click', (e) => {
    if (e.target.id !== 'image-preview-container') return;
    hideImagePreview();
  });

  const previewButtons = buildImagePreviewButton();

  document.body.appendChild(imagePreviewContainer);
  document.body.appendChild(loadingIndicator);
  document.body.appendChild(previewButtons);
  setKeybinds();
};

const buildImagePreviewButton = () => {
  const buttonRow = document.createElement('div');
  buttonRow.id = 'image-preview-button-row';

  const nextButton = document.createElement('button');
  nextButton.innerText = '>';
  nextButton.addEventListener('click', showNextImage);

  const prevButton = document.createElement('button');
  prevButton.innerText = '<';
  prevButton.addEventListener('click', showPrevImage);

  buttonRow.appendChild(prevButton);
  buttonRow.appendChild(nextButton);

  return buttonRow;
};

const buildPreviewLoadingIndicator = () => {
  const loadingIndicator = document.createElement('div');
  loadingIndicator.id = 'image-preview-loading-indicator';
  var img = new Image();
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

const hideImagePreview = () => {
  const previewButtons = document.getElementById('image-preview-button-row');
  previewButtons.style.display = 'none';
  const imagePreview = document.getElementById('image-preview-container');
  imagePreview.style.display = 'none';
  const children = imagePreview.childNodes;
  for (var i = 0; i < children.length; i++) {
    children[i].style.display = 'none';
  }
};

const previewImage = (image, id, target) => {
  lastPreviewedImage = target;
  const previewContainer = document.getElementById('image-preview-container');
  const cachedImage = document.getElementById(id);
  if (cachedImage) showCachedImage(cachedImage);
  else appendNewImageToPreviewContainer(previewContainer, image);
  previewContainer.style.display = 'grid';
  const previewButtons = document.getElementById('image-preview-button-row');
  previewButtons.style.display = 'flex';
};

const appendNewImageToPreviewContainer = (previewContainer, image) => {
  const cacheSize = 50;
  setLoadingIndicatorVisibility('visible');
  image.addEventListener('load', () => setLoadingIndicatorVisibility('hidden'));
  previewContainer.appendChild(image);
  if (previewContainer.childNodes.length > cacheSize)
    removeFirstChild(previewContainer);
};

const showCachedImage = (cachedImage) => {
  cachedImage.style.display = 'block';
};

const removeFirstChild = (div) => {
  div.removeChild(div.childNodes[0]);
};

const setKeybinds = () => {
  document.body.onkeydown = (e) => {
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
  const nextImage = prevThumbnail.childNodes[1];
  hideImagePreview();
  nextImage.dispatchEvent(new MouseEvent('click'));
};

const showNextImage = () => {
  const nextThumbnail = lastPreviewedImage.parentElement.nextSibling;
  if (!nextThumbnail) return;
  const nextImage = nextThumbnail.childNodes[1];
  hideImagePreview();
  nextImage.dispatchEvent(new MouseEvent('click'));
};

module.exports = { buildImagePreviewContainer, previewImage };
