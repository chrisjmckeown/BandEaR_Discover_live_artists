let favourite_singers = []
let artists_search_results = []
let artist_id = []
let artist_image = []
let artist_object = []

$(document).ready(function () {
    //#region spotify
    setMainBody(false);
    function displayFavourites() {
        if (localStorage.getItem('favourite_singers')) {
            favourite_singers = JSON.parse(localStorage.getItem('favourite_singers'))
        }
        favourite_singers.forEach(function (artist) {
            const new_artist = $(`<div class="artist" id=${artist[2]}></div>`)
            const new_artist_name = $(`<h3 class=col_1${artist[2]}>${artist[0]} </h3>`)
            const new_artist_image = $(`<div class='col_3${artist[2]} image-holder' ><img src=${artist[1]} ></div>`)

            new_artist.append(new_artist_name, new_artist_image)
            $('#band-details').append(new_artist)
            $('#band-details').show()
            artists_search_results.push(artist[0])
            artist_image.push(artist[1])
            artist_id.push(artist[2])
            artist_object.push(artist)
        })
    }

    function setMainBody(searchInProgress) {
        if (!searchInProgress) {
            // set the divs
            // Set middle section
            $("#blurb-about-site").css("display", "block");
            $("#bands-in-town").css("display", "none");
            $("#map-canvas").css("height", "82vh");
            // Set right section
            $("#event-information").css("display", "none");
            $("#spacer").css("display", "none");
            $('#band-details').empty();
            displayFavourites();
        } else {
            // Set middle section
            $("#blurb-about-site").css("display", "none");
            $("#bands-in-town").css("display", "block");
            $("#map-canvas").css("height", "40vh");
            // Set right section
            $("#event-information").css("display", "block");
            $("#spacer").css("display", "block");
        }
        $("#event-information-title").text("Event Information:");
        $('#event-information-list').empty();
        $("#band-info").empty();
        $("#band-tracks").empty();
        $("#event-information-content").empty();
        getDefaultCityCountry();
    }


    // Set variables for the API Keys for the Spotify content 
    const clientId = '41cd629d017d4f53bc20ccb457fdd08e';
    const clientSecret = '70a3757b1ad54861be12d8693bc8b929';
    // Retrieve the Spotify Information
    $.post({
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        data: 'grant_type=client_credentials'
    }).then(function (res) {
        token = res.access_token
    })

    // Retrieve information based on teh text typed into the searchbar #artist-input
    function get_results() {
        artists_search_results = []
        artist_image = []
        artist_id = []
        artist_object = []
        $('#band-details').empty()
        $('#band-details').show()
        $.get({
            // method: 'GET',
            url: `https://api.spotify.com/v1/search?q=${$('#artist-input').val().trim()}&type=artist`,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(function (dat) {
            const artists = dat.artists.items
            artists.forEach(function (artist) {
                const new_artist = $(`<div class="artist" id=${artist.id}></div>`)
                const new_artist_name = $(`<h3 class=col_1${artist.id}>${artist.name} </h3>`)
                const new_artist_image = $(`<div class='col_3${artist.id} image-holder' ><img src=${artist.images[2].url} width='50'></div>`)

                // appends a <h3> of the arists name and an image of teh artist to the empty div .artist and pushes results to empty arrays
                new_artist.append(new_artist_name, new_artist_image)
                $('#band-details').append(new_artist)
                artists_search_results.push(artist.name)
                artist_image.push(artist.images[2].url)
                artist_id.push(artist.id)
                artist_object.push(artist)
            });
        })
    }

    // Displays the searched for artist along with image of said artist in the side content underneath the search bar
    $('#search-form').submit(function (event) {
        event.preventDefault();
        get_results();
    })

    $("#artist-input").keyup(function () {
        var $input = $(this).val().trim();
        if (!$input) {
            setMainBody(false);
        }
    });
    //#endregion

    //#region bandsintown

    $(document).on('click', '#spotify', function (event) {
        event.stopPropagation()
    })

    $(document).on('click', '.artist', function () {
        setMainBody(true);
        document.querySelector('#bands-in-town-band-name').scrollIntoView();

        let artistId = this.id
        let check = 0
        favourite_singers.forEach(singer => {
            if (singer[2] === artistId) {
                check++;

            }
        })


        artist_id.forEach((artist, index) => {
            if (artist === artistId && check === 0) {
                favourite_singers.push([artists_search_results[index], artist_image[index], artistId, artist_object[index]])
                localStorage.setItem('favourite_singers', JSON.stringify(favourite_singers))
            }
        });

        $.get({
            url: `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=AU`,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(function (response) {
            const tracks = response.tracks
            $("#band-tracks").append($("<h5>").text("Top Hits"))
            $("#band-tracks").append($("<div>").attr("class", "display-hits"))
            $(".display-hits").show()

            tracks.forEach(track => {
                // track.album.album_type // may be used if needed
                let $new_hit = $('<div>')
                let $ex_url = $(`<div><a href=${track.external_urls.spotify} target='_blank'>${track.name}</a></div>`)
                // track.album.release_date // may be used if needed
                const preview = track.preview_url ? $(`<div><audio controls src=${track.preview_url}></div><hr>`) : $('<hr>')
                $new_hit.append($ex_url, preview)

                $(".display-hits").append($new_hit)
            })
        })

        favourite_singers.forEach((singer) => {
            if ((this.id) === singer[2]) {
                displayBandsInTownData(singer[0])
                displaySpotifyData(singer[3])
            }
        });
    })


    function displaySpotifyData(artist) {
        $('#spotify-info').empty()
        // console.log(artist)
        $("#bands-in-town-band-name").html(`<a href=${artist.external_urls.spotify} target='_blank'>${artist.name}</a>`);
        $("#band-info").prepend($("<img>").attr("src", artist.images[1].url).css({
            "max-width": "100%",
            "max-height": "260px"
        }))

        $('#spotify-info').append(`<p><strong>Genres: </strong>${artist.genres.slice(0, 2).join()}</p>`)
        $.get({
            url: `https://api.spotify.com/v1/artists/${artist.id}/albums?market=AU&limit=10`,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(function (response) {
            let albums = []
            response.items.forEach(item => albums.push(`<a href=${item.external_urls.spotify} class='spotify-album' target='_blank'>&nbsp;${item.name}</a>`))
            $('#spotify-info').append(`<p><strong>Albums: </strong>${albums.join(' ')}</p>`)

        })
    }
    function appendArtistInfo(data) {
        // artist info
        //Spotify used to display these info.
        // check and set the upcoming event count, if none then display no upcoming events
        if (data.upcoming_event_count) {
            $("#event-information-title").text("Event Information: " + data.upcoming_event_count + " events");
        } else {
            // reset map to your location
            initMap(defaultCoodinates);
        };
    }

    var eventList = [];

    function appendEventInfoList(response) {
        eventList = response;
        var $eventListUL = $("<ul>");
        $eventListUL.addClass("all-events");
        $("#event-information-list").append($eventListUL);

        // loop through the response and add a new <li> then add one to index which then gets appended to the eventListUL
        var index = 0;
        response.forEach(function (data) {
            var $newEvent = $("<li>");
            $newEvent.text(data.venue.name);
            $newEvent.addClass("clickable-event-item");
            $newEvent.attr("id", "clickable-event-item");
            $newEvent.attr("index", index++);
            $($eventListUL).append($newEvent);
        });
        appendEventInfo(response[0]);
    }

    $(document).on('click', '#clickable-event-item', function () {
        var $index = $(this).attr("index");
        $("#event-information-content").empty();
        appendEventInfo(eventList[$index], $index);
        $("#scroll").scrollTop(0);
    });
    var timeout;

    function appendEventInfo(data) {
        // create an item to pass key info to the map
        var $mapContainer = $("<div>");
        // un-ordered list for event information and add to event-information-content div
        var $eventUL = $("<ul>");
        $("#event-information-content").append($eventUL);
        $eventUL.addClass("current-event");
        // date of event
        var date = moment(data.datetime).format('DD/MM/YYYY');
        $mapContainer.append(date)
        $eventUL.append($("<li>").html("Date: <br><strong>" + date + "</strong>").attr("id", "event-item"));

        // create a count down timer to event
        clearInterval(timeout);
        $eventUL.append($("<li>").attr("id", "countdown"));
        var eventTime = moment(data.datetime).unix();
        var currentTime = moment().unix();
        var diffTime = eventTime - currentTime;
        var duration = moment.duration(diffTime * 1000, 'milliseconds');
        var durationDay = moment(data.datetime).diff(moment(), 'days');
        var interval = 1000;
        timeout = setInterval(function () {
            duration = moment.duration(duration - interval, 'milliseconds');
            durationDay = moment(data.datetime).diff(moment(), 'days');
            $('#countdown').html(
                "Countdown: <br><strong>" +
                durationDay + "d " +
                duration.hours() + "h " +
                duration.minutes() + "m " +
                duration.seconds() + "s</strong>");
        }, interval);

        // query for google maps places
        var placesSearchQuery;
        // check if venue name exists and add to list
        if (data.venue.name) {
            $mapContainer.append($("<h6>").text(data.venue.name))
            $eventUL.append($("<li>").html("Venue: <br><strong>" + data.venue.name + "</strong>").attr("id", "event-item"));
            placesSearchQuery = data.venue.name;
        }
        // check if venue title exists and add to list
        if (data.title) {
            $eventUL.append($("<li>").html("Title: <br><strong>" + data.title + "</strong>").attr("id", "event-item"));
        }
        // check if venue location exists and add to list
        if (data.venue.location) {
            $mapContainer.append(data.venue.location);
            $eventUL.append($("<li>").html("Location: <br><strong>" + data.venue.location + "</strong>").attr("id", "event-item"));
            if (placesSearchQuery) {
                placesSearchQuery += ", " + data.venue.location
            } else {
                placesSearchQuery += data.venue.location
            }
        } else {
            $eventUL.append($("<li>").html("Type: <br><strong>" + data.venue.type + "</strong>").attr("id", "event-item"));
        }
        // check if venue ticket information exists and add to list
        if (data.offers[0].url) {
            var $eventLi = $("<li>");
            $eventLi.append('<a href=' + data.offers[0].url + ' target="_blank">Tickets available here</a>');
            $eventLi.addClass("clickable-event-item");
            $eventLi.attr("id", "clickable-event-item");
            $eventUL.append($eventLi);
        }
        // if the places query was populated then try find the venue location and pin point it
        if (placesSearchQuery) {
            initMapPlace(placesSearchQuery, $mapContainer, data.venue);
        } else {
            // try find the venue lng and lat, which is the city and use it
            if (data.venue.latitude && data.venue.longitude) {
                var coordinates = {
                    lat: parseFloat(data.venue.latitude),
                    lng: parseFloat(data.venue.longitude)
                };
                initMap(coordinates)
            }
        }
    }
    function displayBandsInTownData(artistName) {
        // replaces all special chars except letters, nums, non-latin chars and spaces
        var artist = artistName.replace("&", "and").replace(/([^a-zA-Z0-9$ \p{L}-]+)/ug, "");
        if (artist) {
            var artistURL = "https://rest.bandsintown.com/artists/" + artist + "?app_id=codingbootcamp";
            $.ajax({
                url: artistURL,
                method: "GET"
            }).then(function (response) {

                // error checking
                if (response.error || response === "") {
                    $("#bands-in-town-band-name").text(artist);

                    $("#band-info").append($("<p>").html(artist + " has no upcoming events, but feel free to preview their music &#128521;"));
                    // fetches the artist info and displays song samples
                } else {
                    if (response.upcoming_event_count > 0) {
                        var eventURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
                        $.ajax({
                            url: eventURL,
                            method: "GET"
                        }).then(function (response) {
                            eventList = [];
                            appendEventInfoList(response);
                        });
                    } else {

                        $("#map-canvas").css("display", "block");
                        $("#event-information").css("display", "none");
                        $("#band-info").append($("<p>").html(artist + " has no upcoming events, but feel free to preview their music &#128521;"));

                    }
                    appendArtistInfo(response);
                }
            });
        };
    };
    //#endregion

    //#region google

    // ipinfo API key
    var ipinfoAPIKey = "f2357f3657a5f4";
    getDefaultCityCountry();
    let map;
    var marker;
    var defaultCoodinates;
    var infoWindowAccomodation;

    // initialise the map based on coordinates
    function initMap(coordinates) {
        // create an object for the google settings
        // some of these could be user settings stored in local settings
        var mapOptions = {
            zoom: 13,
            center: {
                lat: coordinates.latitude,
                lng: coordinates.longitude
            },
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
        };
        // set the map variable, center location, and zoom
        map = new google.maps.Map($('#map-canvas')[0], mapOptions);
        places = new google.maps.places.PlacesService(map);

    }

    // initialise the map based on coordinates
    function initMapPlace(queryPlace, $container, venue) {
        // request query for findPlaceFromQuery call
        var requestQuery = {
            query: queryPlace,
            fields: ["name", "geometry"]
        };
        // initialise the PlacesService to pin point the venue location
        var service = new google.maps.places.PlacesService(map);

        infoWindowAccomodation = new google.maps.InfoWindow({
            content: document.getElementById("info-content")
        });
        // using the requestQuery find the venue
        service.findPlaceFromQuery(requestQuery, function (results, status) {
            // if result is returned then set the marker to the coordinate of the venue
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                for (let i = 0; i < results.length; i++) {
                    createMarker(results[i].geometry.location, $container);
                }
                map.setCenter(results[0].geometry.location);
                search(results[0].geometry.location);
            } else {
                // else if the venue lng and lat exist, which is the city rather than the venue itself, set the marker to the city
                if (venue.latitude && venue.longitude) {
                    var coordinates = {
                        lat: parseFloat(venue.latitude),
                        lng: parseFloat(venue.longitude)
                    };
                    createMarker(coordinates, $container);
                    map.setCenter(coordinates);
                }
            }
        });
    }

    // create the marker and info window
    function createMarker(location, $container) {
        // initialise the marker data
        marker = new google.maps.Marker({
            map,
            position: location,
            animation: google.maps.Animation.DROP,
        });
        // set the marker on the map
        marker.setMap(map);
        // create a infowindow item to display some facts about the venue
        var infowindow = new google.maps.InfoWindow({
            content: $container.prop('outerHTML'),
        });
        marker.addListener('click', function () {
            infowindow.open(map, marker);
        });
    }

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
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {
            // split the location string to parse the longitude and latitude
            if (response.loc) {
                var loc = response.loc.split(',');
                coordinates = {
                    latitude: parseFloat(loc[0]),
                    longitude: parseFloat(loc[1])
                };
                defaultCoodinates = coordinates;

                // initialise the map
                initMap(coordinates);
                setStoredCoordinates(coordinates);
            }
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
    var MARKER_PATH =
        "https://developers.google.com/maps/documentation/javascript/images/marker_green";
    var places;
    var markers = [];
    function search(coordinates) {
        var search = {
            location: coordinates,
            radius: 2000,
            types: ["lodging"]
        };
        places.nearbySearch(search, (results, status, pagination) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                clearMarkers();
                // Create a marker for each hotel found, and
                // assign a letter of the alphabetic to each marker icon.
                for (let i = 0; i < results.length; i++) {
                    const markerLetter = String.fromCharCode(
                        "A".charCodeAt(0) + (i % 26)
                    );
                    // Use marker animation to drop the icons incrementally on the map.
                    const markerIcon = MARKER_PATH + markerLetter + ".png";

                    markers[i] = new google.maps.Marker({
                        position: results[i].geometry.location,
                        animation: google.maps.Animation.DROP,
                        icon: markerIcon
                    });
                    // If the user clicks a hotel marker, show the details of that hotel
                    // in an info window.

                    markers[i].placeResult = results[i];
                    google.maps.event.addListener(
                        markers[i],
                        "click",
                        showInfoWindow
                    );
                    setTimeout(dropMarker(i), i * 100);
                }
            }
        });
    }

    function clearMarkers() {
        for (let i = 0; i < markers.length; i++) {
            if (markers[i]) {
                markers[i].setMap(null);
            }
        }
        markers = [];
    }

    function dropMarker(i) {
        return function () {
            markers[i].setMap(map);
        };
    }

    function showInfoWindow() {
        const marker = this;
        places.getDetails(
            {
                placeId: marker.placeResult.place_id
            },
            (place, status) => {
                if (status !== google.maps.places.PlacesServiceStatus.OK) {
                    return;
                }

                infoWindowAccomodation.open(map, marker);
                buildIWContent(place);
            }
        );
    } // Load the place information into the HTML elements used by the info window.

    const hostnameRegexp = new RegExp("^https?://.+?/");
    function buildIWContent(place) {
        document.getElementById("iw-icon").innerHTML =
            '<img class="hotelIcon" ' + 'src="' + place.icon + '"/>';
        document.getElementById("iw-url").innerHTML =
            '<b><a href="' + place.url + '">' + place.name + "</a></b>";
        document.getElementById("iw-address").textContent = place.vicinity;

        if (place.formatted_phone_number) {
            document.getElementById("iw-phone-row").style.display = "";
            document.getElementById("iw-phone").textContent =
                place.formatted_phone_number;
        } else {
            document.getElementById("iw-phone-row").style.display = "none";
        } // Assign a five-star rating to the hotel, using a black star ('&#10029;')
        // to indicate the rating the hotel has earned, and a white star ('&#10025;')
        // for the rating points not achieved.

        if (place.rating) {
            let ratingHtml = "";

            for (let i = 0; i < 5; i++) {
                if (place.rating < i + 0.5) {
                    ratingHtml += "&#10025;";
                } else {
                    ratingHtml += "&#10029;";
                }

                document.getElementById("iw-rating-row").style.display = "";
                document.getElementById("iw-rating").innerHTML = ratingHtml;
            }
        } else {
            document.getElementById("iw-rating-row").style.display = "none";
        }
        // The regexp isolates the first part of the URL (domain plus subdomain)
        // to give a short URL for displaying in the info window.

        if (place.website) {
            let fullUrl = place.website;
            let website = String(hostnameRegexp.exec(place.website));

            if (!website) {
                website = "http://" + place.website + "/";
                fullUrl = website;
            }

            document.getElementById("iw-website-row").style.display = "";
            document.getElementById("iw-website").textContent = website;
        } else {
            document.getElementById("iw-website-row").style.display = "none";
        }
    }
    //#endregion
});