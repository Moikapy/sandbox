import Head from 'next/head';
import { Component } from 'react';
import io from 'socket.io-client';
var siofu = require('socketio-file-upload');
import encryptData from '../components/encryptData';
import toDataURL from '../components/toDataURL';
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imglocation: null,
      result: '',
      cryptoResult: '',
    };
  }
  handleState = () => {};
  handleData = url => {
    let newState = state => {
      this.setState(state);
    };
    toDataURL(
      (url = 'https://media.giphy.com/media/eiXaV3hhhmIyDhujqY/giphy.gif'),
      function(dataURL) {
        // do something with dataURL
        let compressedUrl = encryptData(dataURL, 'secret-code');
        // document.getElementById('cryptoresult').innerHTML = compressedUrl;
        // document.getElementById('result').innerHTML = dataURL;
        const state = {
          imglocation: dataURL,
          result: dataURL,
          cryptoResult: compressedUrl,
        };
        newState(state);
      }
    );
  };

  componentDidMount() {
    const socket = io();
    const uploader = new siofu(socket);
    uploader.maxFileSize = '100KiB';
    uploader.listenOnInput(document.getElementById('uploadFile'));
    console.log(uploader);
    this.handleData();
    uploader.addEventListener('error', function(data) {
      if (data.code === 1) {
        alert("Don't upload such a big file");
      }
    });
  }
  render() {
    return (
      <div className="container">
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />

          <link
            rel="stylesheet"
            href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
            integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
            crossOrigin="anonymous"
          />
          <title>Sandbox</title>
        </Head>
        <style jsx>
          {`
            .container {
              width: 68.75rem;
              margin-left: 1.5625rem;
              margin-right: auto;
            }
            #result,
            #cryptoresult {
              width: 100%;
              white-space: -moz-pre-wrap !important; /* Mozilla, since 1999 */
              white-space: -pre-wrap; /* Opera 4-6 */
              white-space: -o-pre-wrap; /* Opera 7 */
              white-space: pre-wrap; /* css-3 */
              word-wrap: break-word; /* Internet Explorer 5.5+ */
              white-space: -webkit-pre-wrap; /* Newer versions of Chrome/Safari*/
              word-break: break-all;
              white-space: normal;
            }
          `}
        </style>
        <input
          id="uploadFile"
          className="form-control-file"
          type="file"
          onChange={e => {
            const data = e.target.value;
            this.handleData(data);
          }}
        />
        <br />
        <br />
        <div className="text-center mx-auto">
          <img src={`${this.state.imglocation}`} />
        </div>

        <div className="row">
          <div className="col-6">
            <h3 className="col">Result:</h3>
            <textarea
              className="form-control"
              name="result"
              rows="10"
              cols="60"
              readOnly
              value={this.state.result}></textarea>
          </div>

          <div className="col-6">
            <h3>Crypto Result:</h3>
            <textarea
              className="form-control"
              name="cryptoResult"
              rows="10"
              cols="60"
              readOnly
              value={this.state.cryptoResult}></textarea>
          </div>
        </div>
      </div>
    );
  }
}
