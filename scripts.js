/* eslint-disable no-undef */
const corsLink = ' https://cors-anywhere.herokuapp.com/';
const songSuggestionAPI = 'https://api.lyrics.ovh/suggest/';
const getLyricsAPI = 'https://api.lyrics.ovh/v1/';
const songContent = document.getElementById('song-results');
const lyricsBox = document.getElementById('song-lyrics-box');
const lyricsElements = document.querySelectorAll('.lyrics-div');

// function solely responsible to call the provided API
const callAPI = async (APIName) => {
  try {
    const response = await fetch(`${corsLink + APIName}`);
    const result = await response.json();
    return result;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(`Error On Calling API :${error}`);
    return false;
  }
};

const scrollFunction = async (element) => {
  element.scrollIntoView({
    behavior: 'smooth',
  });
};

const setPagination = async (result) => {
  const paginationDiv = document.getElementById('pagination-box');

  if (result.prev && result.next) {
    paginationDiv.innerHTML = `<div class="pagination clearfix">
                              <a href="#" id="previous-link" onclick="songResult('${result.prev}')">Previous</a>
                              &nbsp;
                              &nbsp;<a href="#" id="next-link" onclick="songResult('${result.next}')">Next</a>
                          </div>`;
  } else if (result.next) {
    paginationDiv.innerHTML = `<div class="pagination clearfix"><a href="#" id="next-link" onclick="songResult('${result.next}')">Next</a>
                          </div>`;
  } else if (result.prev) {
    paginationDiv.innerHTML = `<div class="pagination clearfix"><a href="#" id="next-link" onclick="songResult('${result.prev}')">Previous</a>
                          </div>`;
  } else {
    paginationDiv.innerHTML = '';
  }
};

const setSongContent = async (songsResult) => {
  Object.keys(songsResult).forEach((key) => {
    songContent.innerHTML += `<li style="overflow: hidden;">

                          <p style="float: left;">

                            <img src=${songsResult[key].album.cover_small} height="50px" width="50px" alt=""> ${songsResult[key].title} ( ${songsResult[key].artist.name} ) 

                            <audio controls>  <source src="${songsResult[key].preview}" type="audio/mpeg"> Your browser does not support the audio element. </audio>

                          </p>
                          <p style="float: right;">

                            <button class="btn" onclick ="songLyrics('${songsResult[key].title}','${songsResult[key].artist.name}')">Show Lyrics</button>

                          </p>
                        </li>`;
  });
};

const songResult = async (songLink) => {
  songContent.innerHTML = 'Searching.....';
  const result = await callAPI(`${songLink}`);

  if (result) {
    const songsResult = result.data;

    if (result.total > 0) {
      songContent.innerHTML = '';

      await setSongContent(songsResult);

      await setPagination(result);
    } else {
      songContent.innerHTML = 'Sorry !! No Song Found.';
    }
  } else {
    songContent.innerHTML = 'Something Went Wrong!! Please Try Again.';
  }

  scrollFunction(songContent);
};

document.getElementById('search-form').addEventListener('click', (e) => {
  e.preventDefault();
  const songName = document.getElementById('SongSearch').value;
  if (songName) {
    const songLink = `${songSuggestionAPI + songName}`;
    songResult(songLink);
  } else {
    songContent.innerHTML = 'Please Enter Song Title or Artist.';
  }
});
// general function for showing the elements
function show(elements, specifiedDisplay) {
  // eslint-disable-next-line no-param-reassign
  elements = elements.length ? elements : [elements];
  // eslint-disable-next-line no-plusplus
  for (let index = 0; index < elements.length; index++) {
    // eslint-disable-next-line no-param-reassign
    elements[index].style.display = specifiedDisplay || 'block';
  }
}

// eslint-disable-next-line no-unused-vars
const songLyrics = async (songTitle, songArtist) => {
  const result = await callAPI(`${getLyricsAPI}${songArtist}/${songTitle}`);
  if (result) {
    if (result.lyrics) {
      lyricsBox.innerHTML = `<span class="lyrics-desc"><h2>${songTitle}</h2>By - ${songArtist}</span><br>`;
      lyricsBox.innerHTML += result.lyrics;
    } else {
      lyricsBox.innerHTML = 'No Lyrics Found!!';
    }
    show(lyricsElements, 'inline-block');
    scrollFunction(lyricsBox);
  } else {
    lyricsBox.innerHTML = 'Something Went Wrong!! Please Try Again.';
  }
};
