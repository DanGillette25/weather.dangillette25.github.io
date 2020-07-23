$(document).ready(function(){
// Declare variables, start with URLs for API calls and API Key
var fQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q="
var cQueryURL = "https://api.openweathermap.org/data/2.5/weather?q="
var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?"
// Making the variables that will be used to make the API calls and
// manipulate the DOM global
var historicSearches = []
var cCityName = ""
var queryCity = ""
var today = moment().format('MM/DD/YYYY');
var cConditions = ""
var cTemp = ""
var cHumid = ""
var cWind = ""
var cUVI = ""
var fConditions = ""
var fTemp = ""
var fHumid = ""
var fDate = ""
// Image links to forecast icons
var sunny = "https://cdn4.iconfinder.com/data/icons/weatherful/72/Sunny-512.png"
var rain = "https://cdn4.iconfinder.com/data/icons/weatherful/72/Raining-512.png"
var clouds = "https://cdn4.iconfinder.com/data/icons/weatherful/72/Cloudy-512.png"
var partCloud = "https://cdn4.iconfinder.com/data/icons/weatherful/72/Cloudy_Sunny-512.png"
var lightning = "https://cdn4.iconfinder.com/data/icons/weatherful/72/Lightning-512.png"
var snow = "https://cdn4.iconfinder.com/data/icons/weatherful/72/Snow_Clody-512.png"
var hail = "https://cdn4.iconfinder.com/data/icons/weatherful/72/Snowing-512.png"
// Make variables that will be used to determine what icon is displayed
//global
var iconImage = ""
var iconAlt = ""
var fIconImage = ""
var fIconAlt = ""

// If we already have a localStorage object for city search history
// then we pull it out of localStorage and set our historicSearches array
// equal to what's in there.  They we run the function to create the search
// history buttons

if (localStorage.getItem('cityHistory')) {
    historicSearches =  JSON.parse(localStorage.getItem("cityHistory"))
    historyButtons();
    
 // If it doesn't exist then we create it   
} else {

    var cityString = JSON.stringify(historicSearches)
    localStorage.setItem("cityHistory", cityString)
    historicSearches = JSON.parse(localStorage.getItem("cityHistory"))
    
    }





    
// this function has a for loop that runs five times to create
// new UL, LI, and button elements for the five most recent searches
    function historyButtons(){

    $("#history-buttons").empty();
        
	for (var i = 0; i < historicSearches.length; i++) {
        if (i < 5) {
        var newUL = $("<ul>")
        var newLI = $("<li>")

        // Assign the class "city-button" to each button
        var newBtn = $("<Button class='city-button'>")
        newBtn.text(historicSearches[i])
        // Assign a city name value to that button
        newBtn.attr("value", historicSearches[i])
        $("#history-buttons").append(newUL)
        $(newUL).append(newLI)
        $(newLI).append(newBtn)
        } else {
            break;
        }

    }

    // When one of these city buttons is clicked...
    $(".city-button").on("click", function(){

   
// We empty the existing forecast content
        $("#main-content").empty();
        $("#week-forecast").empty();
    
        // set our queryCity variable to whatever value is set for that button
        // and run the produceWeather() function
        queryCity = $(this).attr("value")
    
        produceWeather();
        
    
    })
}

// When the search button is clicked...

$("#srch").on("click",function(event){

    event.preventDefault();

    // We run the historyButtons() function to add the searched city to the
    // button list

    historyButtons();

    

// empty the existing forecast content
    $("#main-content").empty();
    $("#week-forecast").empty();

    // grab whatever value is in the text box
    var getCityName = document.getElementsByName("search");

    for (var i = 0; i < getCityName.length; i++) {

        // and set our queryCity equal to that value
        queryCity = getCityName[i].value

    }

    // Add our query city to the beginning of the array and
    // push it all to localStorage
    historicSearches.unshift(queryCity)
    var cityString = JSON.stringify(historicSearches)
    localStorage.setItem("cityHistory", cityString)
    

    produceWeather()


})





    function produceWeather(){

    // empty the existing forecast content

        $("#main-content").empty();
        $("#week-forecast").empty();

    // API call to obtain today's forecast data.
    // We redefine the global variables that we defined earlier
    // according to the data in the resulting JSON object

    $.ajax({
        url: cQueryURL + queryCity + apiKey,
        method: "GET",
    }) .then(function(response){
        cCityName = response.name;
        cConditions = response.weather[0].description
        cTemp = response.main.temp
        // convert from Kelvin to Farenheit
        var cTempFv = parseInt(cTemp) - 273
        cTemp = 1.8 * cTempFv + 32
        cTemp = cTemp.toFixed(1)
        cHumid = response.main.humidity
        cWind = response.wind.speed
        var lon = response.coord.lon
        var lat = response.coord.lat

        
        

        
// API call to obtain UV Index
// We redefine the global variables that we defined earlier
// according to the data in the resulting JSON object

        $.ajax({
            url: uvQueryURL + apiKey + "&lat=" + lat + "&lon=" + lon,
            method: "GET",

        }) .then(function(response){

            cUVI = response.value;

            currentWeather();
            
        })

    })

    function currentWeather(){

        // Conditionals for determining what weather icon to use in
        // today's weather forecast

    if(cConditions.includes("overcast")) {
        iconImage = clouds
        iconAlt = "Overcast"
        
    } else if (cConditions.includes("rain")) {
        iconImage = rain
        iconAlt = "Rain"
    } else if (cConditions.includes("broken clouds") || cConditions.includes("scattered clouds") || cConditions.includes("few clouds")) {
        iconImage = partCloud
        iconAlt = "Partially Cloudy"
    } else if (cConditions.includes("lightning") || cConditions.includes("thunder")) {
        iconImage = lightning
        iconAlt = "Lightning"
    } else if (cConditions.includes("snow")){
        iconImage = snow
        iconAlt = "Snow"
    } else if (cConditions.includes("hail")) {
        iconImage = hail
        iconAlt = "Hail"
    } else {
        iconImage = sunny
        iconAlt = "Sunny"
    }

    // 

    // Create new div and p elements, and in these elements we display the forecast
    // icon and data
    var cDiv = $("<div>");
    var pcConditions = $("<img height = '150' width = '150'>")
    var pcTemp = $("<p>")
    var pcHumid = $("<p>")
    var pcWind = $("<p>")
    var pcUVI = $("<p>")

    $(cDiv).text(cCityName + "," + " Date: " + today);
    $(cDiv).addClass("current-weather rounded")
    $("#main-content").append(cDiv);
    $(pcConditions).attr("src", iconImage)
    $(pcTemp).text("Temperature: " + cTemp +"°F");
    $(pcHumid).text("Humidity: " + cHumid);
    $(pcWind).text("Wind Speed: " + cWind);
    $(pcUVI).text("UV Index: " + cUVI);
    $(cDiv).append(pcConditions);
    $(cDiv).append(pcTemp);
    $(cDiv).append(pcHumid);
    $(cDiv).append(pcWind);
    $(cDiv).append(pcUVI);

}

// API call to get the five day forecast
// We redefine the global variables that we defined earlier
// according to the data in the resulting JSON object

$.ajax({
    url: fQueryURL + queryCity + apiKey,
    method: "GET",
}) .then(function(response){

    var result = response.list

    // for loop that runs through the length of the resulting JSON object
    // It only grabs every 8th item as there are multiple hour
    // forecasts per day within this object
    for (var i = 0; i < result.length; i = i + 8){
    fConditions = result[i].weather[0].description
    fTemp = result[i].main.temp
    //Convert from Kelvin to Farenheit
    var fTempFv = parseInt(fTemp) - 273
    fTemp = 1.8 * fTempFv +32
    fTemp = fTemp.toFixed(1);
    fHumid = result[i].main.humidity
    fDate = result[i].dt_txt

    // conditionals for determining what weather icon will be displayed

    if(fConditions.includes("overcast")) {
        fIconImage = clouds
        fIconAlt = "Overcast"
        
    } else if (fConditions.includes("rain")) {
        fIconImage = rain
        fIconAlt = "Rain"
    } else if (fConditions.includes("broken clouds") || fConditions.includes("scattered clouds") || fConditions.includes("few clouds")) {
        fIconImage = partCloud
        fIconAlt = "Partially Cloudy"
    } else if (fConditions.includes("lightning") || fConditions.includes("thunder")) {
        fIconImage = lightning
        fIconAlt = "Lightning"
    } else if (fConditions.includes("snow")){
        fIconImage = snow
        fIconAlt = "Snow"
    } else if (fConditions.includes("hail")) {
        fIconImage = hail
        fIconAlt = "Hail"
    } else {
        fIconImage = sunny
        fIconAlt = "Sunny"
    }

    // Put the dates within this object in the appropriate format
    var dateDisplay = moment(fDate).format("MM/DD/YYYY")

    // Create a div and display appropriate icons and weather data
    // in that div
    var fDiv = $("<div class='forecast-div rounded'>")
    $(fDiv).text (dateDisplay)
    $("#week-forecast").append(fDiv)

    var fcConditions = $("<img height = '50' width = '50'>")
    var fcTemp = $("<p>")
    var fcHumid = $("<p>")

    $(fcConditions).attr("src", fIconImage)
    $(fcConditions).attr("alt", fIconAlt)
    $(fcTemp).text("Temperature: " + fTemp + "°F");
    $(fcHumid).text("Humidity " + fHumid);
    $(fDiv).append(fcConditions)
    $(fDiv).append(fcTemp)
    $(fDiv).append(fcHumid)

    }

})


} 




})