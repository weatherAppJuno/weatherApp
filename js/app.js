// Create an app object (weatherApp)
const weatherApp = {};
  
// Initialize globally scoped variables
    // Cities search API endpoint (we are using the endpoint for Ontario, Canada)
    // Current conditions API endpoint
    // API key
weatherApp.apiKey = 'virj6ycdX84826o1Fehp3b5LOGCGKqT3';
weatherApp.searchEndpoint = 'http://dataservice.accuweather.com//locations/v1/cities/CA/ON/search'; // Searches within Canada, then Ontario 
weatherApp.weatherEndpoint = 'http://dataservice.accuweather.com/currentconditions/v1/';


// Construct the init method
weatherApp.init = () => {
    weatherApp.getUserInput();
    // weatherApp.callSearchApi();
    // weatherApp.callWeatherApi();
}

// Make a method that attaches an event listener to the form
    // event.preventDefault();
    
    
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


// Make a method that constructs a new URL object using the user's input and globally-scoped variables

weatherApp.callSearchApi = (query) => {
    // construct new URL with the following params:
        // Api Key
        // Cities Search API endpoint 
        // User's input goes into the q: property
    const url = new URL(weatherApp.searchEndpoint);
    url.search = new URLSearchParams({
        apikey: weatherApp.apiKey,
        q: query
    });

    // Use this newly constructed URL object to call the Cities Search API 
    fetch(url)
        .then((res) => {
            return res.json();
        })
        .then((resJSON) => {
            console.log(resJSON);
            resJSON.forEach((city) => {
                // Capture the following properties and store them into variables:
                // the Key property  
                const cityKey = city.Key;
                weatherApp.callWeatherApi(cityKey);
                
                // Province - for stretch goal (if we expand to all of Canada - will also have to change starting endpoint) - AdministrativeArea.EnglishName
                // GeoPosition (longitude and lattitude) - for stretch goal 
                // Pass the Key property value to the next method (more values would be passed as parameters if we aim for stretch goals)

                // console.log(city.EnglishName);
                // console.log(city.AdministrativeArea.EnglishName);
                //  console.log(city.Key);
                // console.log(city.GeoPosition.Longitude);
                // console.log(city.GeoPosition.Latitude);
            });
        });
}

    
       
    

// Make a method that takes the first API call's Key property as a parameter
    weatherApp.callWeatherApi = (key) => {
        const url = new URL(weatherApp.weatherEndpoint + key);
        console.log(url);

        url.search = new URLSearchParams({
            apikey: weatherApp.apiKey
        });

        fetch(url)
        .then(res => {
            return res.json();
        })
        .then(data => {

            // City name, temperature (F and C), weather text, weather icon (stretch goal), isDayTime (stretch goal)
            // TEMPERATURE METRIC
        const tempC = data[0].Temperature.Metric.Value;
            // TEMPERATURE INPERIAL
        const tempF = data[0].Temperature.Imperial.Value;

        // WEATHER TEXT
        const weatherText = data[0].WeatherText;

            // console.log(data[0])
        });


    }
    // use this parameter to update the Current Conditions API endpoint
    
    // Call the new endpoint for the API
    // This receives the current weather forecast data as an object for the user's selected city
    // We capture the following properties and store them into variables:
        
        // Pass these variables as parameters into the following method
    
// Make a method that accepts a number of parameters, and appends them to a div on the page (could also be a UL with LIs)
    // First clear any previous data with .innerHTML = '';
    // City name - h2 
    // Weather text - h3
    // Temperature - p 
    // Weather icon - img (stretch goal)
    // isDayTime - would not be on page, but would affect CSS styles (stretch goal)

// Call the init method



weatherApp.init();





// app.callWeather = () => {
//     const url = new URL(`${app.weatherEndpoint}55488`);
//     url.search = new URLSearchParams({
//         apikey: app.apiKey,
//     });

//     fetch(url)
//         .then((res) => {
//             return res.json();
//         })
//         .then((resJSON) => {
//             console.log(resJSON);
//         });
// }

// app.callApi();
// app.callWeather();


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