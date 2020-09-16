/** overrides $("#blurbAboutSite")
 * This will display band name, image, number of upcoming events and next event showing
 */

$("#searchBtn").on("click", function() {
    $("#blurbAboutSite").empty();
    var artist = $("#artist-input").val().trim();
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    if (artist) {
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            var data = response[0]

            // artist info
            var artistName = $("<h2>").text(data.artist.name);
            var artistImage = $("<img>").attr("src", data.artist.thumb_url).width("200px");
            var upcomingEvents = $("<p>").text(data.artist.upcoming_event_count + " upcoming events");

            $("#blurbAboutSite").append(artistName, artistImage, upcomingEvents);

            //events
            if (data.artist.upcoming_event_count > 0) {
                $("#blurbAboutSite").append("Next upcoming event: ")

                // venue info
                if (data.venue.name) {
                    var showName = $("<h4>").text(data.venue.name)
                    $("#blurbAboutSite").append(showName)
                }
                if (data.title) {
                    var showTitle = $("<h3>").text(data.title)
                    $("#blurbAboutSite").append(showTitle)
                }
                if (data.venue.type !== "Virtual") {
                    var showLocation = $("<p>").text(data.venue.city)
                    if (data.venue.location) {
                        showLocation.append(", " + data.venue.location)
                    }
                    $("#blurbAboutSite").append("Location: " + showLocation)

                } else {
                    $("#blurbAboutSite").append("Location: " + data.venue.type)
                }

                // ticket info
                if (data.offers[0].url) {
                    var pTag = $("<p>")
                    var ticketInfo = $("<a>").text("Tickets available here").attr("href", data.offers[0].url)
                    pTag.append(ticketInfo)

                    $("#blurbAboutSite").append(pTag)
                }
            }
        })
    }
})