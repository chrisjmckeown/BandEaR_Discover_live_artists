/** 
 * overrides $(".bands-in-town-list")
 * This will display band name, image, number of upcoming events and next event showing
 * 
 * gets an array of 20 artist names from spotify
 */
$(document).ready(function () {
    //#region spotify

    // tony

    //#endregion

    //#region bandsintown
    $("#searchBtn").on("click", function () {
        $(".bands-in-town-list").empty();

        artistName.forEach(element => {
            displayBandsInTownData(element);
        });
    })

    function displayBandsInTownData(artist) {

        var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

        if (artist) {
            $.ajax({
                url: queryURL,
                method: "GET"
            }).then(function (response) {
                console.log("bandsintown:")
                console.log(response)
                if (response) {
                    var data = response[0]

                    // artist info
                    var artistName = $("<h2>").text(data.artist.name);
                    var artistImage = $("<img>").attr("src", data.artist.thumb_url).width("200px");
                    var upcomingEvents = $("<p>").text(data.artist.upcoming_event_count + " upcoming events");

                    $(".bands-in-town-list").append(artistName, artistImage, upcomingEvents);

                    //events
                    if (data.artist.upcoming_event_count > 0) {
                        $(".bands-in-town-list").append("Next upcoming event: ")

                        // venue info
                        if (data.venue.name) {
                            var showName = $("<h4>").text(data.venue.name)
                            $(".bands-in-town-list").append(showName)
                        }
                        if (data.title) {
                            var showTitle = $("<h3>").text(data.title)
                            $(".bands-in-town-list").append(showTitle)
                        }
                        if (data.venue.city) {
                            var showLocation = $("<p>").text(data.venue.city)
                            if (data.venue.location) {
                                showLocation.append(", " + data.venue.location)
                            }
                            $(".bands-in-town-list").append("Location: " + showLocation)

                        } else {
                            $(".bands-in-town-list").append("Location: " + data.venue.type)
                        }
                        // lat, long
                        if (data.venue.latitude && data.venue.longitude) {
                            var coordinates = {
                                latitude: parseFloat(data.venue.latitude),
                                longitude: parseFloat(data.venue.longitude)
                            };
                            initMap(coordinates)
                        }

                        // ticket info
                        if (data.offers[0].url) {
                            var pTag = $("<p>")
                            var ticketInfo = $("<a>").text("Tickets available here").attr("href", data.offers[0].url)
                            pTag.append(ticketInfo)

                            $(".bands-in-town-list").append(pTag)
                        }
                    }
                } else {
                    $(".bands-in-town-list").text("Artist not found")
                }
            })
        } else {
            $(".bands-in-town-list").text("Artist not found")
        }
    }
    //#endregion

    //#region google
    let map;
    var marker;

    // initialise the map based on coordinates
    function initMap(coordinates) {
        //  create an object for the google settings
        // some of these could be user settings stored in local settings
        var mapOptions = {
            zoom: 10,
            center: { lat: coordinates.latitude, lng: coordinates.longitude },
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
        };
        // set the map variable, center location, and zoom
        console.log("here")
        map = new google.maps.Map($('#map_canvas')[0], mapOptions);
        var image = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

        // marker = new google.maps.Marker({
        //     position: { lat: coordinates.latitude, lng: coordinates.longitude },
        //     title: 'Hello World!',
        //     animation: google.maps.Animation.DROP,
        //     icon: image,
        // });

        //marker.setMap(map);
        //marker.addListener('click', toggleBounce);
        // marker.setMap(null); // remove markers
    }

    // function initMap() {
    //     var map = new google.maps.Map(document.getElementById('google-map'), {
    //       zoom: 10,
    //       center: {lat: -33.9, lng: 151.2}
    //     });

    //     //setMarkers(map);
    //   }

    // Data for the markers consisting of a name, a LatLng and a zIndex for the
    // order in which these markers should display on top of each other.
    var beaches = [
        ['Bondi Beach', -33.890542, 151.274856, 4],
        ['Coogee Beach', -33.923036, 151.259052, 5],
        ['Cronulla Beach', -34.028249, 151.157507, 3],
        ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
        ['Maroubra Beach', -33.950198, 151.259302, 1]
    ];

    function setMarkers(map) {
        // Adds markers to the map.

        // Marker sizes are expressed as a Size of X,Y where the origin of the image
        // (0,0) is located in the top left of the image.

        // Origins, anchor positions and coordinates of the marker increase in the X
        // direction to the right and in the Y direction down.
        var image = {
            url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
            // This marker is 20 pixels wide by 32 pixels high.
            size: new google.maps.Size(20, 32),
            // The origin for this image is (0, 0).
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 32).
            anchor: new google.maps.Point(0, 32)
        };
        // Shapes define the clickable region of the icon. The type defines an HTML
        // <area> element 'poly' which traces out a polygon as a series of X,Y points.
        // The final coordinate closes the poly by connecting to the first coordinate.
        var shape = {
            coords: [1, 1, 1, 20, 18, 20, 18, 1],
            type: 'poly'
        };
        for (var i = 0; i < beaches.length; i++) {
            var beach = beaches[i];
            marker = new google.maps.Marker({
                position: { lat: beach[1], lng: beach[2] },
                map: map,
                icon: image,
                shape: shape,
                animation: google.maps.Animation.DROP,
                title: beach[0],
                zIndex: beach[3]
            });
            marker.addListener('click', toggleBounce);
        }
    }

    function toggleBounce() {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

    // ipinfo API key
    var ipinfoAPIKey = "f2357f3657a5f4";
    getDefaultCityCountry();

    // use ipinfo to source the local city and country
    function getDefaultCityCountry() {
        var coordinates = getStoredCoordinates();
        // Create an AJAX call to retrieve data Log the data in console
        var queryParameters = {
            token: ipinfoAPIKey,
        };
        var queryString = $.param(queryParameters);
        var queryURL = "https://ipinfo.io?" + queryString;
        // Call with a get method
        $.ajax({ url: queryURL, method: 'get' }).then(function (response) {
            // split the location string to parse the longitude and latitude
            var loc = response.loc.split(',');
            coordinates = {
                latitude: parseFloat(loc[0]),
                longitude: parseFloat(loc[1])
            };
            // initialise the map
            initMap(coordinates);
            setStoredCoordinates(coordinates);
        }).catch(function (err) {
            console.log(err);
        });
    };

    // Get from local storage
    function getStoredCoordinates() {
        var storedCoordinates = JSON.parse(localStorage.getItem("coordinates"));
        // check contents, if not null set to variable to list else if null to empty
        if (storedCoordinates !== null) {
            return coordinates = storedCoordinates;
        }
    }

    // Set to local storage
    function setStoredCoordinates(coordinates) {
        // save the local storage with new items
        localStorage.setItem("coordinates", JSON.stringify(coordinates));
    }
    //#endregion
});