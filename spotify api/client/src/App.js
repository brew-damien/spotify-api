import "./App.css";
import { useState, useEffect } from "react";

const CLIENT_ID = "8e200c733f8d4bc6a852f81aff924092";
const CLIENT_SECRET = "0e03edbfeb974d4184a98f5a6508c649";

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [artistName, setArtistName] = useState("");
  const [albums, setAlbums] = useState([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(-1);

  useEffect(() => {
    const authParameters = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
    };

    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  async function search() {
    const searchParameters = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${searchInput}&type=artist`,
      searchParameters
    );
    const data = await response.json();

    const artist = data.artists.items[0];
    setArtistName(artist.name);

    const albumResponse = await fetch(
      `https://api.spotify.com/v1/artists/${artist.id}/albums?include_groups=album&market=US&limit=50`,
      searchParameters
    );
    const albumData = await albumResponse.json();

    setAlbums(albumData.items);
  }

  function toggleCardInfo(index) {
    setSelectedCardIndex((prevIndex) => (prevIndex === index ? -1 : index));
  }

  return (
    <div className="App">
      <header>
        <h1>Search Spotify for an artist!</h1>
        <div className="flex">
          <input
            className="input"
            placeholder="Search artist's name..."
            type="input"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
          ></input>
          <button name="button" onClick={search}>
            Search
          </button>
        </div>
      </header>
      <div className="container">
        <h1>{artistName}</h1>
        <div className="cards">
          {albums.map((album, index) => (
            <div key={album.id}>
              <div>
                <a href={"#" + album.id}>
                  <img
                    onClick={() => toggleCardInfo(index)}
                    className={`image ${
                      selectedCardIndex === index ? "myStyle" : "card"
                    }`}
                    // className={`${selectedCardIndex === index ? "myClass" : "card"}`}
                    src={album.images[0].url}
                    alt="album cover"
                  />
                </a>
              </div>
              <div>{album.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
