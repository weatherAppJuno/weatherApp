// Create an app object (weatherApp)
const weatherApp = {};
  
// Globally scoped variables
// weatherApp.apiKey = 'pJmfSq8JcnpKVxiVA49kf1ywVRQ5sAb8'; // Radojko's Key
weatherApp.apiKey = 'virj6ycdX84826o1Fehp3b5LOGCGKqT3'; // Daniela's Key
// weatherApp.apiKey = 'pO2zESA35RlIGQ36xPDv6xrcG7DaJVCK'; // Third key for testing
// weatherApp.apiKey = '6hQlXX1SR0owbCvgM5t4M69JA5tsvGj1'; // Fourth Key
weatherApp.searchEndpoint = 'http://dataservice.accuweather.com/locations/v1/cities/CA/ON/search/'; // Searches within Canada, then Ontario 
weatherApp.weatherEndpoint = 'http://dataservice.accuweather.com/currentconditions/v1/';

// Variable to append later
weatherApp.cityName;

// Construct the init method
weatherApp.init = () => {
    weatherApp.getUserInput();
}


// Method that attaches an event listener to the form
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

// Method that constructs a new URL object using the user's input
weatherApp.callSearchApi = (query) => {
    // construct new URL with the needed parameters
    const url = new URL(weatherApp.searchEndpoint);
    url.search = new URLSearchParams({
        apikey: weatherApp.apiKey,
        q: query
    });
    // Use the URL object to call the Cities Search API 
    fetch(url)
        .then(res => {
            return res.json();
        })
        .then(resJSON => {
            resJSON.forEach((city) => {
                // Store Key property for second API call
                const cityKey = city.Key;
                // Reassign the weatherApp.cityName variable to use it later in the appendMainDetails method
                weatherApp.cityName = city.LocalizedName;
                // Pass the cityKey variable to the getWeatherDetails method
                weatherApp.getWeatherDetails(cityKey);
            });
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
        .then(res => {
            return res.json();
        })
        .then(data => {
            console.log(data[0]);
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
            // Pass variables as parameters into other methods
            weatherApp.toggleDarkStyles(isDayTime);
            weatherApp.appendMainDetails(tempC, tempF, weatherText, weatherApp.cityName, weatherIcon);
            weatherApp.appendWindDetails(windChillC, windChillF, windSpeedKm, windDirection);
            weatherApp.appendOtherDetails(uvIndex, uvIndexText, relativeHumidity, airPressure);
        });
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
    console.log(`${day} ${month} ${time.getDate()} ${year} ${hours}:${minutes}:${seconds}`);
    // Container div to append to
    const divElLocalDate = document.querySelector('.localDate p');
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
    // Update element text
    divElLocalDate.innerText = `${day}  ${month}  ${time.getDate()}. ${year} ${hours}:${minutes}:${seconds}`;
}
setInterval(weatherApp.localDate, 1000);
weatherApp.localDate();

// Method to change site styles based on isDayTime boolean
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
    
// Method to append main details (temperature, weather text, city name) to page
weatherApp.appendMainDetails = (tempC, tempF, weatherText, cityName, iconNum) => {
    // Elements to append
    const newH2 = document.createElement('h2');
    const newH3 = document.createElement('h3');
    const newIconEl = document.createElement('img')
    const newParagraphC = document.createElement('p');
    const newParagraphF = document.createElement('p');
    // Container div to append to
    const divElCityName = document.querySelector('.cityName');
    const divElCurrentWeather = document.querySelector('.currentWeather');
    // Update element text
    newH2.innerText = cityName;
    newH3.innerText = weatherText;
    newIconEl.src = `./assets/${iconNum}-s.png`;
    newParagraphC.innerHTML = `${tempC}&#8451;`;
    newParagraphF.innerHTML = `${tempF}&#8457;`;
    // Clears previous data
    divElCityName.innerHTML = '';
    divElCurrentWeather.innerHTML = '';
    // Appends new data
    divElCityName.append(newH2);
    divElCurrentWeather.append(newIconEl, newH3, newParagraphC, newParagraphF)
}

// Method to append wind details (windchill, wind speed, wind direction) to page
weatherApp.appendWindDetails = (tempC, tempF, speed, direction) => {
    // Elements to append
    const windChillParagraph = document.createElement('p');
    const windSpeedParagraph = document.createElement('p');
    const windDirectionParagraph = document.createElement('p');
    // Containers to append to 
    const divElWindChill = document.querySelector('.windChillData');
    const divElWindSpeed = document.querySelector('.windSpeedData');
    const divElWindDirection = document.querySelector('.windDirectionData');
    // Updates inner HTML
    windChillParagraph.innerHTML = `${tempC}&#8451; / ${tempF}&#8457;`;
    windSpeedParagraph.innerHTML = `${speed} km/h`;
    windDirectionParagraph.innerHTML = `${direction}`;
    //Clears previous data
    divElWindChill.innerHTML = '';
    divElWindSpeed.innerHTML = '';
    divElWindDirection.innerHTML = '';
    //Appends new data
    divElWindChill.append(windChillParagraph);
    divElWindSpeed.append(windSpeedParagraph);
    divElWindDirection.append(windDirectionParagraph);
}

// Method to append other details (uv index, uv index text, humidity, pressure) to page
weatherApp.appendOtherDetails = (uvIndex, uvIndexText, relativeHumidity, airPressure) => {
    // Elements to append
    const uvIndexParagraph = document.createElement('p');
    const relativeHumidityParagraph = document.createElement('p');
    const airPressureParagraph = document.createElement('p');
    // Containers to append to 
    const divElUv = document.querySelector('.uvData');
    const divElHumidity = document.querySelector('.humidityData');
    const divElPressure = document.querySelector('.pressureData');
    // Update element text
    uvIndexParagraph.innerText = `${uvIndex} ${uvIndexText}`;
    relativeHumidityParagraph.innerText = `${relativeHumidity}%`;
    airPressureParagraph.innerText = `${airPressure}mb`;
    //Clears previous data
    divElUv.innerHTML = '';
    divElHumidity.innerHTML = '';
    divElPressure.innerHTML = '';
    // Appends new data
    divElUv.append(uvIndexParagraph);
    divElHumidity.append(relativeHumidityParagraph);
    divElPressure.append(airPressureParagraph);
}

// Call the init method
weatherApp.init();



// Create an app object (weatherApp)

// Construct the init method

// Initialize globally scoped variables
    // Cities search API endpoint (we are using the endpoint for Ontario, Canada)
    // Current conditions API endpoint
    // API key

// Make a method that attaches an event listener to the form
    // event.preventDefault();
    // When user submits form, store the value of the input into a variable (which will be the q property in the API call)
    // Pass the variable into the API call function below
    // Clear the text in the input field with .textContent = '';

// Make a method that constructs a new URL object using the user's input and globally-scoped variables
    // construct new URL with the following params:
        // Api Key
        // Cities Search API endpoint 
        // User's input goes into the q: property
    // Use this newly constructed URL object to call the Cities Search API    
    // Capture the following properties and store them into variables:
        // the Key property  
        // Province - for stretch goal (if we expand to all of Canada - will also have to change starting endpoint) - AdministrativeArea.EnglishName
        // GeoPosition (longitude and lattitude) - for stretch goal 
    // Pass the Key property value to the next method (more values would be passed as parameters if we aim for stretch goals)

// Make a method that takes the first API call's Key property as a parameter
    // use this parameter to update the Current Conditions API endpoint
    // Call the new endpoint for the API
    // This receives the current weather forecast data as an object for the user's selected city
    // We capture the following properties and store them into variables:
        // City name, temperature (F and C), weather text, weather icon (stretch goal), isDayTime (stretch goal)
        // Pass these variables as parameters into the following method
    
// Make a method that accepts a number of parameters, and appends them to a div on the page (could also be a UL with LIs)
    // First clear any previous data with .innerHTML = '';
    // City name - h2 
    // Weather text - h3
    // Temperature - p 
    // Weather icon - img (stretch goal)
    // isDayTime - would not be on page, but would affect CSS styles (stretch goal)

// Call the init method