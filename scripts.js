/* eslint-disable no-undef */
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

const songResult = async (songLink) => {
  const theDiv = document.getElementById('song-results');

  theDiv.innerHTML = 'Searching.....';
  const response = await fetch(`${songLink}`);
  const result = await response.json();

  const songsResult = result.data;

  const uniqueSongResult = songsResult.filter(onlyUnique);

  if (result.total > 0) {
    theDiv.innerHTML = '';

    Object.keys(uniqueSongResult).forEach((key) => {
      theDiv.innerHTML += `<li style="overflow: hidden;"><p style="float: left;"><img src=${uniqueSongResult[key].album.cover_small} height="50px" width="50px" alt=""> ${uniqueSongResult[key].title} ( ${uniqueSongResult[key].artist.name} ) <audio controls>  <source src="${uniqueSongResult[key].preview}" type="audio/mpeg"> Your browser does not support the audio element. </audio></p><p style="float: right;"><button class="btn" onclick ="songLyrics('${uniqueSongResult[key].title}','${uniqueSongResult[key].artist.name}')">Show Lyrics</button></p></li>`;
    });

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
  } else {
    theDiv.innerHTML = 'Sorry !! No Song Found.';
  }

  document.getElementById('song-results').scrollIntoView({
    behavior: 'smooth',
  });
};

document.getElementById('search-form').addEventListener('click', (e) => {
  e.preventDefault();
  const songName = document.getElementById('SongSearch').value;
  if (songName) {
    const songLink = `https://api.lyrics.ovh/suggest/${songName}`;
    songResult(songLink);
  }
});

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
  const response = await fetch(`https://api.lyrics.ovh/v1/${songArtist}/${songTitle}`);
  const result = await response.json();
  const lyricsBox = document.getElementById('song-lyrics-box');

  if (result.lyrics) {
    lyricsBox.innerHTML = result.lyrics;
  } else {
    lyricsBox.innerHTML = 'No Lyrics Found!!';
  }
  const elements = document.querySelectorAll('.lyrics-div');

  show(elements, 'inline-block');
  document.getElementById('song-lyrics-box').scrollIntoView({
    behavior: 'smooth',
  });
};
