$(document).ready(function(){

var fQueryURL = "https://api.openweathermap.org/data/2.5/forecast?q="
var cQueryURL = "https://api.openweathermap.org/data/2.5/weather?q="
var uvQueryURL = "https://api.openweathermap.org/data/2.5/uvi?"
var apiKey = "&appid=4a3d57db75c4e2951a03efa8186805ed"
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
var sunny = "https://cdn4.iconfinder.com/data/icons/weatherful/72/Sunny-512.png"
var rain = "https://cdn4.iconfinder.com/data/icons/weatherful/72/Raining-512.png"
var clouds = "https://cdn4.iconfinder.com/data/icons/weatherful/72/Cloudy-512.png"
var partCloud = "https://cdn4.iconfinder.com/data/icons/weatherful/72/Cloudy_Sunny-512.png"
var lightning = "https://cdn4.iconfinder.com/data/icons/weatherful/72/Lightning-512.png"
var snow = "https://cdn4.iconfinder.com/data/icons/weatherful/72/Snow_Clody-512.png"
var windy = "https://cdn4.iconfinder.com/data/icons/weatherful/72/Windy-512.png"
var hail = "https://cdn4.iconfinder.com/data/icons/weatherful/72/Snowing-512.png"
var iconImage = ""
var iconAlt = ""
var fIconImage = ""
var fIconAlt = ""



if (localStorage.getItem('cityHistory')) {
    historicSearches =  JSON.parse(localStorage.getItem("cityHistory"))
    historyButtons();
    
} else {

    var cityString = JSON.stringify(historicSearches)
    localStorage.setItem("cityHistory", cityString)
    historicSearches = JSON.parse(localStorage.getItem("cityHistory"))
    
    }





    

    function historyButtons(){

    $("#history-buttons").empty();
        
	for (var i = 0; i < historicSearches.length; i++) {
        if (i < 5) {
        var newUL = $("<ul>")
        var newLI = $("<li>")
        var newBtn = $("<Button class='city-button'>")
        newBtn.text(historicSearches[i])
        newBtn.attr("value", historicSearches[i])
        $("#history-buttons").append(newUL)
        $(newUL).append(newLI)
        $(newLI).append(newBtn)
        } else {
            break;
        }

    }

    $(".city-button").on("click", function(){

   

        $("#main-content").empty();
        $("#week-forecast").empty();
    
        
        queryCity = $(this).attr("value")
    
        produceWeather();
        
    
    })
}



$("#srch").on("click",function(event){

    event.preventDefault();

    historyButtons();

    


    $("#main-content").empty();
    $("#week-forecast").empty();

    var getCityName = document.getElementsByName("search");

    for (var i = 0; i < getCityName.length; i++) {

        
        queryCity = getCityName[i].value

    }

    historicSearches.unshift(queryCity)
    var cityString = JSON.stringify(historicSearches)
    localStorage.setItem("cityHistory", cityString)
    

    produceWeather()


})





    function produceWeather(){

        $("#main-content").empty();
        $("#week-forecast").empty();

    $.ajax({
        url: cQueryURL + queryCity + apiKey,
        method: "GET",
    }) .then(function(response){
        cCityName = response.name;
        cConditions = response.weather[0].description
        cTemp = response.main.temp
        cHumid = response.main.humidity
        cWind = response.wind.speed
        var lon = response.coord.lon
        var lat = response.coord.lat

        
        

        


        $.ajax({
            url: uvQueryURL + apiKey + "&lat=" + lat + "&lon=" + lon,
            method: "GET",

        }) .then(function(response){

            cUVI = response.value;

            currentWeather();
            
        })

    })

    function currentWeather(){

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

    var cDiv = $("<div>");
    var pcConditions = $("<img height = '150' width = '150'>")
    var pcTemp = $("<p>")
    var pcHumid = $("<p>")
    var pcWind = $("<p>")
    var pcUVI = $("<p>")

    $(cDiv).text(cCityName + "," + " Date: " + today);
    $(cDiv).addClass("current-weather")
    $("#main-content").append(cDiv);
    $(pcConditions).attr("src", iconImage)
    $(pcTemp).text("Temperature: " + cTemp);
    $(pcHumid).text("Humidity " + cHumid);
    $(pcWind).text("Wind Speed " + cWind);
    $(pcUVI).text("UV Index: " + cUVI);
    $(cDiv).append(pcConditions);
    $(cDiv).append(pcTemp);
    $(cDiv).append(pcHumid);
    $(cDiv).append(pcWind);
    $(cDiv).append(pcUVI);

}

$.ajax({
    url: fQueryURL + queryCity + apiKey,
    method: "GET",
}) .then(function(response){

    var result = response.list
    
    for (var i = 0; i < result.length; i = i + 8){
    fConditions = result[i].weather[0].description
    fTemp = result[i].main.temp
    fHumid = result[i].main.humidity
    fDate = result[i].dt_txt

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

    var dateDisplay = moment(fDate).format("MM/DD/YYYY")

    var fDiv = $("<div class='forecast-div'>")
    $(fDiv).text (dateDisplay)
    $("#week-forecast").append(fDiv)

    var fcConditions = $("<img height = '50' width = '50'>")
    var fcTemp = $("<p>")
    var fcHumid = $("<p>")

    $(fcConditions).attr("src", fIconImage)
    $(fcConditions).attr("alt", fIconAlt)
    $(fcTemp).text("Temperature: " + fTemp);
    $(fcHumid).text("Humidity " + fHumid);
    $(fDiv).append(fcConditions)
    $(fDiv).append(fcTemp)
    $(fDiv).append(fcHumid)

    }

})


} 




})