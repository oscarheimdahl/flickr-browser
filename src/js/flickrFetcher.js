const pageURL = (page) => {
  const tag = 'Dog';
  //'https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=78853fd40dda05af7c497ac8940178cd&tags=Dog&page=1&format=json&nojsoncallback=1';
  const URL = `
  https://www.flickr.com/services/rest/?
  method=flickr.photos.search&
  api_key=78853fd40dda05af7c497ac8940178cd&
  tags=${tag}&
  page=${page}&
  format=json&
  nojsoncallback=1`.trim();
  return URL;
};

const getPhotoPage = async (pageNumber) => {
  const url = pageURL(pageNumber);
  const page = fetch(url).then((res) => res.json());
  return page;
};

// Sizes
// s 	 small square 75x75
// q 	 large square 150x150
// t 	 thumbnail, 100 on longest side
// m 	 small, 240 on longest side
// n 	 small, 320 on longest side
// - 	 medium, 500 on longest side
// z 	 medium 640, 640 on longest side
// c 	 medium 800, 800 on longest side†
// b 	 large, 1024 on longest side*
// o 	 original image, either a jpg, gif or png, depending on source format
const imageInfoToURL = (serverID, id, secret, size) => {
  return `https://live.staticflickr.com/${serverID}/${id}_${secret}_${size}.jpg`;
};

module.exports = { getPhotoPage, imageInfoToURL };
//78853fd40dda05af7c497ac8940178cd
//ee76b13ca46e7e43
//https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=78853fd40dda05af7c497ac8940178cd&tags=Dog&format=json&nojsoncallback=1
//https://live.staticflickr.com/[S-ID]/[ID]_[SECRET]_w.jpg
