/** overrides $("#blurb-about-site")
 * This will display band name, image, number of upcoming events and next event showing
 */

$("#searchBtn").on("click", function () {
    $("#blurb-about-site").empty();
    var artist = $("#artist-input").val().trim();
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    if (artist) {
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            var data = response[0]

            // artist info
            var artistName = $("<h2>").text(data.artist.name);
            var artistImage = $("<img>").attr("src", data.artist.thumb_url).width("200px");
            var upcomingEvents = $("<p>").text(data.artist.upcoming_event_count + " upcoming events");

            $("#blurb-about-site").append(artistName, artistImage, upcomingEvents);

            //events
            if (data.artist.upcoming_event_count > 0) {
                $("#blurb-about-site").append("Next upcoming event: ")

                // venue info
                if (data.venue.name) {
                    var showName = $("<h4>").text(data.venue.name)
                    $("#blurb-about-site").append(showName)
                }
                if (data.title) {
                    var showTitle = $("<h3>").text(data.title)
                    $("#blurb-about-site").append(showTitle)
                }
                if (data.venue.type !== "Virtual") {
                    var showLocation = $("<p>").text(data.venue.city)
                    if (data.venue.location) {
                        showLocation.append(", " + data.venue.location)
                    }
                    $("#blurb-about-site").append("Location: " + showLocation)

                } else {
                    $("#blurb-about-site").append("Location: " + data.venue.type)
                }

                // ticket info
                if (data.offers[0].url) {
                    var pTag = $("<p>")
                    var ticketInfo = $("<a>").text("Tickets available here").attr("href", data.offers[0].url)
                    pTag.append(ticketInfo)

                    $("#blurb-about-site").append(pTag)
                }
            }
        })
    }
})