// Init SpeechSynth API
const synth = window.speechSynthesis;

// DOM Elements
const textForm = document.querySelector('form');
const textField = document.querySelector('#text-input');
const voiceOptions = document.querySelector('#voice-select');
const speed = document.querySelector('#rate');
const speedValue = document.querySelector('#rate-value');
const tone = document.querySelector('#pitch');
const toneValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

// const textForm = $('form');
// const textField = $('#text-input');
// const voiceOptions = $('#voice-select');
// const speed = $('#rate');
// const speedValue = $('#rate-value');
// const tone = $('#pitch');
// const toneValue = $('#pitch-value');
// const body = $('body');

//Browser identifier
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

// Init voices array
let voices = [];

const getVoices = () => {
  voices = synth.getVoices();

  // Loop through voices and create an option for each one
  voices.forEach(voice => {
    // Create option element
    const option = document.createElement('option');
    // Fill option with voice and language
    option.textContent = voice.name + '(' + voice.lang + ')';

    // Set needed option attributes
    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);
    voiceOptions.appendChild(option);
  });
};

//Line 35, 36 causes voice list duplication
/*getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}*/

//Fix for duplication, run code depending on the browser
if (isFirefox) {
    getVoices();
}
if (isChrome) {
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = getVoices;
    }
}

// Speak
const speak = () => {
  // Check if speaking
  if (synth.speaking) {
    console.error('Already speaking...');
    return;
  }
  if (textField.value !== '') {
    // Add background animation
    body.style.background = '#06a2f5 url(images/wav.gif)';
    body.style.backgroundRepeat = 'repeat-x';
    body.style.backgroundSize = '100% 100%';
    
    // Get speak text
    const speakText = new SpeechSynthesisUtterance(textField.value);

    // Speak end
    speakText.onend = e => {
      console.log('Done speaking...');
      body.style.background = '#06a2f5';
    };

    // Speak error
    speakText.onerror = e => {
      console.error('Something went wrong');
    };

    // Selected voice
    const selectedVoice = voiceOptions.selectedOptions[0].getAttribute(
      'data-name'
    );

    // Loop through voices
    voices.forEach(voice => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    // Set tone and speed
    speakText.rate = speed.value;
    speakText.pitch = tone.value;
    // Speak
    synth.speak(speakText);
  }
};

// EVENT LISTENERS

// Text form submit
textForm.addEventListener('submit', e => {
  e.preventDefault();
  speak();
  textField.blur();
});

// speed value change
speed.addEventListener('change', e => (speedValue.textContent = speed.value));

// tone value change
tone.addEventListener('change', e => (toneValue.textContent = tone.value));

// Voice select change
voiceOptions.addEventListener('change', e => speak());