/** overrides $(".bands-in-town-list")
 * This will display band name, image, number of upcoming events and next event showing
 * 
 * get an array of 20 artist names from spotify
 */

artistName.forEach(element => {
    displayBandsInTownData(element);
});

function displayBandsInTownData(artist) {
    $(".bands-in-town-list").empty();
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    if (artist) {
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
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