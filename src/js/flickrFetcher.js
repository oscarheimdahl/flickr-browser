const pageURL = (page) => {
  const tag = 'Dog';
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

// Available size suffixes, in order are: s, q, t, m ,n ,-, z, c ,b, o
const imageInfoToURL = (serverID, id, secret, size) => {
  return `https://live.staticflickr.com/${serverID}/${id}_${secret}_${size}.jpg`;
};

module.exports = { getPhotoPage, imageInfoToURL };
//78853fd40dda05af7c497ac8940178cd
//ee76b13ca46e7e43
//https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=78853fd40dda05af7c497ac8940178cd&tags=Dog&format=json&nojsoncallback=1
//https://live.staticflickr.com/[S-ID]/[ID]_[SECRET]_w.jpg
