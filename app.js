const soundsElement = document.querySelector('#sounds');
const stopButton = document.querySelector('#stopButton');
const players = [];

//these keycodes refers to certain keys in keyboard
let keyCodes = [81, 87, 69, 82, 65, 83, 68, 70, 90, 88, 67, 86];

//this will stop any sounds playing
stopButton.addEventListener('click', stopAll);

(async () => {
  //fetching the json containing the title and source name of the sounds
  const sounds = await getSounds();
  addSoundsToPage(sounds);
})();

async function getSounds() {
  const response = await fetch('./sounds.json');
  const json = await response.json();
  return json;
}

function addSoundsToPage(sounds) {
  sounds.forEach(addSoundToPage);

  //it will listen to the keys presses , which will be use to
  //play the tracks
  listenKeyPress();
}


function addSoundToPage(sound, index) {
  //this will create a div which will contain the audio element, 
  //which will play the particular track respective to this div
  const soundDiv = document.createElement('div');
  soundDiv.className = 'sound';
  const soundTitle = document.createElement('h2');
  soundTitle.textContent = sound.title;
  soundDiv.appendChild(soundTitle);

  const key = document.createElement('img');
  key.setAttribute('src', `keys/${keyCodes[index]}.png`)
  soundDiv.appendChild(key);

  const player = document.createElement('audio');
  player.setAttribute('src', `sounds/${sound.src}`)
  soundDiv.appendChild(player);
  players.push({ player, soundDiv, key });

  soundDiv.addEventListener('mousedown', () => {
    soundPress(soundDiv, player);
  });

  soundDiv.addEventListener('mouseup', () => {
    soundDiv.style.background = '';
  });

  soundsElement.appendChild(soundDiv);
}

function soundPress(div, player) {
  div.style.background = '#0941a1';
  player.currentTime = 0;
  player.play();
}

function listenKeyPress() {
  document.addEventListener('keydown', (event) => {
    console.log(event);

    //this keycode 32 is for spacebar
    if (event.keyCode == 32) {
      //scale the img vertically(which is actually stop button)
      //for a custom button pressing effect
      stopButtonImg = stopButton.querySelector(".sound img");
      stopButtonImg.style.transform = 'scaleY(0.75)';

      //stop all the playing tracks
      return stopAll();
    }
    const playerIndex = keyCodes.indexOf(event.keyCode);
    const playerAndDiv = players[playerIndex];

    
    if (playerAndDiv) { 
      playerAndDiv.key.style.transform = 'scaleY(0.75)';
      soundPress(playerAndDiv.soundDiv, playerAndDiv.player);
    }
  });

  document.addEventListener('keyup', (event) => {

    if (event.keyCode == 32) {
      //scale the img vertically(which is actually stop button)
      //for a custom button pressing effect
      stopButtonImg = stopButton.querySelector(".sound img");
      stopButtonImg.style.transform = '';
    }

    const playerIndex = keyCodes.indexOf(event.keyCode);
    const playerAndDiv = players[playerIndex];
    if (playerAndDiv) {
      playerAndDiv.soundDiv.style.background = '';      
      playerAndDiv.key.style.transform = '';
    }
  });
}

function stopAll() {
  players.forEach(({player}) => {
    player.pause();
  });
}
