const degreesOptions = document.querySelector('.control-panel__temperature')
const degreesButtons = document.querySelectorAll('.control-panel__temperature div')

const languageOptions = document.querySelector('.language-droplist__options')

const place = document.querySelector('.weather__location');
const time = document.querySelector('.weather__data-time');
const todayTemperature = document.querySelector('.weather__today__temperature');
const todayIcon = document.querySelector('.weather__today__img');
const todayDescription = document.querySelector('.weather__today__forecast__description');

const severalDays = document.querySelectorAll('.weather__three-days__container__day');
const severalDaysTemperature = document.querySelectorAll('.weather__three-days__container__forecast__temperature');
const severalDaysIcon = document.querySelectorAll('.weather-icon');

const mapLatitude = document.querySelector('.map__coordinates__latitude');
const mapLongitude = document.querySelector('.map__coordinates__longitude');

const searchInput = document.querySelector('.search-input')
const searchButton = document.querySelector('.search')

languageOptions.addEventListener('change', changeLanguage);
degreesOptions.addEventListener('click', selectTemperature)

searchInput.addEventListener('search', searchLocation)
searchButton.addEventListener('click', searchLocation)

let measures;
let windSpeed;
let searchCity;
let timeZoneValue;

async function getWeather(lat, lng) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&lang=${languageOptions.value}&cnt=25&units=${measures}&APPID=c9294924737219b08eb1a4a4dd6209b2`;
    const res = await fetch(url);
    const data = await res.json();
    
    displayWeather(data.list[0], data.list[8], data.list[16], data.list[24]);
}
  
function displayWeather(data, ...severalDaysWeather) {
  const{temp, feels_like, humidity} = data.main;
  const {id, description} = data.weather[0];
  const wind = Math.round(data.wind.speed);
  
  todayTemperature.textContent = `${Math.round(temp)}°`;

  selectLanguagePattern(feels_like, humidity, description, wind)
  
  todayIcon.src = setIcon(id);

 const forecastTemperature = severalDaysWeather.map(elem => parseInt(Math.round(elem.main.temp)))
 const forecastIcons = severalDaysWeather.map(elem => elem.weather[0].id)

 displayForecast(forecastTemperature,forecastIcons)
}  

function displayForecast(tempArr, iconArr) {
  severalDaysTemperature.forEach((elem, index) =>{
    elem.textContent = `${tempArr[index]}°`
  });
  severalDaysIcon.forEach((elem, index) =>{
    elem.src = setIcon(iconArr[index])
  });
}

async function getPositionByIp() {
  try {
    const request = await fetch("https://ipinfo.io/json?token=ebeb717bf42639")
    const json = await request.json();
    const position = json.loc.split(',')
    return position;
  } catch (e) {
    getError(searchInput, `ERROR(${e.code}): ${e.message}`);
  }
}

async function getPositionByOpenCage() {
  try {
    let coordinates = await getPositionByIp();
    const q = searchCity || coordinates;
    const request = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${q}&language=${languageOptions.value}&key=3f8cc3e61ead4a2baf65d115037234b2`)
    const json = await request.json();
    const location = json.results[0].components.city || json.results[0].components.county || json.results[0].components.province || json.results[0].components.place
    const {country} = json.results[0].components;
    place.textContent = `${location}, ${country}`;
    timeZoneValue = json.results[0].annotations.timezone.name
    mapLatitude.textContent = `${json.results[0].annotations.DMS.lat}`;
    mapLongitude.textContent = `${json.results[0].annotations.DMS.lng}`;
    await getWeather(json.results[0].geometry.lat,json.results[0].geometry.lng)
    await getMap(json.results[0].geometry.lng,json.results[0].geometry.lat)
  }  catch (e) {  
    getError(searchInput, `ERROR(${e.code}): ${e.message}`);
  }
}

async function getMap(lng, lat) {
  try {
    mapboxgl.accessToken = 'pk.eyJ1Ijoia3JpbGlhbjg4IiwiYSI6ImNrbHc2bnR2NTBoZmYycG82dXNqaGJpZ28ifQ.XFI7bCUjMRXp6_KZvfePOg'
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 11,
      center: [lng, lat],
    });
  } catch (e) {
    getError(searchInput, `ERROR(${e.code}): ${e.message}`);
  }
}

function changeLanguage (event) {
  switch (event.target.options[event.target.selectedIndex].value) {
    case 'en':
      language = 'en'
      getPositionByOpenCage()
      break
    case 'ru':
      language = 'ru'
      getPositionByOpenCage()
      break
  }
}

function selectTemperature(event) {
  degreesButtons.forEach((elem) => {
    elem.classList.remove('active')
  })
  event.target.classList.add('active')
  switch (event.target.dataset.temp) {
    case 'imperial':
      localStorage.setItem('temperature', 'imperial')
      measures = 'imperial'
      windSpeed = languageOptions.value === 'en' ? 'miles/h' : 'миль/ч'
      getPositionByOpenCage()
      break
    case 'metric':
      localStorage.setItem('temperature', 'metric')
      measures = 'metric'
      windSpeed = languageOptions.value === 'en' ? 'meters/s' : 'метров/c'
      getPositionByOpenCage()
      break
  }
}

function localStorageHandler() {
  languageOptions.value = localStorage.getItem('language') || 'en'
  measures = localStorage.getItem('temperature') || 'imperial'
  degreesButtons.forEach((elem) => {
    if (elem.dataset.temp === measures) {
      elem.classList.add('active')
    }
  })
}

function selectLanguagePattern(feels_like, humidity,description,wind) {
  switch(languageOptions.value) {
    case 'ru':
    localStorage.setItem('language', 'ru')
    setDateAndTime()
    mapLatitude.innerHTML = `<span>Широта: ${mapLatitude.textContent}</span>`
    mapLongitude.innerHTML = `<span>Долгота: ${mapLongitude.textContent}</span>`
    windSpeed = measures === 'imperial' ? 'миль/ч' : 'м/с'
    searchInput.placeholder = 'Поиск города'
    searchButton.innerText = 'поиск'
    todayDescription.innerHTML = `<span>${description}</span>
          <span>ощущается: ${Math.round(feels_like)}°</span>
          <span>ветер: ${wind} ${windSpeed}</span>
          <span>влажность: ${humidity}%</span>`
      break
    case 'en':
    localStorage.setItem('language', 'en')
    setDateAndTime()
    mapLatitude.innerHTML = `<span>Latitude: ${mapLatitude.textContent}</span>`
    mapLongitude.innerHTML = `<span>Longitude: ${mapLongitude.textContent}</span>`
    windSpeed = measures === 'imperial' ? 'mph' : 'm/s'
    searchInput.placeholder = 'Search city'
    searchButton.innerText = 'search'
    todayDescription.innerHTML = `<span>${description}</span>
          <span>feels like: ${Math.round(feels_like)}°</span>
          <span>wind: ${wind} ${windSpeed}</span>
          <span>humidity: ${humidity}%</span>`
      break
  }
}

function setDateAndTime() {
  const date = new Date();
  const options = {
    timeZone: timeZoneValue,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  }
  time.innerHTML = date.toLocaleString(`${languageOptions.value}`, options)
  setTimeout(() => setDateAndTime(), 1000)
  getDayOfWeek(date.getDay())
}

function getDayOfWeek(dayNumber) {
  const weekDaysRu = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const weekDaysEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let daysArray;
  if(localStorage.getItem('language') === 'ru') {
    daysArray = weekDaysRu;
  } else {
    daysArray = weekDaysEn;
  }
  for (let i = 0; i < severalDays.length; i += 1) {
    dayNumber += 1;
    if (dayNumber === 7) {
      dayNumber = 0;
    }
    
    severalDays[i].textContent = daysArray[dayNumber];
  }
}

async function searchLocation() {
  try {
  searchCity = searchInput.value;
  await getPositionByOpenCage()
  searchInput.value = '';
  } catch (e) {
    getError(searchInput, `ERROR(${e.code}): ${e.message}`);
  }
}

function setIcon(id) {
  if (id<300 && id>=200) {
    return 'img/thunderstorms.svg';
  } else if (id<400 && id>=300) {
    return 'img/drizzle.svg';
  } else if (id<600 && id>=500) {
    return 'img/rain.svg';
  } else if(id<700 && id>=600) {
   return 'img/snow.svg';
  } else if(id<800 && id>700) {
  return 'img/mist.svg';
  } else if (id==800){
  return 'img/mist.svg';
  } else if (id<810 && id>800){
  return 'img/cloudy.svg';
  } else  {
  return 'img/partly-cloudy-day.svg';
  }      
}

function getError(element, text) {
  const errorMessage = document.createElement('div')
  errorMessage.className = 'error-message'
  errorMessage.textContent = text
  document.body.append(errorMessage)
  const coords = element.getBoundingClientRect()
  let left = coords.left + (element.offsetWidth - errorMessage.offsetWidth) / 2
  let top = coords.top - errorMessage.offsetHeight - 5
  if (left < 0) {
    left = 0
  }
  if (top < 0) {
    top = coords.top + element.offsetHeight + 5
  }
  errorMessage.style.left = `${left}px`
  errorMessage.style.top = `${top}px`
  setTimeout(() => errorMessage.remove(), 3000)
}

function init() {
  localStorageHandler()
  getPositionByOpenCage()
}

window.addEventListener('DOMContentLoaded', init);
