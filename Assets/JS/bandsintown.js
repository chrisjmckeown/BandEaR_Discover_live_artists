$("#submitButton").on("click", function(event) {
    event.preventDefault();

    var artist = $("#searchBar").val().trim();

    if (artist) {
        var artistURL = "https://rest.bandsintown.com/artists/" + artist + "?app_id=codingbootcamp";

        $.ajax({
            url: artistURL,
            method: "GET"
        }).then(function(response) {
            // sleeping with sirens
            console.log(response);

            $("#artist-name").text(response.name);
            $("#artist-image").attr("src", response.thumb_url); // artist image
            $("#band-details").append("<br>" + response.upcoming_event_count + " upcoming events");

            var events = response.upcoming_event_count
            if (events > 0) {
                var eventsURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

                $.ajax({
                    url: eventsURL,
                    method: "GET"
                }).then(function(response) {
                    console.log("events:")
                    var data = response[0]
                    console.log(data)

                    // venue
                    console.log(data.venue.type)
                    if (data.venue.name) {
                        $("#band-details").append("<br>" + data.venue.name)
                    }
                    if (data.title) {
                        $("#band-details").append("<br>" + data.title)
                    }
                    if (data.venue.city) {
                        $("#band-details").append("<br>" + data.venue.city)
                        if (data.venue.location) {
                            $("#band-details").append(", " + data.venue.location)
                        }
                    }
                    // TODO: get location object
                    
                    if (data.url) {
                        var br = $("<br>");
                        var aTag = $("<a>").text("ticket");
                        aTag.attr("href", data.offers[0].url)
                        $("#band-details").append(br)
                        $("#band-details").append(aTag)

                        console.log(data.offers[0].url)
                    }
                })
            }
            
        });
    }
})