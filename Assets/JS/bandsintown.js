$(document).ready(function () {
    //#region spotify

    let artists_search_results = []
    let artist_id = []
    const clientId = '41cd629d017d4f53bc20ccb457fdd08e';
    const clientSecret = '70a3757b1ad54861be12d8693bc8b929';
    $.post({
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
        },
        data: 'grant_type=client_credentials'
    }
    ).then(function (res) {
        token = res.access_token
    })

    function get_results() {
        artists_search_results = []
        artist_id = []
        $('#band-details').empty()
        $.get({
            // method: 'GET',
            url: `https://api.spotify.com/v1/search?q=${$('#artist-input').val().trim()}&type=artist`,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }).then(function (dat) {
            // console.log(dat.artists.items);
            const artists = dat.artists.items
            artists.forEach(function (artist, index) {
                const new_artist = $(`<div class="artist" id=${index}></div>`)
                const new_artist_name = $(`<h3 class=col_1${artist.id}>${artist.name} </h3>`)
                // const new_col_2 = artist.genres[0] ? new_col_2 = $(`<td class=col_2${artist.id}>${artist.genres[0]}</td>`) : new_col_2 = $(`<td class=col_2${artist.id}>N/A</td>`)
                const new_artist_image = $(`<div class='col_3${artist.id} image-holder' ><img src=${artist.images[2].url} width='50'></div>`)
                new_artist.append(new_artist_name, new_artist_image)
                $('#band-details').append(new_artist)
                artists_search_results.push(artist.name)
                artist_id.push(artist.id)
            });
        })
    }

    $('#search-form').submit(function (event) {
        event.preventDefault()
        get_results()
    })
    //#endregion

    //#region bandsintown
    $(document).on('click', '#spotify', function (event) { event.stopPropagation() })

    $(document).on('click', '.artist', function (event) {
        // set the divs
        $("#map-canvas").attr("style", "display: none");

        $("#blurb-about-site").attr("style", "display: none");
        $("#bands-in-town").attr("style", "height: 82vh; display: block");
 
        $("#map-canvas").attr("style", "height: 40vh; display: block");
        $("#event-information").attr("style", "height: 40vh; display: block");
        // , $(this).attr("title") + "Appended text.");

        let artistId = artist_id[parseInt(this.id)]
        let divId = this.id
        // let artist = artists_search_results[parseInt(this.id)]
        $.get({
            url: `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=AU`,
            headers: { 'Authorization': 'Bearer ' + token }
        }).then(function (dat) {
            console.log(dat);
            const tracks = dat.tracks
            const new_Div = $(`<div id='spotify' class='display_hits'><p class='text-right'>x</p><h5>Top Hits</h5> </div>`)
            $(`#${divId}`).append(new_Div)
            $('.display_hits').show()
            tracks.forEach(track => {
                track.album.album_type  // may be used if needed
                let new_hit = $('<div>')
                let ex_url = $(`<div><a href=${track.external_urls.spotify} target='_blank'>${track.name}</a></div>`)
                track.album.release_date // may be used if needed
                const preview = track.preview_url ? $(`<div><audio controls src=${track.preview_url}></div`) : ''
                new_hit.append(ex_url, preview)

                $('#spotify').append(new_hit)
                $('.text-right').click(() => $('.display_hits').remove())
            })
        })
        artists_search_results.forEach((element, index) => {
            if (parseInt(this.id) === index) {
                displayBandsInTownData(element)
            }
        });
    })

    function appendArtistInfo(data) {
        // artist info
        if (data.name) {
            $("#bands-in-town-list").append($("<h2>").text(data.name).attr("style", "margin: 0 0 5px 0"));
        }
        if (data.upcoming_event_count) {
            $("#bands-in-town-list").append($("<p>").text(data.upcoming_event_count + " upcoming events"));
        } else { $("#bands-in-town-list").append($("<p>").text(artist + " is not in town")) };
        if (data.thumb_url) {
            $("#bands-in-town-list").append($("<img>").attr("src", data.image_url).width("100%"));
        }
    }

    function appendEventInfo(data) {
        //events
        $("#bands-in-town-list").append("Next upcoming event: ")

        // venue info
        if (data.venue.name) {
            $("#bands-in-town-list").append($("<h6>").text(data.venue.name))
        }
        if (data.title) {
            $("#bands-in-town-list").append($("<h5>").text(data.title).attr("style", "margin-top: 0"))
        }
        if (data.venue.location) {
            $("#bands-in-town-list").append("Location: " + data.venue.location)
        } else { $("#bands-in-town-list").append("Location: " + data.venue.type) }

        // ticket info
        if (data.offers[0].url) {
            var ticketInfo = $("<a>").text("Tickets available here").attr("href", data.offers[0].url).attr("target", "_blank")
            $("#bands-in-town-list").append($("<p>").append(ticketInfo))
        }
    }

    function displayBandsInTownData(artistName) {
        // replaces all special chars except letters, nums, non-latin chars and spaces
        var artist = artistName.replace("&", "and").replace(/([^a-zA-Z0-9$ \p{L}-]+)/ug, "")
        if (artist) {
            var artistURL = "https://rest.bandsintown.com/artists/" + artist + "?app_id=codingbootcamp"

            $.ajax({
                url: artistURL,
                method: "GET"
            }).then(function (response) {
                $("#blurb-about-site").attr("style", "display: none")
                $("#bands-in-town-list").empty();

                // error checking
                if (response.error) {
                    $("#bands-in-town-list").append(
                        ($("<h2>").text(artist).attr("style", "margin: 0 0 5px 0")),
                        ($("<p>").text(artist + " " + response.error)))
                } else if (response === "") {
                    $("#bands-in-town-list").append(
                        ($("<h2>").text(artist).attr("style", "margin: 0 0 5px 0")),
                        ($("<p>").text(artist + " is not in town")))
                } else { appendArtistInfo(response); }

                if (response.upcoming_event_count > 0) {
                    var eventURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

                    $.ajax({
                        url: eventURL,
                        method: "GET"
                    }).then(function (response) {
                        var data = response[0]
                        appendEventInfo(data)

                        // lat, long
                        if (data.venue.latitude && data.venue.longitude) {
                            var coordinates = {
                                latitude: parseFloat(data.venue.latitude),
                                longitude: parseFloat(data.venue.longitude)
                            };
                            initMap(coordinates)
                        }
                    })
                }
            })
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
                position: {
                    lat: beach[1],
                    lng: beach[2]
                },
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
        $.ajax({
            url: queryURL,
            method: 'get'
        }).then(function (response) {
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