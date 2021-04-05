const refreshImage = document.querySelector('.refresh_img');
const refreshButton = document.querySelector('.refresh');
  
async function getLinkToImage() {
  try{
    const url = 'https://api.unsplash.com/photos/random?orientation=landscape&per_page=1&query=nature&client_id=pYT2N6XUykWHbbxKEa9rR2W4xuwwhmca6GhS9C7BlQA';
    const res = await fetch(url);
    const data = await res.json();
    document.body.style.backgroundImage = `url(${data.urls.regular})`;
  } catch (e) {
    getError(searchInput, `ERROR(${e.code}): ${e.message}`);
  }  
}

async function refreshApp() {
  try{
    await getLinkToImage()
    refreshImage.classList.add('active')
    setTimeout(() => {
      refreshImage.classList.remove('active')}, 1000)
  } catch (e) {
    getError(searchInput, `ERROR(${e.code}): ${e.message}`);
  }  
}

refreshButton.addEventListener('click', refreshApp);
