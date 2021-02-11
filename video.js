class Video {
  constructor(src, parent, type, autoplay, containerAttr) {
    this.videoNode = document.createElement("video");
    this.sourceNode = document.createElement("source");
    let container = document.createElement("div");
    this.sourceNode.setAttribute("src", src);
    this.sourceNode.setAttribute("type", type);
    this.videoNode.appendChild(this.sourceNode);
    container.className = "video__container";
    this.playIcon = `<img id="iconPlayer" src="./play-button-svgrepo-com.svg" />`;
    container.appendChild(this.videoNode);
    document.querySelector(parent).appendChild(container);

    for (let attr in containerAttr) {
      container.setAttribute(attr, containerAttr[attr]);
    }
    // STATE MANAGEMENT
    this.wasFirstPlay = false;
    this.wasFirstPause = false;
    this.wasVideoEnded = false;
    this.state = autoplay ? "play" : "pause";
    this.firstPoint = false;
  }
  setVodAttr = (videoAttr) => {
    for (let attr in videoAttr) {
      this.videoNode.setAttribute(attr, videoAttr[attr]);
    }
  };
  fallback(html) {
    this.videoNode.innerHTML += html;
  }
  onReady(cb) {
    this.videoNode.addEventListener("canplay", cb);
  }
  onPlay(callback) {
    this.state = "play";
    this.videoNode.addEventListener("play", callback);
  }
  onPause(callback) {
    this.state = "pause";
    this.videoNode.addEventListener("pause", callback);
  }
  addEventListenerToController() {
    document
      .querySelector("#playerTriggerId")
      .addEventListener("click", () => this.togglePlay());
  }
  onFirstPlay(callback, wasNotTheFirstTime) {
    this.videoNode.addEventListener("play", () => {
      if (!this.wasFirstPlay) {
        callback(new Date().getTime());
        this.wasFirstPlay = true;
      } else wasNotTheFirstTime();
    });
  }
  onFirstPause(callback, wasNotTheFirstTime) {
    this.videoNode.addEventListener("pause", () => {
      if (!this.wasFirstPause) {
        callback(new Date().getTime());
        this.wasFirstPause = true;
      } else wasNotTheFirstTime();
    });
  }
  onVideoEnded(callback) {
    this.videoNode.addEventListener("ended", (e) => {
      this.wasVideoEnded = true;
      callback();
    });
  }
  onUpdate(callback) {
    // at one seconde , invoke four times with event object + currentTime
    this.videoNode.addEventListener("timeupdate", (e) =>
      callback(e, Math.floor(this.videoNode.currentTime))
    );
  }
  muteVideo() {
    this.videoNode.muted();
  }
  jumpToTime(timeAsSeconde) {
    this.videoNode.currentTime = timeAsSeconde;
  }
  onPoint(secondeAsPoint, callback) {
    this.videoNode.addEventListener("timeupdate", () => {
      // console.log(secondeAsPoint, this.currentTime);
      if (secondeAsPoint === this.currentTime && !this.firstPoint) {
        this.firstPoint = true;
        callback(
          () => this.playVideo(),
          () => this.pauseVideo()
        );
      }
    });
  }
  changeVideoSource(newSrc, playAfterChangeToNewSrc) {
    return new Promise((resolve, reject) => {
      try {
        this.videoNode.setAttribute("src", newSrc);
        if (playAfterChangeToNewSrc) {
          this.playVideo();
        }
        resolve({ done: true });
      } catch (err) {
        reject(err);
      }
    });
  }
  updateCurrentTime() {
    this.videoNode.addEventListener("timeupdate", () => {
      this.currentTime = Number(this.videoNode.currentTime.toFixed(2));
    });
  }
  playVideo() {
    this.state = "play";
    this.videoNode.play();
    this.updateCurrentTime();
  }
  pauseVideo() {
    this.state = "pause";
    this.videoNode.pause();
    this.updateCurrentTime();
  }
  togglePlay() {
    if (this.state === "pause") this.playVideo();
    else this.pauseVideo();
  }
  getFullDuration() {
    return Number(this.videoNode.duration.toFixed(2));
  }
  onHalfDuration(callback) {
    // work on this
    this.onReady(() => {});
  }
}

export default Video;
