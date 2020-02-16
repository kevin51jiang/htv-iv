import React, { Component } from 'react';
import './App.scss';
import SiriWave from 'siriwave';
import axios from 'axios';
// import Dropzone from 'react-dropzone';

const API_BASE = "http://localhost:3000/";

class Enter extends Component {
  state = {
    videoPath: '',
    youtubePath: '',
    youtubePathValid: false,
    valid: false,
    done: false
  };



  onFileChange = (e) => {
    // eslint-disable-next-line
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
    // eslint-disable-next-line
    const matches = e.target.value.match(/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/i);
    this.setState({
      youtubePath: matches !== null ? matches[1] : e.target.value,
      youtubePathValid: matches !== null,
    });
  };


  submit = (contentType) => {

    const data = new FormData();
    data.append("file", this.state.videoPath);

    axios({
      url: `${API_BASE}/upload`,
      method: 'POST',
      data: data,
      headers: {
        'Content-Type': contentType
      }
    }).catch((err) => {
      console.error("ERROR: " + err);
    })


    this.setState({ done: true }, () => {
      setTimeout(() => {
        this.props.onEnter(this.state.youtubePath);
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
          <button class="btn" disabled={this.state.valid}>upload a video file</button>
          <input className={"custom-file-input " + (this.state.valid ? 'valid' : '')} disabled={this.state.valid} type='file' placeholder="Choose a video to analyze!" onChange={this.onFileChange}></input>
        </div>

        <input className={(this.state.valid && this.state.youtubePathValid) ? 'valid' : ''} disabled={!this.state.valid} type="text" placeholder="Enter Youtube URL" value={this.state.youtubePath} onChange={this.onYoutubeChange}></input>

        <div className={this.state.youtubePathValid ? 'valid' : ''}>
          <button disabled={!this.state.youtubePathValid} onClick={() => this.submit('multipart/form-data')}>Submit</button>
        </div>

      </div>
    );
  }
}

class Video extends Component {
  state = {
    ready: false
  }

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
          <p>Analyzing... (this may take a while)</p>
        </div>}
        {/* <video controls ref={this.videoRef}>
          <source src={`${API_BASE}compare/?ref=${youtubePath}&compare=${id2}`} type="video/mp4" />
        </video> */}
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
