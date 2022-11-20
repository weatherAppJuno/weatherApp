// Create an app object (weatherApp)
const weatherApp = {};
  
// Globally scoped variables
weatherApp.apiKey = 'pJmfSq8JcnpKVxiVA49kf1ywVRQ5sAb8';
weatherApp.searchEndpoint = 'http://dataservice.accuweather.com/locations/v1/cities/CA/ON/search/'; // Searches within Canada, then Ontario 
weatherApp.weatherEndpoint = 'http://dataservice.accuweather.com/currentconditions/v1/';

// City Name variable to append later
weatherApp.cityName;

// Div containers from HTML
//City name and Current Weather
weatherApp.divElCityName = document.querySelector('.cityName');
weatherApp.divElCurrentWeather = document.querySelector('.currentWeather');
//Wind details
weatherApp.divElWindChill = document.querySelector('.windChillData');
weatherApp.divElWindSpeed = document.querySelector('.windSpeedData');
weatherApp.divElWindDirection = document.querySelector('.windDirectionData');
//Other details
weatherApp.divElUv = document.querySelector('.uvData');
weatherApp.divElHumidity = document.querySelector('.humidityData');
weatherApp.divElPressure = document.querySelector('.pressureData');

// Constructs the init method
weatherApp.init = () => {
    // Loads Toronto data on page load
    weatherApp.callSearchApi("Toronto");
    weatherApp.getUserInput();
    weatherApp.localDate();
    setInterval(weatherApp.localDate, 1000);
}

//Method to add current date and clock
weatherApp.localDate = () => {    
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const time = new Date();
    let month = months[time.getMonth()];
    let day = days[time.getDay()];
    let year = time.getFullYear();
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let seconds = time.getSeconds();
    // Container div to append to
    const divElLocalDate = document.querySelector('.localDate p');
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    // Update element text
    divElLocalDate.innerText = `${day}  ${month}  ${time.getDate()}. ${year} ${hours}:${minutes}:${seconds}`;
}

//Method that clears data from all API fields
weatherApp.clearDetails = () => {
    //Main details (City name, current weather)
    weatherApp.divElCityName.innerHTML = '';
    weatherApp.divElCurrentWeather.innerHTML = '';
    //Wind details
    weatherApp.divElWindChill.innerHTML = '';
    weatherApp.divElWindSpeed.innerHTML = '';
    weatherApp.divElWindDirection.innerHTML = '';
    //Other details
    weatherApp.divElUv.innerHTML = '';
    weatherApp.divElHumidity.innerHTML = '';
    weatherApp.divElPressure.innerHTML = '';
}

// Method that attaches an event listener to the form and passes user's input as an argument to the callSearchApi method
weatherApp.getUserInput = () => {
    document.querySelector(".searchForm").addEventListener('submit', (event) => {
        event.preventDefault();
        const inputEl = document.querySelector('#searchInput');
        // When user submits form, store the value of the input into a variable
        const inputValue = event.originalTarget[1].value;
        // Pass inputValue into the API call method below as q
        weatherApp.callSearchApi(inputValue);
        // Clear the text in the input field
        inputEl.value = '';
    });
}    

// Method that constructs a new URL object with the user's input
weatherApp.callSearchApi = (query) => {
    // construct new URL with the needed parameters
    const url = new URL(weatherApp.searchEndpoint);
    url.search = new URLSearchParams({
        apikey: weatherApp.apiKey,
        details: true,
        q: query
    });
    // Use the URL object to call the Cities Search API 
    fetch(url)
        .then((res) => {
            return res.json();
        })
        .then((resJSON) => {
            //Note regarding error handling: the response from the API returns ok: true even if the user submits nonsense into the form. Therefore, the best way to catch an error is to check if the array that the API returns is empty or contains data, as per below. 
            if (resJSON.length === 0) {
                const newH2 = document.createElement('h2');
                newH2.textContent = "Invalid city name, please try again!"
                weatherApp.clearDetails();
                weatherApp.divElCityName.append(newH2);
            } else {
                resJSON.forEach((city) => {
                    // Store Key property for second API call
                    const cityKey = city.Key;
                    // Reassign the weatherApp.cityName variable to use it in the appendMainDetails method
                    weatherApp.cityName = city.LocalizedName;
                    // Pass the cityKey variable to the getWeatherDetails method
                    weatherApp.getWeatherDetails(cityKey);
                });
            }
        });
}

// Method that takes the first API call's Key property as a parameter
weatherApp.getWeatherDetails = (key) => {
    // use this parameter to update the Current Conditions API endpoint
    const url = new URL(weatherApp.weatherEndpoint + key);
    url.search = new URLSearchParams({
        apikey: weatherApp.apiKey,
        details: true
    });
    // Call the new endpoint for the API
    fetch(url)
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            // Main details - Weather text, temperature
            const tempC = data[0].Temperature.Metric.Value;
            const tempF = data[0].Temperature.Imperial.Value;
            const weatherText = data[0].WeatherText;
            const weatherIcon = data[0].WeatherIcon;
            // WInd details - wind chill, wind speed, wind direction
            const windChillC = data[0].WindChillTemperature.Metric.Value;    
            const windChillF = data[0].WindChillTemperature.Imperial.Value; 
            const windSpeedKm = data[0].Wind.Speed.Metric.Value; 
            const windDirection = data[0].Wind.Direction.English; 
            // Other details - UV index, UV Index text, humidity, air pressure
            const uvIndex = data[0].UVIndex;
            const uvIndexText = data[0].UVIndexText;
            const relativeHumidity = data[0].RelativeHumidity;
            const airPressure = data[0].Pressure.Metric.Value;               
            // Daytime boolean 
            const isDayTime = data[0].IsDayTime;
            // Clear all fields
            weatherApp.clearDetails();
            // Pass variables as arguments into other methods
            weatherApp.toggleDarkStyles(isDayTime);
            weatherApp.appendMainDetails(tempC, tempF, weatherText, weatherApp.cityName, weatherIcon);
            weatherApp.appendWindDetails(windChillC, windChillF, windSpeedKm, windDirection);
            weatherApp.appendOtherDetails(uvIndex, uvIndexText, relativeHumidity, airPressure);
        });
}

// Method to change site styles based on isDayTime boolean from API
weatherApp.toggleDarkStyles = (boolean) => {
    if (boolean === true) {
        const dark = document.querySelector('#dayNight');
        const topDark = document.querySelector("#topDayNight")
        topDark.classList.remove('topDark');
        topDark.classList.add('top');
        dark.classList.remove('accuweatherDark')
        dark.classList.add('accuweather');
        
    } else {
        const dark = document.querySelector('#dayNight');
        const topDark = document.querySelector("#topDayNight")
        topDark.classList.remove('top');
        topDark.classList.add('topDark');
        dark.classList.remove('accuweather');
        dark.classList.add('accuweatherDark');  
    };
}
    
// Method to append main details (temperature, weather text, city name, weather icon) to page
weatherApp.appendMainDetails = (tempC, tempF, weatherText, cityName, iconNum) => {
    // Elements to append
    const newH2 = document.createElement('h2');
    const newH3 = document.createElement('h3');
    const newIconEl = document.createElement('img')
    const newParagraphC = document.createElement('p');
    const newParagraphF = document.createElement('p');
    // Update element text
    newH2.innerText = cityName;
    newH3.innerText = weatherText;
    newIconEl.src = `./assets/${iconNum}-s.png`;
    newParagraphC.innerHTML = `${tempC}&#8451;`;
    newParagraphF.innerHTML = `${tempF}&#8457;`;
    // Appends new data
    weatherApp.divElCityName.append(newH2);
    weatherApp.divElCurrentWeather.append(newIconEl, newH3, newParagraphC, newParagraphF)
}

// Method to append wind details (windchill, wind speed, wind direction) to page
weatherApp.appendWindDetails = (tempC, tempF, speed, direction) => {
    // Elements to append
    const windChillParagraph = document.createElement('p');
    const windSpeedParagraph = document.createElement('p');
    const windDirectionParagraph = document.createElement('p');
    // Updates inner HTML
    windChillParagraph.innerHTML = `${tempC}&#8451; / ${tempF}&#8457;`;
    windSpeedParagraph.innerHTML = `${speed} km/h`;
    windDirectionParagraph.innerHTML = `${direction}`;
    //Appends new data
    weatherApp.divElWindChill.append(windChillParagraph);
    weatherApp.divElWindSpeed.append(windSpeedParagraph);
    weatherApp.divElWindDirection.append(windDirectionParagraph);
}

// Method to append other details (uv index, uv index text, humidity, pressure) to page
weatherApp.appendOtherDetails = (uvIndex, uvIndexText, relativeHumidity, airPressure) => {
    // Elements to append
    const uvIndexParagraph = document.createElement('p');
    const relativeHumidityParagraph = document.createElement('p');
    const airPressureParagraph = document.createElement('p');
    // Update element text
    uvIndexParagraph.innerText = `${uvIndex} ${uvIndexText}`;
    relativeHumidityParagraph.innerText = `${relativeHumidity}%`;
    airPressureParagraph.innerText = `${airPressure}mb`;
    // Appends new data
    weatherApp.divElUv.append(uvIndexParagraph);
    weatherApp.divElHumidity.append(relativeHumidityParagraph);
    weatherApp.divElPressure.append(airPressureParagraph);
}

// Call the init method
weatherApp.init();