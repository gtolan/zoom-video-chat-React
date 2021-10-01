import useCommon from './useCommon.js';




const useCallee = async () => {
    const { gotSources, 
          hangup, 
          answerSdpTextarea,
          onCreateSessionDescriptionError, 
          onSetSessionDescriptionSuccess, 
          createPeerConnectionButton,
          onSetSessionDescriptionError, 
          createOfferButton,
            } = await useCommon();

    console.log('use callee')
    try {
        const enumerateDevices = await navigator.mediaDevices.enumerateDevices();
        gotSources(enumerateDevices);
    } catch (e) {
        console.log(e);
    }
    let localStream;
     const localVideo = document.querySelector('div#local video');

  //GET ELEMENTS - CALLEE    -- AFTER OFFER HAS BEEN SENT (FROM SET OFFER?)
   const createAnswerButton = document.querySelector('button#createAnswer');
   const setAnswerButton = document.querySelector('button#setAnswer');
   const hangupButton = document.querySelector('button#hangup');

  //ADD BUTTON EVENTS- CALLEE
  createAnswerButton.onclick = createAnswer;
  setAnswerButton.onclick = setAnswer;
  hangupButton.onclick = hangup;
  

 
//   const answerSdpTextarea = document.querySelector('div#remote textarea');

  //ADD SELECT OPTION CHANGE EVENT - TO SELECT CAMERA OR AUDIO INPUT
  const audioSelect = document.querySelector('select#audioSrc');
  const videoSelect = document.querySelector('select#videoSrc');
  audioSelect.onchange = videoSelect.onchange = getMedia;



  let localPeerConnection;
  let remotePeerConnection;

  const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1
  };
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
      //GIVE THE CALLER THE ANSWER TO CONNECT - TODO
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
      //GET LOCAL DEVICE MEDIA OPTIONS - VIDEO AND AUDIO
    async function getMedia() {
        // getMediaButton.disabled = true;

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
        console.log('Received local stream', stream);
        localVideo.srcObject = stream;
        localStream = stream;
        createPeerConnectionButton.disabled = false;
    }
    
}

export default useCallee;


