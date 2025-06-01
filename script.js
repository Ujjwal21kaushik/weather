// Pre-loading 
window.addEventListener("load", () => {
  gsap.set(".raindrop", { y: 0, opacity: 1 });

  gsap.timeline({ repeat: -1 })
    .to(".drop1", { y: 60, opacity: 0, duration: 0.6, ease: "power1.in" }, 0)
    .to(".drop2", { y: 60, opacity: 0, duration: 0.6, ease: "power1.in" }, 0.2)
    .to(".drop3", { y: 60, opacity: 0, duration: 0.6, ease: "power1.in" }, 0.4)
    .set(".raindrop", { y: 0, opacity: 1 });

  gsap.to("#preloader", {
    opacity: 0,
    delay: 2.5,
    duration: 1,
    onComplete: () => {
      document.getElementById("preloader").style.display = "none";
    }
  });
});
// ---End here---

const cityinput = document.querySelector('.citys-input') // search-box
const srchbtn = document.querySelector('.srch')
const Apikey =`d7d65cd8e785a5822633eb1c7865cd7e`
const pages = document.querySelector('.page')
// -------infomation filling------- //
const cityname= document.querySelector('.city-name')
const Temp= document.querySelector('.temp-in')
const Main= document.querySelector('.main-info')
const Humidity= document.querySelector('.humidity')
const Wind= document.querySelector('.wind')
const Pressure= document.querySelector('.pressure')
const Feelslike= document.querySelector('.feels_like')
const Weathericon = document.querySelector('.weather-icon')
const CurrDate = document.querySelector('.date')
const Time = document.querySelector('.time')
const weeklydata = document.querySelector('.weekly')


// To get value from the search box

updateweatherinfo("Delhi")
srchbtn.addEventListener('click', (e) =>{
  if (cityinput.value.trim(cityinput.value)!='') {
    updateweatherinfo(cityinput.value)
    cityinput.value=''
    cityinput.blur()
  }
  e.preventdefault;
})
cityinput.addEventListener('keydown', (event)=>{
  if (event.key == 'Enter' && cityinput.value.trim()!=''){
    updateweatherinfo(cityinput.value)
    cityinput.value=''
    cityinput.blur()
  }
  event.preventdefault;
})

//-----Fetch api -------- 

async function getFetchData(endpoint,city) {
  const apiurl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${Apikey}&units=metric`
  const response= await fetch(apiurl)
  return response.json()
}

// --------- Set Icon -----------
function getweathericon(id) {
  if (id <= 232 ) return 'thunder.gif'
  if (id <= 321 ) return 'rain.gif'
  if (id <= 531 ) return 'rain.gif'
  if (id <= 622 ) return 'snow.gif'
  if (id <= 781 ) return 'humid.gif'
  if (id <= 800 ) return 'clear.gif'
  else return 'cloudy.gif'
 
}
// --------- Set Image  -----------
function getweatherimage(id) {
  if (id <= 232 ) return 'strom.jpg'
  if (id <= 321 ) return 'rain.jpg'
  if (id <= 531 ) return 'rain.jpg'
  if (id <= 622 ) return 'rain.jpg'
  if (id <= 781 ) return 'humid.jpg'
  if (id <= 800 ) return 'sunimg.jpg'
  else return 'cloudimg.jpg'
 
}
// ------ Set Current Date----
function getCurrentDate() {
  const currentdate = new Date()
  const options = {
    weekday: 'short',
    day:'2-digit',
    month:'short'
  }
  return currentdate.toLocaleDateString('en-GB',options)
}




//-----Weather Infomation -------- 
async function updateweatherinfo(city){
  const weatherData = await getFetchData('weather', city)
  if (weatherData.cod != 200) {
    alert("City Not Found")
    return
  }
  // console.log(weatherData)
  const {
    name: country,
    main:{temp , humidity ,pressure , feels_like},
    weather:[{id , main}],
    wind:{speed}
  } = weatherData 

  cityname.textContent = country
  Main.textContent =main
  Temp.textContent = Math.round(temp) + '°'
  Humidity.textContent= humidity + '%'
  Wind.textContent= speed + 'M/s'
  Pressure.textContent= pressure + 'mb'
  Feelslike.textContent = feels_like + '°'
  CurrDate.textContent = getCurrentDate()                       //-----Date------
  Weathericon.src =`img\\${getweathericon(id)}`
  pages.style.backgroundImage = `url("img//${getweatherimage(id)}")`  


  // ---------Forecast Infomation---------

  await updateforecastinfo(city)
}

async function updateforecastinfo(city){
  const forecastDate = await getFetchData('forecast',city)

  const timeTaken ='12:00:00'
  const todaydate = new Date().toISOString().split('T')[0]


  weeklydata.innerHTML = ' '
  forecastDate.list.forEach(forecastWeather => {
    if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todaydate) ){
        updateforecastitems(forecastWeather)
    }
  });
}
function updateforecastitems(weatherd){
    // console.log(weatherd)
    const {
      dt_txt: date,
      weather:[{ id }],
      main:{ temp }
    } = weatherd

    const dataTaken = new Date(date)
    const dateoption = {
      day:'2-digit',
      month: 'short'
    }
    const dataResult= dataTaken.toLocaleDateString('en-US', dateoption)

    const weekitem = `    
          <div class="weekly-info">
          <h5>${dataResult}</h5>
          <img src="img/${getweathericon(id)}" width="50" alt="Error" srcset="" />
          <h5 class="temp-weekly">${Math.round(temp) + '°'}</h5>
          </div>`

    weeklydata.insertAdjacentHTML('beforeend',weekitem)
}