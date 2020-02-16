import React, { Component } from 'react';
import './App.scss';
import SiriWave from 'siriwave';
// import Dropzone from 'react-dropzone';

const languages = [
  ['Test1', 'en'],
  ['Spanish', 'es'],
  ['French', 'fr'],
  ['Korean', 'ko']
]



class Enter extends Component {
  state = {
    videoPath: '',
    youtubePath: '',
    // text: '',
    valid: false,
    done: false
  };



  onFileChange = (e) => {
    if (e.target.value.split('.').pop().toUpperCase() == "MP4") {
      const matches = e.target.value;
      this.setState({
        videoPath: matches,
        valid: e.target.value !== null,
      });
    } else {
      e.target.value = '';
      alert("Please upload a valid .mp4");
    }
  };

  onYoutubeChange = (e) => {
    const matches = e.target.value.match(/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/i);
    this.setState({
      youtubePath: matches !== null ? matches[1] : e.target.value,
      // valid: matches !== null,
    });
  };


  submit = (value) => {
    this.setState({ done: true }, () => {
      setTimeout(() => {
        this.props.onEnter(this.state.text, value);
      }, 1000);
    });
  }


  componentDidMount() {
    if (window.location.hash.length > 1) {
      this.onChange({ target: { value: window.location.hash.replace('#', '') } });
    }
  }
  render() {
    return (
      <div className={"enter" + (this.state.done ? ' done' : '')} id="enter-area">
        <div class="fileContainer">
          <h1>upload a video file</h1>
          <input className={"custom-file-input " + (this.state.valid ? 'valid' : '')} type='file' placeholder="Choose a video to analyze!" onChange={this.onFileChange}></input>
        </div>

        <input className={this.state.valid ? 'valid' : ''} disabled={!this.state.valid} type="text" placeholder="Enter Youtube URL" value={this.state.youtubePath} onChange={this.onYoutubeChange}></input>

        <div className={this.state.valid ? 'valid' : ''}>
          <button disabled={!this.state.valid} onClick={() => console.log("yeehaw")}>Submit</button>
        </div>
      </div>
    );
  }
}

class Video extends Component {
  state = {
    ready: false
  };


  videoRef = React.createRef();
  componentDidMount() {
    this.videoRef.current.addEventListener('canplay', () => {
      this.setState({ ready: true });
      this.props.onReady();
    });
  }


  render() {
    return (
      <div className={"video-container" + (this.state.ready ? ' ready' : '')}>
        {this.state.ready ? null : <div className="loader">
          <div className="spinner"></div>
          <p>Converting... (this may take a while)</p>
        </div>}
        <video controls ref={this.videoRef}>
          <source src={"http://visualyze.tech/download?id=" + this.props.video + "&lang=" + this.props.lang} type="video/mp4" />
        </video>
      </div>
    )
  }


}

class App extends Component {
  state = {
    video: null,
    lang: null,
    goneWave: false
  };

  wave = null;
  updateVideo = (video, lang) => {
    this.setState({ video, lang });
  };

  componentDidMount() {
    this.wave = new SiriWave({
      container: document.getElementById('app'),
      width: window.innerWidth,
      height: window.innerHeight * 2,
      style: 'ios9',
      speed: 0.09
    });
    this.wave.start();
  }

  onReady = () => {
    this.setState({ goneWave: true });
    setTimeout(() => {
      this.wave.stop();
    }, 5000);
  }


  componentWillUnmount() {
    this.wave.stop();
  }


  render() {
    return (
      <div id="app" className={this.state.goneWave ? 'goneWave' : ''}>
        {this.state.video !== null ? <Video onReady={this.onReady} video={this.state.video} lang={this.state.lang} /> : <Enter onEnter={this.updateVideo} />}
      </div>
    );
  }
}

export default App;
