import React, { Component } from 'react';
import './App.scss';
import SiriWave from 'siriwave';
import axios from 'axios';
import {Router, Route, Link, RouteHandler} from 'react-router';
// import Dropzone from 'react-dropzone';

const API_BASE = "http://34.67.200.241:5000";
//http://34.67.200.241:5000/upload



class Enter extends Component {
  state = {
    youtubePath1: '',
    youtubePath2: '',
    valid: true,
    done: false
  };

  onYoutubeChange1 = (e) => {
    // eslint-disable-next-line
    const matches = e.target.value.match(/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/i);
    this.setState({
      youtubePath1: matches !== null ? matches[1] : e.target.value,
    }, () => {
      if (matches !== null) {
        this.setState({ valid: !this.state.valid });
        this.submitOne();
      }
    });
  };

  submitOne = () => {
    console.log("submit youtube1");
    axios({
      url: `${API_BASE}/youtube?v=${this.state.youtubePath1}`,
      method: 'GET',
      headers: {
        'Content-Type': 'none'
      }
    }).catch((err) => {
      console.error("ERROR: " + err);
    });
  }


  onYoutubeChange2 = (e) => {
    // eslint-disable-next-line
    const matches = e.target.value.match(/http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/i);
    this.setState({
      youtubePath2: matches !== null ? matches[1] : e.target.value,
    }, () => {
      if (matches !== null) {
        this.submitSecond();
      }
    });
  };

  submitSecond = () => {
    this.setState({ done: true }, () => {
      console.log("submit youtube 2");
      axios({
        url: `${API_BASE}/youtube?v=${this.state.youtubePath2}`,
        method: 'GET',
        headers: {
          'Content-Type': 'none'
        }
      }).then(res => {
        console.log(res)
        console.log("URL URL " + res.config.url);
        window.open( 
          res.config.url, "_blank"); 
        // this.setState(null, res.config.url);
        setTimeout(() => {
          this.props.onEnter(res.config.url);
        }, 1000);
      }).catch((err) => {
        console.error("ERROR: " + err);
      }).finally(() => {
        // setTimeout(() => {
        //   this.props.onEnter(this.state.youtubePath1);
        // }, 1000);
      })

      

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

        <input className={(this.state.valid) ? 'valid' : ''}
          disabled={!this.state.valid} type="text" placeholder="Enter Youtube URL 1"
          value={this.state.youtubePath1} onChange={this.onYoutubeChange1}></input>

        <input className={(this.state.valid) ? 'valid' : ''}
          disabled={this.state.valid} type="text" placeholder="Enter Youtube URL 2"
          value={this.state.youtubePath2} onChange={this.onYoutubeChange2}></input>

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


        <video controls ref={this.videoRef}>
          {/* http://34.67.200.241:5000/youtube?v=ZXD0S4OvjTM */}
          <source src={`${API_BASE}/youtube?v=${this.state.youtubePath2}`} type="video/mp4" />
        </video>
      </div>
    )
  }
}

class App extends Component {
  state = {
    video: null,
    lang: null,
    goneWave: false,
    playerState: null
  };

  wave = null;
  updateVideo = (video) => {
    this.setState({video});
  };

  componentDidMount() {
    this.wave = new SiriWave({
      container: document.getElementById('app'),
      width: window.innerWidth,
      height: window.innerHeight * 3,
      style: 'ios9',
      speed: 0.1
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
        {this.state.video !== null ? <div> <Video onReady={this.onReady} video={this.state.video} loop={true} playerState={this.state.playerState}  onEnded={() => { console.log('Ended Video') }} /> </div> : <Enter onEnter={this.updateVideo} />}
      </div>
    );
  }
}

export default App;
