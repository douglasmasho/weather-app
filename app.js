// Tutorial by http://youtube.com/CodeExplained
// api key : a2df6d15a5bb7a739e6a09c82c8938d6

//select elements

const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value");
const descElement = document.querySelector(".temperature-description p");
const locationElements = document.querySelectorAll(".location");
const notificationElement = document.querySelector(".notification");
const radioElements = document.querySelectorAll(".radioBtn")



//app data
const weather = {};

weather.temperature = {
    unit: "celsius"
}

//app constants and var

const KELVIN = 273;
//API key
const key = "a2df6d15a5bb7a739e6a09c82c8938d6";
const pixabayKey = "16443055-68c5d8328b75401f9de1f7ddc"

//check if browser supports geolocation sservices

if("geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notificationElement.style.display = "block";
    notificationElement.innerHtml = "<p>Browser does not support geolocation</p>"
}

//set user position
function setPosition(position){
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
    getForecast(latitude, longitude)
    console.log(latitude, longitude);
}

//show error if there is an issue with geolocation
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHtml = `${error.message}`
}

//get weather from api provider

function getWeather(latitude, longitude){
    let api = `https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`
  
    fetch(api)
             .then(function(response){
                 let data = response.json();
                 return data;
             })
             .then(function(data){
                 weather.temperature.value = Math.floor(data.main.temp - KELVIN);
                 weather.description = data.weather[0].description;
                 weather.iconId = data.weather[0].icon;
                 weather.city = data.name;
                 weather.country = data.sys.country;       
                 getBgPic(weather.description);

             })
             .then(function(){
                 displayWeather();
             })
}

displayWeather
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png">`;
    tempElement.innerHTML = `<p>${weather.temperature.value}° <span>C</span></p>`;
    descElement.innerHTML = `<p>${weather.description}</p>`
    locationElements.forEach(ele =>{
        ele.innerHTML = `<p>${weather.city}, ${weather.country}</p>`
    })

    // locationElement.innerHTML = `${weather.city}, ${weather.country}`
}

function ctoF(temperature){
    return(temperature * 9/5) + 32;
}
function ftoC(temperature){
    return(temperature - 32) * 5/9;
}

tempElement.addEventListener("click", function(){
    if(weather.temperature.value === undefined) return;

    if(weather.temperature.unit === "celsius"){
        let farenheit = ctoF(weather.temperature.value);
        farenheit = Math.floor(farenheit);
        tempElement.innerHTML = `<p>${farenheit}° <span>F</span></p>`;
        weather.temperature.unit = "farenheit";
    }
    else{
        tempElement.innerHTML = `<p>${weather.temperature.value}° <span>C</span></p>`;
        weather.temperature.unit = "celsius"
    }
})


////////////////////////day function

function dayOfWeek(dateStr){
    let dayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const date = new Date(dateStr);
    return  dayArr[date.getDay()];
}

// PushData(2)

let tempArr = [];
function PushData(data){
    const list = data.list;

    document.querySelectorAll(".forecast").forEach(ele => {
        let idNum = parseInt(ele.id);

        let temperature = Math.floor(list[idNum].main.temp - KELVIN);
        let description = list[idNum].weather[0].description;
        let iconId = list[idNum].weather[0].icon;
        let day = dayOfWeek(list[idNum].dt_txt);

        //pushing to elements
        let dayElement = document.getElementById(`day-${idNum}`);
        let iconElement = document.getElementById(`icon-${idNum}`);
        let tempElement = document.getElementById(`val-${idNum}`);
        let descElement = document.getElementById(`desc-${idNum}`);

        //actual data pushing
        dayElement.innerHTML = `<p>${day}</p>`;
        iconElement.innerHTML = `<img src="icons/${iconId}.png">`;
        tempElement.innerHTML = `<p><span class="foreTemp">${temperature}°</span> <span class="unit">C</span></p>`;
        descElement.innerHTML = `<p>${description}</p>`;
        tempArr.push(temperature);
    })
}

function getForecast(latitude, longitude){
    let api = `https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
    .then(resp =>{
        let data = resp.json();
        return data
    })
    .then(data =>{
        PushData(data);
    })
}

///changing from celsius to farenheit and vice versa

radioElements.forEach(element =>{
    // console.log(element)
    element.addEventListener("click", event =>{
         let btn = event.currentTarget;
        let unit =  btn.getAttribute("value");

        if(unit === "farenheit"){
            let temps = document.querySelectorAll(".foreTemp");
            temps.forEach(e =>{
               let temperature = parseInt(e.textContent);
               let farenheit = ctoF(temperature);
               e.textContent = `${Math.floor(farenheit)}°`;
            })
            let units = document.querySelectorAll(".unit");
            units.forEach(e =>{
                e.textContent = "F";
            })
        }else if(unit === "celsius"){
            let temps = document.querySelectorAll(".foreTemp");
            temps.forEach((e,i) =>{
                let celsius = tempArr[i];
                e.textContent = `${celsius}°`;
             })
             let units = document.querySelectorAll(".unit");
            units.forEach(e =>{
                e.textContent = "C";
            })
        }
    })

})

/* -17.4667 15.8833 */

// let testString = "under armor";
// let testArr = testString.split(" ");
// let final = testArr.join("+");


///////////////////////////////////////returning the background-image
//////convert string to query-format

function strToQue(str){
    let Arr = str.split(" "); 
    return Arr.join("+"); 
}

///the change background function
function changeBg(url){
    document.body.style.backgroundImage = `url(${url})`;
    document.body.style.backgroundSize = "cover";
}

/////////////the fetch function
function getBgPic(str){
    let description = strToQue(str);
    let api = `https://cors-anywhere.herokuapp.com/pixabay.com/api/?key=${pixabayKey}&q=${description}&image_type=photo&pretty=true`;

    fetch(api)
    .then(resp=>{
        let data = resp.json();
        return data;
    })
    .then(data=>{
        let picUrl = data.hits[1].largeImageURL;
        changeBg(picUrl)
    })
}





