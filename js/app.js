// Create an app object (weatherApp)
const weatherApp = {};
  
// Initialize globally scoped variables
    // Cities search API endpoint (we are using the endpoint for Ontario, Canada)
    // Current conditions API endpoint
    // API key
// weatherApp.apiKey = 'pJmfSq8JcnpKVxiVA49kf1ywVRQ5sAb8'; // Radojko's Key
// weatherApp.apiKey = 'virj6ycdX84826o1Fehp3b5LOGCGKqT3'; // Daniela's Key
// weatherApp.apiKey = 'pO2zESA35RlIGQ36xPDv6xrcG7DaJVCK'; // Third key for testing
weatherApp.apiKey = '6hQlXX1SR0owbCvgM5t4M69JA5tsvGj1'; // Fourth Key
weatherApp.searchEndpoint = 'http://dataservice.accuweather.com/locations/v1/cities/CA/ON/search/'; // Searches within Canada, then Ontario 
weatherApp.weatherEndpoint = 'http://dataservice.accuweather.com/currentconditions/v1/';

// Variables to append
weatherApp.cityName;

// Empty divs in HTML that will have data appended
weatherApp.cityNameDiv = document.querySelector('.cityName');
weatherApp.detailsWindDiv = document.querySelector('.detailsWind');

// Construct the init method
weatherApp.init = () => {
    weatherApp.getUserInput();
}

// Method that attaches an event listener to the form
weatherApp.getUserInput = () => {
    document.querySelector(".searchForm").addEventListener('submit', function (event) {
        event.preventDefault();
        const inputEl = document.querySelector('#searchInput');
        // When user submits form, store the value of the input into a variable
        const inputValue = event.originalTarget[1].value;
        // Pass inputValue into the API call method below as q
        weatherApp.callSearchApi(inputValue);
        // Clear the text in the input field with .textContent = '';
        inputEl.value = '';
    });
}    


// Mthod that constructs a new URL object using the user's input and globally-scoped variables
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
            console.log(resJSON);
            resJSON.forEach((city) => {
                // Capture the following properties and store them into variables:
                // the Key property  
                const cityKey = city.Key;
                // Reassign the weatherApp.cityName variable so that we can use it in the appendMainDetails method later
                weatherApp.cityName = city.LocalizedName;
                // Passes the cityKey variable as a parameter to the getWeatherDetails method
                weatherApp.getWeatherDetails(cityKey);
               
                // Province - for stretch goal (if we expand to all of Canada - will also have to change starting endpoint) - AdministrativeArea.EnglishName
                // GeoPosition (longitude and lattitude) - for stretch goal 
                // console.log(city.AdministrativeArea.EnglishName);
                // console.log(city.GeoPosition.Longitude);
                // console.log(city.GeoPosition.Latitude);
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
            console.log(data[0])
            // Main details - Weather text, temperature
            const weatherText = data[0].WeatherText;
            const tempC = data[0].Temperature.Metric.Value;
            const tempF = data[0].Temperature.Imperial.Value;
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
            // Pass variables as parameters into the following method
            weatherApp.toggleDarkStyles(isDayTime);
            weatherApp.appendMainDetails(tempC, tempF, weatherText, weatherApp.cityName);
            weatherApp.appendWindDetails(windChillC, windChillF, windSpeedKm, windDirection);
            weatherApp.appendOtherDetails(uvIndex, uvIndexText, relativeHumidity, airPressure);
        });
}
    
weatherApp.toggleDarkStyles = (boolean) => {
    if (boolean === true) {
        const dark = document.querySelector('#dayNight');
        const topDark = document.querySelector("#topDayNight")
        topDark.classList.remove('topDark');
        topDark.classList.add('top');
        dark.classList.remove('accuweatherDark')
        console.log("day");
        dark.classList.add('accuweather');
        
    } else {
        const dark = document.querySelector('#dayNight');
        const topDark = document.querySelector("#topDayNight")
        console.log("night");
        topDark.classList.remove('top');
        topDark.classList.add('topDark');
        dark.classList.remove('accuweather');
        dark.classList.add('accuweatherDark');  
    };
}
    
// Method to append main details (temperature, weather text, city name) to page
weatherApp.appendMainDetails = (tempC, tempF, weatherText, cityName) => {
    //Elements to append
    const newH2 = document.createElement('h2');
    const newH3 = document.createElement('h3');
    const newParagraphC = document.createElement('p');
    const newParagraphF = document.createElement('p');
    //Container div to append to
    const divElCurrentWeather = document.querySelector('.currentWeather');
    // Update element text
    newParagraphC.innerHTML = `${tempC}&#8451;`;
    newParagraphF.innerHTML = `${tempF}&#8457;`;
    newH3.innerText = weatherText;
    newH2.innerText = cityName;
    // newParagraphC.innerText = tempC;
    // newParagraphF.innerText = tempF;

    // Clears old data from divs
    weatherApp.cityNameDiv.innerHTML = '';
    divElCurrentWeather.innerHTML = '';
    // Appends new data
    weatherApp.cityNameDiv.append(newH2);
    divElCurrentWeather.append(newH3, newParagraphC, newParagraphF)
}

// Method to append wind details (windchill, wind speed, wind direction) to page
weatherApp.appendWindDetails = (tempC, tempF, speed, direction) => {
    // Elements to append
    const windChillParagraph = document.createElement('p');
    const windSpeedParagraph = document.createElement('p');
    const windDirectionParagraph = document.createElement('p');
    // Updates inner HTML
    windChillParagraph.innerHTML = `Wind Chill: ${tempC}&#8451; / ${tempF}&#8457;`;
    windSpeedParagraph.innerHTML = `Wind Speed: ${speed} km/h`;
    windDirectionParagraph.innerHTML = `Wind Direction: ${direction}`;
    //Clears old data from the div
    weatherApp.detailsWindDiv.innerHTML = '';
    //Appends data to the div
    weatherApp.detailsWindDiv.append(windChillParagraph, windSpeedParagraph, windDirectionParagraph);
}

// Method to append other details (uv index, uv index text, humidity, pressure) to page
weatherApp.appendOtherDetails = (uvIndex, uvIndexText, relativeHumidity, airPressure) => {
    // Elements to append
    const uvIndexParagraph = document.createElement('p');
    const relativeHumidityParagraph = document.createElement('p');
    const airPressureParagraph = document.createElement('p');
    // Containers to append to 
    const divElUv = document.querySelector('.uv');
    const divElHumidity = document.querySelector('.humidity');
    const divElPressure = document.querySelector('.pressure');
    //! Grab the div class detailsOther
    // const divElDetailsOther = document.querySelector('.detailsOther');

    // Update element text
    uvIndexParagraph.innerText = `${uvIndex} ${uvIndexText}`;
    relativeHumidityParagraph.innerText = `${relativeHumidity}%`;
    airPressureParagraph.innerText = `${airPressure}mb`;
    //Clears previous data
    divElUv.innerHTML = '';
    divElHumidity.innerHTML = '';
    divElPressure.innerHTML = '';
    // Appends new data
    divElUv.append(uvIndexParagraphText, uvIndexParagraph);
    divElHumidity.append(relativeHumidityParagraphText, relativeHumidityParagraph);
    divElPressure.append(airPressureParagraphText, airPressureParagraph);
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