// /** overrides $(".bands-in-town-list")
//  * This will display band name, image, number of upcoming events and next event showing
//  * 
//  * get an array of 20 artist names from spotify
//  */
var artists_search_results = []
var clientId = '41cd629d017d4f53bc20ccb457fdd08e';
var clientSecret = '70a3757b1ad54861be12d8693bc8b929';
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
    // console.log(token);
})

function get_results() {
    artists_search_results = []
    $('#band-details').empty()
    $.get({

        // method: 'GET',
        url: `https://api.spotify.com/v1/search?q=${$('#artist-input').val().trim()}&type=artist`,
        headers: { 'Authorization': 'Bearer ' + token }

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
        });
    })

}


$('#search-form').submit(function (event) {

    event.preventDefault()
    get_results()
})

$(document).on('click', '.artist', function () {
    // console.log('hello');
    // console.log(artists_search_results);
    artists_search_results.forEach((element, index) => {
        if (parseInt(this.id) == index) {
            displayBandsInTownData(element)
        }
    });
})


function displayBandsInTownData(artistName) {
    $(".bands-in-town-list").empty();
    var artist = artistName
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
                    if (data.venue.latitude) {
                        if (data.venue.longitude) {
                            console.log("latitude: " + data.venue.latitude + "longitude: " + data.venue.longitude)
                        }
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