/* eslint-disable no-undef */
const songResult = async (songLink) => {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${songLink}`);
    const result = await response.json();
  
    const songResult = result.data;
  
    const uniqueSongResult = songResult.filter(onlyUnique);
  
    const theDiv = document.getElementById('song-results');
  
    theDiv.innerHTML = 'Searching.....';
  
    if (result.total > 0) {
      theDiv.innerHTML = '';
  
      for (const key in uniqueSongResult) {
        if (uniqueSongResult.hasOwnProperty.call(uniqueSongResult, key)) {
          const element = uniqueSongResult[key];
          // console.log(element);
          theDiv.innerHTML += `<li style="overflow: hidden;"><p style="float: left;"><img src=${element.album.cover_small} height="50px" width="50px" alt=""> ${element.title} ( ${element.artist.name} ) <audio controls>  <source src="${element.preview}" type="audio/mpeg"> Your browser does not support the audio element. </audio></p><p style="float: right;"><button class="btn" onclick ="songLyrics('${element.title}','${element.artist.name}')">Show Lyrics</button></p></li>`;
        }
      }
  
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
  
// eslint-disable-next-line no-undef
document.getElementById('search-form').addEventListener('click', (e) => {
  e.preventDefault();
  // eslint-disable-next-line no-undef
  const songName = document.getElementById('SongSearch').value;
  // console.log('songName', songName);
  if (songName) {
    const songLink = `https://api.lyrics.ovh/suggest/${songName}`;
    songResult(songLink);
  }
});

function show(elements, specifiedDisplay) {
  elements = elements.length ? elements : [elements];
  for (let index = 0; index < elements.length; index++) {
    elements[index].style.display = specifiedDisplay || 'block';
  }
}

const songLyrics = async (songTitle, songArtist) => {
  const response = await fetch(`https://api.lyrics.ovh/v1/${songArtist}/${songTitle}`);
  const result = await response.json();

  console.log('lyrics result', result.lyrics);

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
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

