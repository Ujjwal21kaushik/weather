const bar = document.querySelector('.search-bar');
const btnimg = document.querySelector('.btn-img');
const navbar = document.querySelector('.nav')
const micimg = document.querySelector('.mic-img')
const speak = document.querySelector('.speak')
const close = document.querySelector('.close')
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let cities = [];
let citiesLoaded = false;
const skipwords = ["weather", "rain", "sun", "cloud", "temperature", "forecast" , "of" , "is" ,"give"] 
const words =["today" ,"tommarow"] 

function toggleLoader(show = true) {
  const loader = document.getElementById("city-loader");
  loader.style.opacity="1"
  if (loader) {
  loader.style.display = show ? "block" : "none";

  }

}

//-----speak function--------
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang ='en-US'
    recognition.interimResults= false;

    let noSpeechtimeout;
    function startnospeechtimer (timeout = 5000){
        noSpeechtimeout=setTimeout(()=>{
            recognition.stop();
            alert("No Speech Detected...")
            speak.style.display= "none";
            micimg.src = micimg.src.replace("redmic.svg" , "mic.svg")
        },timeout);
    }

    function clearnospeechtimer(){
        clearTimeout(noSpeechtimeout)
    }

    micimg.addEventListener('click',(e)=>{
        e.stopPropagation();
        speak.style.display= "block";
        recognition.start();
        startnospeechtimer()
        micimg.src = micimg.src.replace("mic.svg" , "redmic.svg")
    });

    recognition.addEventListener('speechstart',(e)=>{
        clearnospeechtimer();
    });

    recognition.addEventListener('result',(e)=>{
        const text = e.results[0][0].transcript;
        // bar.value = text;
        checkCity(text)
    });

    recognition.addEventListener('speechend',(e)=>{
        clearnospeechtimer()
        recognition.stop();
        micimg.src = micimg.src.replace("redmic.svg" , "mic.svg")
        speak.style.display= "none";
    });
    close.addEventListener('click',(e)=>{
        e.stopPropagation();
        clearnospeechtimer();
        recognition.stop();
        micimg.src = micimg.src.replace("redmic.svg" , "mic.svg")
        bar.style.width = "2rem";
        bar.style.padding="0px 18px 0px 14px"
        btnimg.style.top= "0%";
        btnimg.style.left= "1%";
        micimg.style.opacity = "0"
        speak.style.display= "none";
    })
    
    recognition.addEventListener('error',(e)=>{
        clearnospeechtimer()
        alert(e.error);

    });
}
else{
    alert("Your device does not support")
}
//          ------End-------


// ---- search bar Animation -----
btnimg.addEventListener('click', (e)=>{

  e.stopPropagation();
  bar.style.width = "12rem";
  bar.style.padding="0px 35px 0px 35px";
  btnimg.style.left = "0%";
  micimg.style.opacity = "1";
  if((bar.value.trim(bar.value)!='')){
      checkCity(bar.value);
      bar.value=''
  }
    
})

bar.addEventListener('keydown',(e)=>{
    if (e.key=="Enter" && bar.value.trim(bar.value)!='' ) {
        checkCity(bar.value);
        bar.value=''
    }
})
document.addEventListener('click',(e)=>{
    if (!bar.contains(e.target)) {      
        bar.style.width = "2rem";
        bar.style.padding="0px 18px 0px 14px"
        btnimg.style.top= "0%";
        btnimg.style.left= "1%";
        micimg.style.opacity = "0"
        speak.style.display= "none";
        bar.value=''
        
    }
})
//      ----- Ends ------


// *******------------Fetch cities-------------******** 

fetch("https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/json/cities.json")
.then(res => res.json())
.then(data => {
    cities = data.map(item => item.name.toLowerCase()).filter(city =>!skipwords.includes(city))
    citiesLoaded = true
    })
.catch(err => {
    alert("❌ Failed to load cities:" + err);
  })



// ----------****------ To check city found --------****------
function checkCity(userinput){
  if (!citiesLoaded) {
    alert("⏳ Cities are still loading...")
    return;
  }
  toggleLoader(true)
  micimg.style.opacity = "0";

  setTimeout(() => { 
    const lowerinput = userinput.toLowerCase();
    const foundcity = cities.find(city => {
        const regx = new RegExp(`\\b${city}\\b`,'i');      
        return regx.test(lowerinput) 
      });
  
      if(foundcity){
        // bar.value = foundcity;
        // console.log("found :" , foundcity);
        setTimeout(() => {
          bar.style.width = "2rem";
          bar.style.padding="0px 18px 0px 14px"
          btnimg.style.top= "0%";
          btnimg.style.left= "1%";
          micimg.style.opacity = "0"
          speak.style.display= "none";
          bar.value=''
        }, 700);
        updateweatherinfo(foundcity)
      }
      else{
          alert("❌ No City is found.")
          bar.value='';
          toggleLoader(false)
          micimg.style.opacity = "1";

      }
  }, 50);
}

//-----Fetch api -------- 
const Apikey =`d7d65cd8e785a5822633eb1c7865cd7e`
async function getFetchData(endpoint,city) {
  const apiurl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${Apikey}&units=metric`
  const response= await fetch(apiurl)
  return response.json()
}

const deg = document.querySelector('.degree')
const cityname = document.querySelector('.countryname')
const dateTime = document.querySelector('.date')
const idimg = document.querySelector('.idimage')
const maintype = document.querySelector('.main')
const humid_ = document.querySelector('.humiddata')
const feel_ = document.querySelector('.feelsdata')
const press = document.querySelector('.pressuredata')
const windspeed = document.querySelector('.winddata')
const visible = document.querySelector('.visibledata')
const riseTime = document.querySelector('.risetime')
const setTime = document.querySelector('.settime')
const imagePage = document.querySelector('.image-container')
const weeklydata = document.querySelector('.weekly')
const todaysdata = document.querySelector('.todays-info')
const windDegree = document.querySelector('.wind-degree' )

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
// ----Get Current Time------
const hour = new Date().getHours();
// --------- Set Icon -----------
function getweathericon(id) {
  if (id <= 232 ) return 'thunder.gif'
  if (id <= 321 ) return 'rainy_light.svg'
  if (id <= 531 ) return 'rain.gif'
  if (id <= 622 ) return 'snow.gif'
  if (id <= 781 ) return 'humid.gif'
  if (id <= 800  && (hour >= 5 && hour < 18)) {
    return 'sunny.gif'
  }
  if(id == 800 && (hour < 5 || hour >= 18) ){
    return 'cleannight.gif'
  }
  else return 'cloudy.gif'
 
}

function notanimatedicons(id){
  if (id <= 232 ) return 'thunderstormwithoutanim.svg'
  if (id <= 321 ) return 'rainy_light.svg'
  if (id <= 531 ) return 'rainywithoutanim.svg'
  if (id <= 622 ) return 'weather_snowy.svg'
  if (id <= 781 ) return 'mist.svg'
  if (id <= 800 )  return 'clear_day.svg'
  else return 'cloudwithoutani.svg'
}

// --------- Set Image  -----------
function getweatherimage(id) {
  if (id <= 232){
    suggesttext.textContent= textlist[4];
    const rndm = Math.floor(Math.random()*1)+1
    const img_path = `night/strom.jpg`
    return img_path
  }

  if (id <= 321){
    const rndm = Math.floor(Math.random()*1)+1
    const img_path = `rain/${rndm}.jpg`
    return img_path
  }
  if (id <= 531 ){
    const rndm = Math.floor(Math.random()*1)+1
    const img_path = `rain/${rndm}.jpg`
    return img_path
  }
  if (id <= 622 ){
    const rndm = Math.floor(Math.random()*1)+1
    const img_path = `night/snow.jpg`
    return img_path
  } 

  if (id <= 781){
    const rndm = Math.floor(Math.random()*1)+1
    const img_path = `midst/${rndm}.jpg`
    return img_path 
    } 

  if (id <= 800 && (hour >= 5 && hour < 18) ){
    const rndm = Math.floor(Math.random()*2)+1
    const img_path = `clear/${rndm}.jpg`
    return img_path
  }
  if (id <= 800 && (hour < 5 || hour >= 18) ){
    const img_path = `night/clearnight.jpg`
    return img_path
  }

  if(id <= 804 && (hour >= 5 && hour < 18) ){
    const rndm = Math.floor(Math.random()*2)+1
    const img_path = `cloud/${rndm}.jpg`
    return img_path
  } 

  if (id <= 804 && (hour < 5 || hour >= 18) ){
    const img_path = `night/cloudynight.jpg`
    return img_path
  }

}

//-----Weather Infomation --------
updateweatherinfo("Delhi") 
async function updateweatherinfo(city){
  try {
  const weatherData = await getFetchData('weather', city)
  if (weatherData.cod != 200) {
    alert("City Not Found")
    return
  }

//   console.log(weatherData)

  const sunrise = weatherData.sys.sunrise
  const suntime = new Date(sunrise * 1000).toLocaleTimeString('en-US',{
      hour : '2-digit',
      minute:'2-digit',
      hour12:true
    });

  const sunset = weatherData.sys.sunset
  const settime = new Date(sunset * 1000).toLocaleTimeString('en-US',{
    hour : '2-digit',
    minute:'2-digit',
    hour12:true
  });
  const {
      name: country,
      main:{temp , humidity ,pressure , feels_like},
      weather:[{id , main}],
      wind:{speed}
       
    } = weatherData 
    // console.log([suntime, settime , country , temp , humidity ,pressure , feels_like , id , main ,speed , weatherData.visibility / 1000]);
    deg.textContent = Math.round(temp) + '°'
    cityname.textContent = country
    dateTime.textContent = getCurrentDate()

    idimg.src =`icons\\${getweathericon(id)}`

    maintype.textContent = main
    humid_.textContent = humidity + '°'
    feel_.textContent = feels_like + '°'
    press.textContent = pressure + 'mba'
    windspeed.textContent = speed + 'M/s'
    visible.textContent = (weatherData.visibility)/1000 + 'Km'
    riseTime.textContent = suntime
    setTime.textContent = settime
    imagePage.style.backgroundImage = `url("${getweatherimage(id)}")`

    if (id <= 800) {
        suggesttext.textContent = textlist[0]   
    }
    if(id <= 800 && (hour < 5 || hour >= 18) ){
        suggesttext.textContent = textlist[5]
    }
    if (main <=532) {
        suggesttext.textContent = textlist[3]   
    }
    if (main=="Clouds") {
        suggesttext.textContent = textlist[2]   
    }
    if (id <= 781) {
        suggesttext.textContent = textlist[1]   
    }
    if (id <= 232) {
        suggesttext.textContent = textlist[4]   
    }



  await updateforecastinfo(city)
  } catch (error) {
    
  }finally{
    // bar.value=''
    toggleLoader(false)
  }
}

  // ---------Forecast Infomation---------
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

  todaysdata.innerHTML= ' '
  forecastDate.list.forEach(forecastWeather => {    
    if (!forecastWeather.dt_txt.includes(todaydate)){
      updateforecastTime(forecastWeather) 
    }
  });
  
}
// ---**** Insert time  to html **** ------
function updateforecastTime(forecasttime){
        const timeStr = forecasttime.dt_txt.split(' ')[1]
        const [hours] = timeStr.split(':');
  
        const date = new Date();
        date.setHours(+hours);
        // date.setMinutes(0); 
        const formattedate = date.toLocaleTimeString('en-US', { hour: '2-digit' , hour12: true});
        // console.log(forecasttime);
 
        const  {
          main:{ temp },
          weather:[{id , main}],
          wind:{speed , deg}
        } =forecasttime

        const todaysT = `
          <div class="todayswithwind">
            <div class="todays-details">
              <h5>${formattedate}</h5>
              <img src="icons/!animatedicon/${notanimatedicons(id)}" class="forecasticon" width="20" alt="" />
              <h5>${Math.round(temp)  +'°'}</h5>
            </div>
            <div class="todayswind">
              <h5>${formattedate}</h5>
              <img src="icons/wind direction.svg" class="wind-degree" style="transform: rotate(${deg}deg);" alt="" />
              <h5>${speed + 'M/s'}</h5>
            </div>
          </div> `
       todaysdata.insertAdjacentHTML('beforeend',todaysT)
      const sunsetrisetime = document.querySelector('.forecasticon' )

}


// ---**** insert to html **** ------
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
          <img src="icons/${getweathericon(id)}" width="50" alt="Error" srcset="" />
          <h5 class="temp-weekly">${Math.round(temp) + '°'}</h5>
          </div>`

    weeklydata.insertAdjacentHTML('beforeend',weekitem)
}


// // ---- suggetion -------
let textlist=["Ahh.. weather is clear let's plan for trip or shopping with family." , "Its raining outside Don't forget to bring umbrella or to wear raincoat." , "Cloud all over the sky visibility is zero.", "Humidity is ver hight so hydrate your self and wear goggle and cap.", "Don't go out its strom out side don't take umberlla outside." , "Sky is clear and beautiful view you can see from your tareec."]
const suggestclose= document.querySelector('.suggest-close')
const suggesttext= document.querySelector('.text-suggest') //----
const suggestleft= document.querySelector('.suggest-left')
const suggest= document.querySelector('.suggest')
suggestleft.addEventListener('click', ()=>{
    suggest.style.width= "20rem";
    suggesttext.style.display="block";
    suggestclose.style.display="block";
    suggestleft.style.display="none";
    
})

suggestclose.addEventListener('click',()=>{
    suggest.style.width= "2.5rem";
    suggesttext.style.display="none";
    suggestclose.style.display="none";
    suggestleft.style.display="block";
})


// // ---- end-------
