import { Component } from 'react';
import encryptData from '../components/encryptData';
import toDataURL from '../components/toDataURL';
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imglocation: null,
    };
  }
  handleState = () => {};
  handleData = () => {
    let newState = state => {
      this.setState(
        { imglocation: state },
        console.log(this.state.imglocation)
      );
    };
    toDataURL(
      'https://media.giphy.com/media/eiXaV3hhhmIyDhujqY/giphy.gif',
      function(dataURL) {
        // do something with dataURL
        let compressedUrl = encryptData(dataURL, 'secret-code');
        document.getElementById('cryptoresult').innerHTML = compressedUrl;
        document.getElementById('result').innerHTML = dataURL;
        newState(dataURL);
      }
    );
  };

  componentDidMount() {
    this.handleData();
  }
  render() {
    return (
      <div className="container">
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
          type="file"
          onChange={e => {
            this.setState({ imglocation: e.target.value });
            toDataURL(e.target.value, function(dataURL) {
              // do something with dataURL
              let compressedUrl = encryptData(dataURL, 'secret-code');
              document.getElementById('cryptoresult').innerHTML = compressedUrl;
              document.getElementById('result').innerHTML = dataURL;
            });
          }}
        />
        <br />
        <br />
        <h3>
          Result:
          <img src={`${this.state.imglocation}`} />
          <p id="result"></p>
        </h3>
        <br />
        <h3>
          Crypto Result: <p id="cryptoresult">Encrpyted Result: </p>
        </h3>
      </div>
    );
  }
}
