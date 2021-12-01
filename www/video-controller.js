 /**
  * 
  *  1. add script just after client.js in html file
  *     <script type="text/javascript" src="video-controller.js"></script>
  * 
  * Add ui to html 
  * 
  *             <div id="video-clip-controls">
                <label for="clip-url-input" class="form-text">Enter a video URL</label>
                <input id="clip-url-input"
                    value="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                    class="form-control" aria-describedby="clipURLHelp" />
                <div class="btn-group-sm p-3">
                    <button type="button" class="btn btn-success" id="start-clip-btn" disabled> Begin</button>
                    <button type="button" class="btn btn-success" id="play-clip-btn" disabled> Play </button>
                    <button type="button" class="btn btn-success" id="pause-clip-btn" disabled> Pause </button>
                    <button type="button" class="btn btn-success" id="stop-clip-btn" disabled> End</button>
                </div>
            </div>
  * 
  * 
  * 
  * 
  */
 
 // clip video Controller controls

 const clipURLInput = document.getElementById('clip-url-input');
 const startClipBtn = document.getElementById('start-clip-btn');
 const playClipBtn = document.getElementById('play-clip-btn');
 const pauseClipBtn = document.getElementById('pause-clip-btn');
 const stopClipBtn = document.getElementById('stop-clip-btn');
 
 let timestamp = 0;



 //  start video presentation with a url
 startClipBtn.onclick = () => {
   videoURL = clipURLInput.value;
   VoxeetSDK.videoPresentation.start(videoURL)
     .then(() => {
       console.log("video started")
     })
     .catch((error) => {
       console.log(error);
     })
 }

 //play
 playClipBtn.onclick = () => {
   VoxeetSDK.videoPresentation.play()
     .then(() => {
       console.log("video play")
     })
     .catch((error) => {
       console.log(error);
     })
 }
 // pause
 pauseClipBtn.onclick = () => {
   
   VoxeetSDK.videoPresentation.pause()
     .then(() => {
       console.log("video pause")
     })
     .catch((error) => {
       console.log(error);
     })
 }
 // stop 
 stopClipBtn.onclick = () => {
   VoxeetSDK.videoPresentation.stop()
     .then(() => {
       console.log("video Stop")
     })
     .catch((error) => {
       console.log(error);
     })

 }

 // Video Presentation listeners
 VoxeetSDK.videoPresentation.on("started", (participant, stream) => {
   console.log("started", participant, stream)
   addClipNode(participant, stream)
   
    //CaptionSync Init
   let videoNode = document.getElementById('video-clip');
   const captionsync = new CaptionSync(videoNode, showCallback, hideCallback);

   //Testing Command Service
   VoxeetSDK.command
      .send({payload:'Im a poop'})
      .catch((err) => {
        console.error(err);
      })

   startClipBtn.disabled = true;
   playClipBtn.disabled = true;
   pauseClipBtn.disabled = false;
   stopClipBtn.disabled = false;
 });

 VoxeetSDK.videoPresentation.on("paused", (participant, stream) => {
   console.log("paused", participant, stream)
   let videoNode = document.getElementById('video-clip');
   timestamp = Math.round(videoNode.currentTime * 1000);
   // videoNode.currentTime = timestamp;
   videoNode.pause()
   
   startClipBtn.disabled = true;
   playClipBtn.disabled = false;
   pauseClipBtn.disabled = true;
   stopClipBtn.disabled = false;
 });

 VoxeetSDK.videoPresentation.on("sought", (participant, stream) => {

   let videoNode = document.getElementById('video-clip');
   timestamp = Math.round(videoNode.currentTime * 1000);
   // videoNode.currentTime = timestamp;
   console.log("seek", participant, stream)
 });

 VoxeetSDK.videoPresentation.on("played", (participant, stream) => {
   console.log("play", participant, stream)
   let videoNode = document.getElementById('video-clip');
   videoNode.play()
   videoNode.muted = false;
   startClipBtn.disabled = true;
   playClipBtn.disabled = true;
   pauseClipBtn.disabled = false;
   stopClipBtn.disabled = false;
 });

 VoxeetSDK.videoPresentation.on("stopped", (participant, stream) => {
   console.log("stopped", participant, stream);
   let videoNode = document.getElementById('video-clip');
   videoNode.pause()
   resetRemoveVideo()
 });

 var resetRemoveVideo = () => {
   let videoNode = document.getElementById('video-clip');
   if (videoNode) {
     videoNode.pause()
     removeClipNode()
   }
   startClipBtn.disabled = false;
   playClipBtn.disabled = true;
   pauseClipBtn.disabled = true;
   stopClipBtn.disabled = true;
 }
 // Add a Clip stream to the web page
 const addClipNode = (participant, stream) => {

   let videoNode = document.getElementById('video-clip');

   if (!videoNode) {
    let track = document.createElement("track");
       track.kind = "captions";
       track.label = "English";
       track.srclang = "en"
       track.src = "./assets/test-video.vtt";
       track.addEventListener("load", () => {
        this.mode = "showing";
        videoNode.textTrack[0].mode = "showing";
       });

     videoNode = document.createElement('video');
     videoNode.setAttribute('class', 'clip-item'); // style lager
     videoNode.setAttribute('id', 'video-clip');
     videoNode.setAttribute('height', 480);
     videoNode.setAttribute('width', 640);
     videoNode.setAttribute("playsinline", true);
     videoNode.muted = false;
     videoNode.setAttribute("autoplay", 'autoplay');
     videoNode.setAttribute("src", participant.url);;
        
     const videoContainer = document.getElementById('video-container');
     videoContainer.prepend(videoNode)
     videoNode.prepend(track)
   }
   navigator.attachMediaStream(videoNode, stream);
   playClipBtn.disabled = false;
 };
 // Remove the Clip stream from the web page
 const removeClipNode = () => {
   let clipNode = document.getElementById('video-clip');
   if (clipNode) {
     clipNode.parentNode.removeChild(clipNode);
   }
 };

/** VideoShake
 * @param {DOMString} [element='video']
 */
 function videoShake(elements='video') {
  const els = document.querySelectorAll(elements);

  const keyframes = [
      {
          transform: "rotate(0deg)"
      },
      {
          transform: "rotate(2deg)",
          offset: 0.25
      },
      {
          transform: "rotate(0deg)",
          offset: 0.5
      },
      {
          transform: "rotate(-2deg)",
          offset: 0.75
      },
      {
          transform: "rotate(0deg)",
          offset: 1
      },
  ]
  const timing = {
      duration: 75,
      iterations: 2
  }
  for (let i = 0, len = els.length; i < len; i++) {
      els[i].animate(keyframes, timing)
  }
}

//PIEZ
const ERROR_NO_NAV_VIBRATE = 'No vibration API present';

let _vibrateInterval;
let vibrating = false;

/**
 * Starts vibration at passed in level
 * @param {Number} duration milliseconds
 */
function _repeatVibrate(duration = 0) {
	window.navigator.vibrate(duration);
}

/**
 * Clear interval and stop persistent vibrating
 * @param {Boolean} [verbose=false]
 */
function stopVibrate(verbose = false) {
	if (verbose && !window.navigator.vibrate) {
		throw new Error(ERROR_NO_NAV_VIBRATE);
	}

	if (_vibrateInterval) {
		clearInterval(_vibrateInterval);
	}

	window.navigator.vibrate(0);
	vibrating = false;
}

/**
 * Getter
 * @returns {Boolean}
 */
function isVibrating() {
	return vibrating;
}

/**
 * @param {Number} [duration=2] milliseconds
 * @param {Number} [interval=1] milliseconds
 * @param {Boolean} [verbose=false]
 */
function toggleVibrate(duration = 2, interval = 1, verbose = false) {
	if (vibrating) {
		stopVibrate();
	} else {
		startVibrate(duration, interval, verbose);
	}
}

/**
     * Start persistent vibration at given duration and interval
     * @param {Number} [duration=2] milliseconds
     * @param {Number} [interval=1] milliseconds
     * @param {Boolean} [verbose=false]
     */
function startVibrate(duration = 10000, interval = 10000, verbose = false) {
	if (verbose && !window.navigator.vibrate) {
		throw new Error(ERROR_NO_NAV_VIBRATE);
	}

	_repeatVibrate(duration);
	_vibrateInterval = setInterval(() => {
		_repeatVibrate(duration);
	}, interval);
	vibrating = true;
}

class CaptionSync {
  /**
   * Listener for closed captions video events
   * @constructor
   * @param {String} vidId 
   * @param {Function} showCallback callback when cue is shown
   * @param {Function} hideCallback callback when cue is hidden
   */
  constructor(vidEl, showCallback, hideCallback) {
      this.vidEl = vidEl
      const tracksList = vidEl.getElementsByTagName('track')
      this.showCallback = showCallback
      this.hideCallback = hideCallback
      this._toggle = false
      for (let elRef = 0, len = tracksList.length; elRef < len; elRef++) {
          const el = tracksList[elRef]
          el.addEventListener('cuechange', this.handleCuechange)
      }
  
  }

  handleCuechange(evt) {
      this._toggle = evt.target.track.activeCues.length
      if (this._toggle) {
          this.showCallback()
      } else {
          this.hideCallback()
      }
  }
  close() {
      const tracksList = vidEl.getElementsByTagName('track')
      for (let elRef = 0, len = tracksList.length; elRef < len; elRef++) {
          const el = tracksList[elRef]
          el.addEventListener('cuechange', handleCuechange)
      }
  }
}


showCallback = () => {
  console.log('CaptionSync Show Callback Initiated')
  videoShake()
  startVibrate()
}


hideCallback = () => {
  console.log('CaptionSync Hide Callback')
  stopVibrate()
}