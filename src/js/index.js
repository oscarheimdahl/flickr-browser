import 'babel-polyfill'; //to support async
import '../scss/index.scss';
import '../scss/imageGallery.scss';
import '../scss/imagePreview.scss';
import './flickrFetcher';
import buildImageGallery from './imageGallery';

buildImageGallery(document.body);
