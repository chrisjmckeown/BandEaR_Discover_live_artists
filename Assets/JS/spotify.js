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

).then(res => {
    token = res.access_token
    console.log(token);
})



function get_results() {

    $.get({

        // method: 'GET',
        url: `https://api.spotify.com/v1/search?q=${$('#artist-search').val()}&type=artist`,
        headers: { 'Authorization': 'Bearer ' + token }

    }).then(dat => {
        console.log(dat.artists.items);
        const artists = dat.artists.items
        artists.forEach(artist => {
            const new_row = $('<tr>')
            const new_col_1 = $(`<td class=col_1${artist.id}>${artist.name}</td>`)
            let new_col_2 = ''
            if (artist.genres[0]) {
                new_col_2 = $(`<td class=col_2${artist.id}>${artist.genres[0]}</td>`)
            }
            else {
                new_col_2 = $(`<td class=col_2${artist.id}>N/A</td>`)
            }

            const new_col_3 = $(`<td class=col_3${artist.id}><img src=${artist.images[2].url} width='100'></td>`)
            new_row.append(new_col_1, new_col_2, new_col_3)
            $('#artist_list').append(new_row)
        });
    })

}


$('#search-form').submit(e => {

    e.preventDefault()
    get_results()
})

$(document).on('click', 'td', function () {
    $('.display_hits').remove()

    let artist_id = this.className.slice(5)
    let artist = $(`.col_1${artist_id}`)
    $.get({

        // method: 'GET',
        url: `https://api.spotify.com/v1/artists/${artist_id}/top-tracks?country=AU`,
        headers: { 'Authorization': 'Bearer ' + token }

    }).then(dat => {
        console.log(dat);
        const tracks = dat.tracks

        const new_Div = $(`<div class='display_hits'><p class='text-right'>x</p><table id='hits'></table> </div>`)
        $(`.col_3${artist_id}`).append(new_Div)
        $('.display_hits').show()
        tracks.forEach(track => {
            track.album.album_type  // may be used if needed
            let new_row = $('<tr>')
            let ex_url = $(`<td><a href=${track.external_urls.spotify} target='_blank'>${track.name}</a></td>`)
            track.album.release_date // may be used if needed
            let preview = ''
            if (track.preview_url) {
                preview = $(`<td><audio controls src=${track.preview_url}></td>`)
            } else {
                preview = $(`<td>Preview not avialable</td>`)
            }
            new_row.append(ex_url, preview)

            $('#hits').append(new_row)
            $('.text-right').click(() => $('.display_hits').remove())
        })

    })
})


