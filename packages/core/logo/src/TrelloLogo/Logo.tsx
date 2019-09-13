/* eslint-disable max-len */
import React, { Component } from 'react';
import { uid } from 'react-uid';

import { Props, DefaultProps } from '../constants';
import Wrapper from '../Wrapper';

const svg = (iconGradientStart: string, iconGradientStop: string) => {
  const id = uid({ iconGradientStart: iconGradientStop });
  return `<canvas width="93" height="32" aria-hidden="true"></canvas>
  <svg viewBox="0 0 93 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" focusable="false" aria-hidden="true">
    <title>logo/trello</title>
    <defs>
        <linearGradient x1="49.9916681%" y1="43.5833348%" x2="49.9916681%" y2="138.166647%" id="${id}">
            <stop stop-color="${iconGradientStart}" offset="0%"></stop>
            <stop stop-color="${iconGradientStop}" offset="75%"></stop>
        </linearGradient>
    </defs>
    <g stroke="none" stroke-width="1" fill-rule="nonzero">
        <path d="M20.7473754,7 L7.24962506,7 C6.00719145,7 5,8.00736109 5,9.2500015 L5,22.7499985 C5,23.9926389 6.00719145,25 7.24962506,25 L20.7473754,25 C21.3445326,25.0007943 21.9175044,24.7640931 22.3400399,24.34205 C22.7625754,23.9200069 23,23.3472556 23,22.7499985 L23,9.2500015 C23,8.65274439 22.7625754,8.0799931 22.3400399,7.65795 C21.9175044,7.2359069 21.3445326,6.99920566 20.7473754,7 Z M13,19.9636099 C12.991039,20.538339 12.4640253,21 11.8170399,21 L8.17968323,21 C7.52816217,21 7,20.5307788 7,19.9519651 L7,19.9519651 L7,10.0480349 C7,9.77007879 7.1242877,9.503507 7.34552122,9.30696233 C7.56675474,9.11041765 7.86681179,9 8.17968323,9 L11.8170399,9 C12.4690931,9 12.9981938,9.46875063 13,10.0480349 L13,19.9636099 Z M21,15.9032749 C21,16.1941445 20.8756444,16.4731008 20.65429,16.6787767 C20.4329356,16.8844525 20.1327145,17 19.8196721,17 L16.1803279,17 C15.5284508,17 15,16.5089795 15,15.9032749 L15,10.0967251 C15,9.80585549 15.1243556,9.52689918 15.34571,9.32122333 C15.5670644,9.11554749 15.8672855,9 16.1803279,9 L19.8196721,9 C20.1327145,9 20.4329356,9.11554749 20.65429,9.32122333 C20.8756444,9.52689918 21,9.80585549 21,10.0967251 L21,10.0967251 L21,15.9032749 Z" id="Shape" fill="url(#${id})" fill-rule="nonzero"></path>
        <path d="M85.9206534,10.7552632 C89.9147241,10.7552632 92.2052632,13.6024684 92.2052632,17.5214578 C92.2052632,21.4404472 89.8874918,24.35 85.9206534,24.35 C81.9538149,24.35 79.5815789,21.4404472 79.5815789,17.5214578 C79.5815789,13.6024684 81.9265826,10.7552632 85.9206534,10.7552632 Z M59.4487792,10.7552632 C63.4189365,10.7552632 65.0157895,13.5490276 65.0157895,17.5214578 L65.0157895,18.551677 L55.604612,18.551677 C55.9151926,20.7724377 57.3333152,22.2094005 60.3746609,22.2094005 C61.7122165,22.2085348 63.0392035,21.9693579 64.2950081,21.5027948 L64.2950081,23.5810468 C63.2372762,24.1421748 61.6140532,24.35 60.2984807,24.35 C55.4786218,24.35 53.3631579,21.5295152 53.3631579,17.5214578 C53.3631579,13.575748 55.5284319,10.7552632 59.4487792,10.7552632 Z M52.3921053,10.7706355 L52.3921053,13.0201648 C49.5275634,12.715763 47.7816133,13.6107043 47.7816133,16.4477291 L47.7816133,24.35 L45.5947368,24.35 L45.5947368,10.9563206 L47.7816133,10.9563206 L47.7816133,13.3154346 C48.5362189,11.7355892 49.8382833,10.6093025 52.3921053,10.7706355 Z M44.6236842,7.84210526 L44.6236842,10.0037514 L39.4663407,10.0037514 L39.4663407,24.35 L37.1573435,24.35 L37.1573435,10.0037514 L32,10.0037514 L32,7.84210526 L44.6236842,7.84210526 Z M77.0669132,5.9 L77.0669132,20.6946317 C77.0669132,21.8723138 77.8875211,22.2756699 78.8977391,22.2756699 C79.1260371,22.2795467 79.3543781,22.2706988 79.5815789,22.2491721 L79.5815789,24.2453433 C79.1903464,24.3235577 78.7907953,24.3581419 78.3910759,24.3483905 C76.1468377,24.3483905 74.7263158,23.3385281 74.7263158,20.9537218 L74.7263158,5.9 L77.0669132,5.9 Z M69.3049153,5.9 L69.3049153,20.6943155 C69.3049153,21.8719724 70.1234271,22.2753199 71.1310647,22.2753199 C71.3587802,22.2792513 71.5865415,22.2704034 71.8131579,22.2488227 L71.8131579,24.2449512 C71.4189345,24.3244417 71.0161394,24.359034 70.613294,24.3479962 C68.3778887,24.3479962 66.9578947,23.3381553 66.9578947,20.9534 L66.9578947,5.9 L69.3049153,5.9 Z M85.9206534,12.8453909 C83.0854683,12.8453909 81.8206792,15.0364622 81.8206792,17.5214578 C81.8206792,20.0034844 83.0703392,22.2479966 85.9206534,22.2479966 C88.7709675,22.2479966 89.9661629,20.0034844 89.9661629,17.5214578 C89.9661629,15.0394312 88.7558384,12.8453909 85.9206534,12.8453909 Z M59.343299,12.8157015 C56.9992946,12.8038258 55.8126424,14.3447012 55.581172,16.6189027 L55.581172,16.6307784 L62.7743353,16.6307784 C62.6454151,14.1992236 61.5613131,12.8157015 59.343299,12.8157015 Z" id="Combined-Shape" fill="inherit" fill-rule="nonzero"></path>
    </g>
</svg>`;
};

export default class TrelloLogo extends Component<Props> {
  static defaultProps = DefaultProps;

  render() {
    return <Wrapper {...this.props} svg={svg} />;
  }
}
