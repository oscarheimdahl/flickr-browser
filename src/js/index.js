import 'babel-polyfill'; //to support async
import '../style/index.scss';
import '../style/imageGallery.scss';
import '../style/imagePreview.scss';
import './flickrFetcher';
import buildImageGallery from './imageGallery';

buildImageGallery(document.body);
