const KEY = "9195a11eb2a9850d56c70cefc4421211";

const myTab = document.querySelector("[yourWeather]");
const searchTab = document.querySelector("[searchWeather]");
const weatherInfo = document.querySelector(".weatherInfo");
const searchContainer = document.querySelector(".searchform-container");
const grantAccessDiv = document.querySelector(".grant-access");
const loader = document.querySelector(".loader");

checkSessionStorage();
let currentTab = myTab;
currentTab.classList.add("currentTab");

function switchTab(clickedTab){    
    if(clickedTab!=currentTab){
        currentTab.classList.remove("currentTab");
        currentTab = clickedTab;
        currentTab.classList.add("currentTab");
        console.log(`switched to ${clickedTab.dataset.tabname}`);

        if (currentTab.dataset.tabname === "SearchTab") {
          searchContainer.classList.add("active");
          grantAccessDiv.classList.remove("active");

          if (weatherInfo.classList.contains("active")) {
            weatherInfo.classList.remove("active");
          }
        } else {
          searchContainer.classList.remove("active");
          weatherInfo.classList.remove("active");
          
          checkSessionStorage();
        }
    }
}

myTab.addEventListener("click", () =>  switchTab(myTab));
searchTab.addEventListener("click",() => switchTab(searchTab));

function checkSessionStorage() {
  const currentCoordinates = sessionStorage.getItem("coordinates");
  if (!currentCoordinates) {
    grantAccessDiv.classList.add("active");
  } else {
    const userCoordinates = JSON.parse(currentCoordinates);
    getWeather(userCoordinates);
  }
}

//on-click function GRANT-ACCESS
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(saveLocation);
  } else {
    throw new Error(" OOPS, geolocation API not supported!");
  }
}

function saveLocation(location) {
  const userCoordinates = { 
    lat: location.coords.latitude,
    lon: location.coords.longitude,
  };
  sessionStorage.setItem("coordinates", JSON.stringify(userCoordinates));
  getWeather(userCoordinates);
}

async function getWeather(userCoordinates) {
  const { lat, lon } = userCoordinates;

  grantAccessDiv.classList.remove("active");
  // loading
  loader.classList.add("active");
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${KEY}&units=metric`
    );

    const data = await response.json();
    renderInfo(data);
  } catch (error) {
   throw new Error(error.message);
  }
}

// UI Updation
function renderInfo(data) {  
  loader.classList.remove("active");  
  weatherInfo.classList.add("active");

  const city = document.querySelector("[cityName]");
  const description = document.querySelector("[weather-desc]");
  const icon = document.querySelector("[weatherIcon]");
  const temp = document.querySelector("[temp]");

  city.innerText = data?.name;
  description.innerText = data?.weather?.[0]?.description;
  icon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`; 
  temp.innerText = `${data?.main?.temp.toFixed(2)} °C`;
}
// Search Weather
const searchForm = document.querySelector("[searchForm]");
const city = document.querySelector("#cityInput");

searchForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    if(city.value === ""){
        console.log("Input value is Empty");
        return
    }
    searchCityWeather(city.value);
    city.value = "";
})

async function searchCityWeather(city){
    weatherInfo.classList.remove("active");
    loader.classList.add("active");
    try{ let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEY}&units=metric`
    );
    let data = await response.json();

    renderInfo(data);
    }catch{
        console.log(`${city}'s weather not found :(`)
    }
}