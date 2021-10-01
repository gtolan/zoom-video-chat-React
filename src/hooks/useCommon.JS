
//INSIDE INIT ASYNC

    //WRITE SOURCE OPTIONS TO SELECT - VIDEO AND AUDIO
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

    //GET LOCAL DEVICE MEDIA OPTIONS - VIDEO AND AUDIO
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

    //SET LOCAL STREAM CAMERA
    function gotStream(stream) {
        console.log('Received local stream');
        localVideo.srcObject = stream;
        localStream = stream;
        createPeerConnectionButton.disabled = false;
    }

    function onSetSessionDescriptionSuccess() {
        console.log('Set session description success.');
    }

    function onSetSessionDescriptionError(error) {
        console.log(`Failed to set session description: ${error.toString()}`);
    }

    //Send DATA ON DATA CHANNEL
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