import { useRef } from 'react';
const useMeeting = () => {
    // document.addEventListener('DOMContentLoaded', init);

async function init () {
      console.log('DOMContentLoaded');
  //GET CAMERA AND AUDIO
  try {
    const enumerateDevices = await navigator.mediaDevices.enumerateDevices();
    gotSources(enumerateDevices);
  } catch (e) {
    console.log(e);
  }

  //GET ELEMENTS - CALLER
  const getMediaButton = document.querySelector('button#getMedia');
  const createPeerConnectionButton = document.querySelector('button#createPeerConnection');
  const createOfferButton = document.querySelector('button#createOffer');
  const setOfferButton = document.querySelector('button#setOffer');

  //GET ELEMENTS - CALLEE    -- AFTER OFFER HAS BEEN SENT (FROM SET OFFER?)
  const createAnswerButton = document.querySelector('button#createAnswer');
  const setAnswerButton = document.querySelector('button#setAnswer');
  const hangupButton = document.querySelector('button#hangup');
  let dataChannelDataReceived;

  //ADD BUTTON EVENTS - CALLER
  getMediaButton.onclick = getMedia;
  createPeerConnectionButton.onclick = createPeerConnection;
  createOfferButton.onclick = createOffer;
  setOfferButton.onclick = setOffer;
  //ADD BUTTON EVENTS- CALLEE
  createAnswerButton.onclick = createAnswer;
  setAnswerButton.onclick = setAnswer;
  hangupButton.onclick = hangup;

  //SHOW OFFER AND ACCEPTANCE KEY
  const offerSdpTextarea = document.querySelector('div#local textarea');
  const answerSdpTextarea = document.querySelector('div#remote textarea');

  //ADD SELECT OPTION CHANGE EVENT - TO SELECT CAMERA OR AUDIO INPUT
  const audioSelect = document.querySelector('select#audioSrc');
  const videoSelect = document.querySelector('select#videoSrc');
  audioSelect.onchange = videoSelect.onchange = getMedia;

  //VIDEO ELEMENTS
  const localVideo = document.querySelector('div#local video');
  const remoteVideo = document.querySelector('div#remote video');

  

  let localPeerConnection;
  let remotePeerConnection;
  let localStream;
  let sendChannel;
  let receiveChannel;
  const dataChannelOptions = {ordered: true};
  let dataChannelCounter = 0;
  let sendDataLoop;
  const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
  };

    function gotSources(sourceInfos) {
        const selectSourceDiv = document.querySelector('div#selectSource');
        let audioSelect = document.querySelector('select#audioSrc');
        let videoSelect = document.querySelector('select#videoSrc');
        selectSourceDiv.classList.remove('hidden');
        let audioCount = 0;
        let videoCount = 0;
        for (let i = 0; i < sourceInfos.length; i++) {
          const option = document.createElement('option');
          option.value = sourceInfos[i].deviceId;
          option.text = sourceInfos[i].label;
          if (sourceInfos[i].kind === 'audioinput') {
            audioCount++;
            if (option.text === '') {
              option.text = `Audio ${audioCount}`;
            }
            audioSelect.appendChild(option);
          } else if (sourceInfos[i].kind === 'videoinput') {
            videoCount++;
            if (option.text === '') {
              option.text = `Video ${videoCount}`;
            }
            videoSelect.appendChild(option);
          } else {
            console.log('unknown', JSON.stringify(sourceInfos[i]));
          }
        }
    }

    async function getMedia() {
    getMediaButton.disabled = true;

    if (localStream) {
      localVideo.srcObject = null;
      localStream.getTracks().forEach(track => track.stop());
    }
    const audioSource = audioSelect.value;
    console.log(`Selected audio source: ${audioSource}`);
    const videoSource = videoSelect.value;
    console.log(`Selected video source: ${videoSource}`);

    const constraints = {
      audio: {
        optional: [{
          sourceId: audioSource
        }]
      },
      video: {
        optional: [{
          sourceId: videoSource
        }]
      }
    };
    console.log('Requested local stream');
    try {
      const userMedia = await navigator.mediaDevices.getUserMedia(constraints);
      gotStream(userMedia);
    } catch (e) {
      console.log('navigator.getUserMedia error: ', e);
    }
  }
    function gotStream(stream) {
    console.log('Received local stream');
    localVideo.srcObject = stream;
    localStream = stream;
    createPeerConnectionButton.disabled = false;
  }
    //MOST LIKELY TO BE CALLER --**
    function createPeerConnection() {

    //CALLER CREATE PEER CONNECTION
    createPeerConnectionButton.disabled = true;
    createOfferButton.disabled = false;
    console.log('Starting call');
    const videoTracks = localStream.getVideoTracks();
    const audioTracks = localStream.getAudioTracks();

    if (videoTracks.length > 0) {
      console.log(`Using video device: ${videoTracks[0].label}`);
    }

    if (audioTracks.length > 0) {
      console.log(`Using audio device: ${audioTracks[0].label}`);
    }
    const servers = null;

    window.localPeerConnection = localPeerConnection = new RTCPeerConnection(servers);
    console.log('Created local peer connection object localPeerConnection');
    localPeerConnection.onicecandidate = e => onIceCandidate(localPeerConnection, e);
    sendChannel = localPeerConnection.createDataChannel('sendDataChannel', dataChannelOptions);
    sendChannel.onopen = onSendChannelStateChange;
    sendChannel.onclose = onSendChannelStateChange;
    sendChannel.onerror = onSendChannelStateChange;

    //CALLEE PEER CONNECTION *** TODO
    window.remotePeerConnection = remotePeerConnection = new RTCPeerConnection(servers);
    console.log('Created remote peer connection object remotePeerConnection');
    remotePeerConnection.onicecandidate = e => onIceCandidate(remotePeerConnection, e);
    remotePeerConnection.ontrack = gotRemoteStream;
    remotePeerConnection.ondatachannel = receiveChannelCallback;

    //ADD LOCAL VIDEO STREAM
    localStream.getTracks()
        .forEach(track => localPeerConnection.addTrack(track, localStream));
    console.log('Adding Local Stream to peer connection');
  }


    function onSetSessionDescriptionSuccess() {
    console.log('Set session description success.');
  }

  function onSetSessionDescriptionError(error) {
    console.log(`Failed to set session description: ${error.toString()}`);
  }

    //CALLER CREATE OFFER OF CONNECTION
    async function createOffer() {
      console.log('create offer - offerOptions',offerOptions)
    try {
      const offer = await localPeerConnection.createOffer(offerOptions);
      //CALLER CREATE OFFER OF CONNECTION
      gotDescription1(offer);
      //SET LOCAL OFFER DESCRIPTION
    } catch (e) {
      onCreateSessionDescriptionError(e);
    }
  }

  function onCreateSessionDescriptionError(error) {
    console.log(`Failed to create session description: ${error.toString()}`);
  }

    //AFTER CREATION - SET THE OFFER KEY FOR LOCAL AND EXPECTED REMOTE STREAM 

    //create offer and description for local and peer connection expected
    async function setOffer() {
    // Restore the SDP from the textarea. Ensure we use CRLF which is what is generated
    // even though https://tools.ietf.org/html/rfc4566#section-5 requires
    // parsers to handle both LF and CRLF.

    // TODO - VALUE TO BE PASSED FROM CALLER TO CALLEE ***
    const sdp = offerSdpTextarea.value
        .split('\n')
        .map(l => l.trim())
        .join('\r\n');
    const offer = {
      type: 'offer',
      sdp: sdp
    };
    console.log(`Modified Offer from localPeerConnection\n${sdp}`);

    try {
      // eslint-disable-next-line no-unused-vars
      const ignore = await localPeerConnection.setLocalDescription(offer);
      console.log('SET LOCAL DESCRIPTION');
      onSetSessionDescriptionSuccess();
      // TODO - VALUE TO BE PASSED FROM CALLER TO CALLEE ***
      setOfferButton.disabled = true;
    } catch (e) {
      onSetSessionDescriptionError(e);
      return;
    }

    // TODO - RECIEVE OFFER FROM CALLER *** / expect to recieve this offer back from remote?
    try {
      // eslint-disable-next-line no-unused-vars
      console.log('SET REMOTE DESCRIPTION');
      const ignore = await remotePeerConnection.setRemoteDescription(offer);
      onSetSessionDescriptionSuccess();
      createAnswerButton.disabled = false;
    } catch (e) {
      onSetSessionDescriptionError(e);
      return;
    }
  }
  //GONE TO CALLER - SET OFFER IN TEXTAREA
    function gotDescription1(description) {
    console.log('got description offer', description)
    offerSdpTextarea.disabled = false;
    offerSdpTextarea.value = description.sdp;
    createOfferButton.disabled = true;
    setOfferButton.disabled = false;
  }
  //GONE TO CALLEE
  async function createAnswer() {
    // Since the 'remote' side has no media stream we need
    // to pass in the right constraints in order for it to
    // accept the incoming offer of audio and video.
    try {
      const answer = await remotePeerConnection.createAnswer();
      gotDescription2(answer);
    } catch (e) {
      onCreateSessionDescriptionError(e);
    }
  }

  async function setAnswer() {
    setAnswerButton.disabled = false;
    // Restore the SDP from the textarea. Ensure we use CRLF which is what is generated
    // even though https://tools.ietf.org/html/rfc4566#section-5 requires
    // parsers to handle both LF and CRLF.

    //Recieve this answer from database: **

    const sdp = answerSdpTextarea.value
        .split('\n')
        .map(l => l.trim())
        .join('\r\n');
    const answer = {
      type: 'answer',
      sdp: sdp
    };

    try {
      // eslint-disable-next-line no-unused-vars
      const ignore = await remotePeerConnection.setLocalDescription(answer);
      onSetSessionDescriptionSuccess();
      setAnswerButton.disabled = true;
    } catch (e) {
      onSetSessionDescriptionError(e);
      return;
    }

    console.log(`Modified Answer from remotePeerConnection\n${sdp}`);
    try {
      // eslint-disable-next-line no-unused-vars
      const ignore = await localPeerConnection.setRemoteDescription(answer);
      onSetSessionDescriptionSuccess();
    } catch (e) {
      onSetSessionDescriptionError(e);
      return;
    }
    hangupButton.disabled = false;
    createOfferButton.disabled = false;
  }

  function gotDescription2(description) {
    answerSdpTextarea.disabled = false;
    answerSdpTextarea.value = description.sdp;
    createAnswerButton.disabled = true;
    setAnswerButton.disabled = false;
  }
  function sendData() {
    if (sendChannel.readyState === 'open') {
      sendChannel.send(dataChannelCounter);
      console.log(`DataChannel send counter: ${dataChannelCounter}`);
      dataChannelCounter++;
    }
  }

  function hangup() {
    remoteVideo.srcObject = null;
    console.log('Ending call');
    localStream.getTracks().forEach(track => track.stop());
    sendChannel.close();
    if (receiveChannel) {
      receiveChannel.close();
    }
    localPeerConnection.close();
    remotePeerConnection.close();
    localPeerConnection = null;
    remotePeerConnection = null;
    offerSdpTextarea.disabled = true;
    answerSdpTextarea.disabled = true;
    getMediaButton.disabled = false;
    createPeerConnectionButton.disabled = true;
    createOfferButton.disabled = true;
    setOfferButton.disabled = true;
    createAnswerButton.disabled = true;
    setAnswerButton.disabled = true;
    hangupButton.disabled = true;
  }

  function gotRemoteStream(e) {
    if (remoteVideo.srcObject !== e.streams[0]) {
      remoteVideo.srcObject = e.streams[0];
      console.log('Received remote stream');
    }
  }

  function getOtherPc(pc) {
    return (pc === localPeerConnection) ? remotePeerConnection : localPeerConnection;
  }

  function getName(pc) {
    return (pc === localPeerConnection) ? 'localPeerConnection' : 'remotePeerConnection';
  }

  async function onIceCandidate(pc, event) {
    try {
      // eslint-disable-next-line no-unused-vars
      const ignore = await getOtherPc(pc).addIceCandidate(event.candidate);
      onAddIceCandidateSuccess(pc);
    } catch (e) {
      onAddIceCandidateError(pc, e);
    }

    console.log(`${getName(pc)} ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
  }
   function onAddIceCandidateSuccess() {
    console.log('AddIceCandidate success.');
  }

  function onAddIceCandidateError(error) {
    console.log(`Failed to add Ice Candidate: ${error.toString()}`);
  }

  function receiveChannelCallback(event) {
    console.log('Receive Channel Callback');
    receiveChannel = event.channel;
    receiveChannel.onmessage = onReceiveMessageCallback;
    receiveChannel.onopen = onReceiveChannelStateChange;
    receiveChannel.onclose = onReceiveChannelStateChange;
  }

  function onReceiveMessageCallback(event) {
    dataChannelDataReceived = event.data;
    console.log(`DataChannel receive counter: ${dataChannelDataReceived}`);
  }

  function onSendChannelStateChange() {
    const readyState = sendChannel.readyState;
    console.log(`Send channel state is: ${readyState}`);
    if (readyState === 'open') {
      sendDataLoop = setInterval(sendData, 1000);
    } else {
      clearInterval(sendDataLoop);
    }
  }

  function onReceiveChannelStateChange() {
    const readyState = receiveChannel.readyState;
    console.log(`Receive channel state is: ${readyState}`);
  }

}

    return {init}
}

export default useMeeting
