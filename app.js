// const API_Key = '4b068049ffa664b2799cf3a7d6b0d4e7';

// function renderWeatherInfo(data) {
//   let newPara = document.createElement('p');
//   // newPara.textContent = data.main.temp;
//   newPara.textContent = `${data?.main?.temp.toFixed(2)} °C`;
//   document.body.appendChild(newPara);
// }

// async function fetchWeatherDetail() {
//   let city = 'goa';

//   try {
//     const responce = await fetch (`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_Key}&units=metric`);
//     const data = await responce.json();
//     console.log('Weather data', data);

//     renderWeatherInfo(data);
//   } catch (err) {
//     console.log('Error');
//   }
// }

// fetchWeatherDetail(); 

// async function getCustomWeatherDetails() {
//   let lat = 28.6128;
//   let lon = 77.2311;

//   try {
//     const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_Key}&units=metric`);
//     const data = await response.json();
//     console.log(data);
//   } catch(err) {
//     console.log('Error', err)
//   }
// }

// getCustomWeatherDetails();


// function getLocation() {
//   if(navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(showPosition);
//   }
//   else {
//     console.log('no geolocation support');
//   }
// }

// function showPosition(position) {
//   let lat = position.coords.latitude;
//   let lon = position.coords.longitude;

//   console.log(lat);
//   console.log(lon);
// }

// getLocation();


const userTabEl = document.querySelector('[dataUserWeather]');
const searchTabEl = document.querySelector('[dataSearchWeather]');
const weatherEl = document.querySelector('.weather');
const grantLocationEl = document.querySelector('.grant-location');
const searchFormEl = document.querySelector('[dataSearchForm]');
const loadingEl = document.querySelector('.loading');
const userInfoEl = document.querySelector('.user-info');
const apiErrorEl = document.querySelector('.api-error')
const apiErrorMessageEl = document.querySelector('[dataApiErrorMessage]')
const apiKey = '4b068049ffa664b2799cf3a7d6b0d4e7';

// Setting default tab
let currentTab = userTabEl;

currentTab.classList.add('active');
getfromSessionStorage();

function switchTab(clickedTab) {
  // apiErrorEl.classList.remove("active");
  if(clickedTab != currentTab) {
    currentTab.classList.remove('active');
    currentTab = clickedTab;
    currentTab.classList.add('active');

    if(!searchFormEl.classList.contains('active')) {
      userInfoEl.classList.remove('active');
      grantLocationEl.classList.remove('active');
      searchFormEl.classList.add('active');
    }
    else {
      searchFormEl.classList.remove('active');
      userInfoEl.classList.remove('active');
      getfromSessionStorage();
    }
  }
}

userTabEl.addEventListener('click', () => {
  switchTab(userTabEl);
});

searchTabEl.addEventListener('click', () => {
  switchTab(searchTabEl);
});

function getfromSessionStorage() {
  const localCoordinates = sessionStorage.getItem('user-coordinates');
  if(!localCoordinates) {
    grantLocationEl.classList.add('active');
  }
  else {
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
  }
}

async function fetchUserWeatherInfo(coordinates) {
  console.log(coordinates);
  const {lat, lon} = coordinates;
  grantLocationEl.classList.remove('active');
  loadingEl.classList.add('active');

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    loadingEl.classList.remove('active');
    userInfoEl.classList.add('active');
    renderWeatherInfo(data);
  } catch (err) {
    loadingEl.classList.remove('active');
  }
}

function renderWeatherInfo(weatherInfo) {
  const cityName = document.querySelector('[dataCityName]');
  const countryIcon = document.querySelector('[dataCountryIcon]');
  const desc = document.querySelector('[dataWeatherDesc]');
  const weatherIcon = document.querySelector('[dataWeatherIcon]');
  const temp = document.querySelector('[dataTemp]');
  const windSpeed = document.querySelector('[dataWindSpeed]');
  const humidity = document.querySelector('[dataHumidity]');
  const clouds = document.querySelector('[dataClouds]');

  
  cityName.textContent = weatherInfo?.name; // optional chaining operator
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.textContent = weatherInfo?.weather?.[0]?.main;
  weatherIcon.src = `https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.textContent = `${weatherInfo?.main?.temp} °C`;
  windSpeed.textContent = `${weatherInfo?.wind?.speed}m/s`;
  humidity.textContent = `${weatherInfo?.main?.humidity}%`;
  clouds.textContent = `${weatherInfo?.clouds?.all}%`;
}

function getLocation() {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  else {
    console.log('no geolocation support available');
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude
  }

  sessionStorage.setItem('user-coordinates', JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector('[dataGrantAccess]');
grantAccessButton.addEventListener('click', getLocation);

const searchInput = document.querySelector('[dataSearchInput]');
searchFormEl.addEventListener('submit', (e) => {
  e.preventDefault();

  if(searchInput.value === '') return;

  fetchSearchWeatherInfo(searchInput.value);
});

async function fetchSearchWeatherInfo(city) {
  loadingEl.classList.add('active');
  userInfoEl.classList.remove('active');
  apiErrorEl.classList.remove("active");

  try {
    const responce = await fetch (`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await responce.json();
    if (!data.sys) {
      throw data;
    }
    loadingEl.classList.remove('active');
    userInfoEl.classList.add('active');
    renderWeatherInfo(data);
  } catch(err) {
    loadingEl.classList.remove('active');
    apiErrorEl.classList.add('active');
    apiErrorMessageEl.textContent = `${err?.message}`;
  }
}
