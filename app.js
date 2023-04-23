require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );

app.get("/", (request, response) => {
  response.render("home");
});

app.get("/artist-search", (request, response) => {
  const { search } = request.query;
  spotifyApi
    .searchArtists(search)
    .then((data) => {
      console.log(
        "The received data from the API: ",
        data.body.artists.items[0].images[0]
      );
      response.render("artist-search-results", { data });
      // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("artist-search-results", (request, response) => {
  response.render("artist-search-results");
});
// Our routes go here:

app.listen(3000, () =>
  console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊")
);
