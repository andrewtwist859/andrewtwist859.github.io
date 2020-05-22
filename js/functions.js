
Amplitude.init({
  "songs": [
    {
      "name": "Question 1",
      "artist": "Virtual Pub Quiz",
      "album": "The Lockdown Arms",
      "url": "media/Question1.mp3",
      "cover_art_url": "artwork/album.png"
    },
    {
      "name": "Question 2",
      "artist": "Virtual Pub Quiz",
      "album": "The Lockdown Arms",
      "url": "media/Question2.mp3",
      "cover_art_url": "artwork/album.png"
    },
    {
      "name": "Question 3",
      "artist": "Virtual Pub Quiz",
      "album": "The Lockdown Arms",
      "url": "media/Question3.mp3",
      "cover_art_url": "artwork/album.png"
    },
    {
      "name": "Question 4",
      "artist": "Virtual Pub Quiz",
      "album": "The Lockdown Arms",
      "url": "media/Question4.mp3",
      "cover_art_url": "artwork/album.png"
    },
    {
      "name": "Question 5",
      "artist": "Virtual Pub Quiz",
      "album": "The Lockdown Arms",
      "url": "media/Question5.mp3",
      "cover_art_url": "artwork/album.png"
    },
    {
      "name": "Question 6",
      "artist": "Virtual Pub Quiz",
      "album": "The Lockdown Arms",
      "url": "media/Question6.mp3",
      "cover_art_url": "artwork/album.png"
    },
    {
      "name": "Question 7",
      "artist": "Virtual Pub Quiz",
      "album": "The Lockdown Arms",
      "url": "media/Question7.mp3",
      "cover_art_url": "artwork/album.png"
    },
    {
      "name": "Question 8",
      "artist": "Virtual Pub Quiz",
      "album": "The Lockdown Arms",
      "url": "media/Question8.mp3",
      "cover_art_url": "artwork/album.png"
    },
    {
      "name": "Question 9",
      "artist": "Virtual Pub Quiz",
      "album": "The Lockdown Arms",
      "url": "media/Question9.mp3",
      "cover_art_url": "artwork/album.png"
    }, 
    {
      "name": "Question 10",
      "artist": "Virtual Pub Quiz",
      "album": "The Lockdown Arms",
      "url": "media/Question10.mp3",
      "cover_art_url": "artwork/album.png"
    },
    {
      "name": "Question 11",
      "artist": "Virtual Pub Quiz",
      "album": "The Lockdown Arms",
      "url": "media/Question11.mp3",
      "cover_art_url": "artwork/album.png"
    },
    {
      "name": "Question 12",
      "artist": "Virtual Pub Quiz",
      "album": "The Lockdown Arms",
      "url": "media/Question12.mp3",
      "cover_art_url": "artwork/album.png"
    }
  ],
  "continue_next": false
});




/*
  Shows the playlist
*/
document.getElementsByClassName('show-playlist')[0].addEventListener('click', function(){
  document.getElementById('white-player-playlist-container').classList.remove('slide-out-top');
  document.getElementById('white-player-playlist-container').classList.add('slide-in-top');
  document.getElementById('white-player-playlist-container').style.display = "block";
});

/*
  Hides the playlist
*/
document.getElementsByClassName('close-playlist')[0].addEventListener('click', function(){
  document.getElementById('white-player-playlist-container').classList.remove('slide-in-top');
  document.getElementById('white-player-playlist-container').classList.add('slide-out-top');
  document.getElementById('white-player-playlist-container').style.display = "none";
});

/*
  Gets all of the add to playlist buttons so we can
  add some event listeners to actually add to playlist.
*/
var addToPlaylistButtons = document.getElementsByClassName('add-to-playlist-button');

for( var i = 0; i < addToPlaylistButtons.length; i++ ){
  /*
    Add an event listener to the add to playlist button.
  */
  addToPlaylistButtons[i].addEventListener('click', function(){
    var songToAddIndex = this.getAttribute('song-to-add');

    /*
      Adds the song to Amplitude, appends the song to the display,
      then rebinds all of the AmplitudeJS elements.
    */
    var newIndex = Amplitude.addSong( songsToAdd[ songToAddIndex ] );
    appendToSongDisplay( songsToAdd[ songToAddIndex ], newIndex );
    Amplitude.bindNewElements();

    /*
      Removes the container that contained the add to playlist button.
    */
    var songToAddRemove = document.querySelector('.song-to-add[song-to-add="'+songToAddIndex+'"]');
    songToAddRemove.parentNode.removeChild( songToAddRemove );
  });
}

/*
  Appends the song to the display.
*/
function appendToSongDisplay( song, index ){
  /*
    Grabs the playlist element we will be appending to.
  */
  var playlistElement = document.querySelector('.white-player-playlist');

  /*
    Creates the playlist song element
  */
  var playlistSong = document.createElement('div');
  playlistSong.setAttribute('class', 'white-player-playlist-song amplitude-song-container amplitude-play-pause');
  playlistSong.setAttribute('data-amplitude-song-index', index);

  /*
    Creates the playlist song image element
  */
  var playlistSongImg = document.createElement('img');
  playlistSongImg.setAttribute('src', song.cover_art_url);

  /*
    Creates the playlist song meta element
  */
  var playlistSongMeta = document.createElement('div');
  playlistSongMeta.setAttribute('class', 'playlist-song-meta');

  /*
    Creates the playlist song name element
  */
  var playlistSongName = document.createElement('span');
  playlistSongName.setAttribute('class', 'playlist-song-name');
  playlistSongName.innerHTML = song.name;

  /*
    Creates the playlist song artist album element
  */
  var playlistSongArtistAlbum = document.createElement('span');
  playlistSongArtistAlbum.setAttribute('class', 'playlist-song-artist');
  playlistSongArtistAlbum.innerHTML = song.artist+' &bull; '+song.album;

  /*
    Appends the name and artist album to the playlist song meta.
  */
  playlistSongMeta.appendChild( playlistSongName );
  playlistSongMeta.appendChild( playlistSongArtistAlbum );

  /*
    Appends the song image and meta to the song element
  */
  playlistSong.appendChild( playlistSongImg );
  playlistSong.appendChild( playlistSongMeta );

  /*
    Appends the song element to the playlist
  */
  playlistElement.appendChild( playlistSong );
}
