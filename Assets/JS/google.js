$(document).ready(function () {

    getDefaultCityCountry();

    // use ipinfo to source the local city and country
    function getDefaultCityCountry() {
        // Create an AJAX call to retrieve data Log the data in console
        var queryParameters = {
            token: ipinfoAPIKey,
        };
        var queryString = $.param(queryParameters);
        var queryURL = "https://ipinfo.io?" + queryString;
        // Call with a get method
        $.ajax({ url: queryURL, method: 'get' }).then(function (response) {
            defaultCity = response.city + ", " + response.country;
        }).catch(function (err) {
            console.log(err);
        }).always(function () {
            loadPage(); // this will run even if response fails
        });
    };

    
    let map;

    function initMap() {
      map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8
      });
    }
});