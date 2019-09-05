const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

hbs.registerPartials(__dirname + '/views/partials');

// Inject body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// setting the spotify-api goes here:
const clientId = '1ab79d11dfa24c009fdf93fbb6ad6c6c',
    clientSecret = '2880e4f0352d4110a1f59f3477ca99e9';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  })

// the routes go here:
app.get('/', (req, res, next) => {
    res.render('index')
});

app.post('/artists', (req, res, next) => {
    //////////////////Check params vs body
    let artist = req.body.artist;
  
    spotifyApi.searchArtists(artist)
    .then(data => {
    //   console.log("The received data from the API: ", data.body);
      const dataMusic = {
          items: data.body.artists.items
      }
    //   console.log(dataMusic.items)
      res.render('artists', dataMusic)
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
});


app.post('/albums/:artistID', (req, res, next) => {
    let artistId = req.params.artistID
    spotifyApi.getArtistAlbums(artistId)
    .then(function(data) {
        const dataArtist = {
            albums: data.body.items
        }

        res.render('albums', dataArtist)
    }, function(err) {
        console.error(err);
    });
});

app.post('/tracks/:albumID', (req, res, next) => {
  let albumId = req.params.albumID
  spotifyApi.getAlbumTracks(albumId, { limit : 5, offset : 1 })
  .then(function(data) {
    const dataTracks = {
      albums: data.body.items
  }
    console.log(dataTracks);
    res.render('tracks', dataTracks)
  }, function(err) {
    console.log('Something went wrong!', err);
  });
});













app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
