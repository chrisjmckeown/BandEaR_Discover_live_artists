// const clientId = '41cd629d017d4f53bc20ccb457fdd08e';
// const clientSecret = '70a3757b1ad54861be12d8693bc8b929';
// $.post({
//     url: 'https://accounts.spotify.com/api/token',
//     headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
//     },
//     data: 'grant_type=client_credentials'
// }

// ).then(function (res) {
//     token = res.access_token
//     // console.log(token);
// })


// artists_search_results = []
// function get_results() {
//     artists_search_results = []
//     $('#band-details').empty()
//     $.get({

//         // method: 'GET',
//         url: `https://api.spotify.com/v1/search?q=${$('#artist-input').val().trim()}&type=artist`,
//         headers: { 'Authorization': 'Bearer ' + token }

//     }).then(function (dat) {

//         // console.log(dat.artists.items);
//         const artists = dat.artists.items
//         artists.forEach(function (artist) {
//             const new_artist = $(`<div class="artist"></div>`)
//             const new_artist_name = $(`<h3 class=col_1${artist.id}>${artist.name}</h3>`)
//             // const new_col_2 = artist.genres[0] ? new_col_2 = $(`<td class=col_2${artist.id}>${artist.genres[0]}</td>`) : new_col_2 = $(`<td class=col_2${artist.id}>N/A</td>`)
//             const new_artist_image = $(`<div class='col_3${artist.id} image-holder' ><img src=${artist.images[2].url} width='50'></div>`)
//             new_artist.append(new_artist_name, new_artist_image)
//             $('#band-details').append(new_artist)
//             artists_search_results.push(artist.name)
//         });
//     })

// }


// $('#search-form').submit(function (event) {

//     event.preventDefault()
//     get_results()
// })

// $(document).on('click', 'td', function () {
//     $('.display_hits').remove()

//     let artist_id = this.className.slice(5)
//     let artist = $(`.col_1${artist_id}`)
//     $.get({

//         // method: 'GET',
//         url: `https://api.spotify.com/v1/artists/${artist_id}/top-tracks?country=AU`,
//         headers: { 'Authorization': 'Bearer ' + token }

//     }).then(function (dat) {
//         console.log(dat);
//         const tracks = dat.tracks

//         const new_Div = $(`<div class='display_hits'><p class='text-right'>x</p><table id='hits'></table> </div>`)
//         $(`.col_3${artist_id}`).append(new_Div)
//         $('.display_hits').show()
//         tracks.forEach(track => {
//             track.album.album_type  // may be used if needed
//             let new_row = $('<tr>')
//             let ex_url = $(`<td><a href=${track.external_urls.spotify} target='_blank'>${track.name}</a></td>`)
//             track.album.release_date // may be used if needed
//             const preview = track.preview_url ? $(`<td><audio controls src=${track.preview_url}></td>`) : $(`<td>Preview not avialable</td>`)
//             new_row.append(ex_url, preview)

//             $('#hits').append(new_row)
//             $('.text-right').click(() => $('.display_hits').remove())
//         })

//     })
// })


