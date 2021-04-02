import spinner from '../assets/spinner.png';

const buildImagePreviewContainer = () => {
  const loadingIndicator = buildPreviewLoadingIndicator();
  const imagePreviewContainer = document.createElement('div');
  imagePreviewContainer.id = 'image-preview-container';
  imagePreviewContainer.addEventListener('click', hideImagePreview);
  document.body.appendChild(imagePreviewContainer);
  document.body.appendChild(loadingIndicator);
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

const hideImagePreview = (e) => {
  if (e.target.id !== 'image-preview-container') return;
  const imagePreview = document.getElementById('image-preview-container');
  imagePreview.style.display = 'none';
  const children = imagePreview.childNodes;
  for (var i = 0; i < children.length; i++) {
    children[i].style.display = 'none';
  }
};

const previewImage = (image, id) => {
  const previewContainer = document.getElementById('image-preview-container');
  const cachedImage = document.getElementById(id);
  if (cachedImage) showCachedImage(cachedImage);
  else appendNewImageToPreviewContainer(previewContainer, image);
  previewContainer.style.display = 'grid';
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

module.exports = { buildImagePreviewContainer, previewImage };
