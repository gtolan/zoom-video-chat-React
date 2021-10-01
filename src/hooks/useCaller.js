
import useCommon from './useCommon.js';


const useCaller = async ()=> {
        //   hangup, 
        //   onSendChannelStateChange,
        //   onIceCandidate,
        //   receiveChannelCallback,
        //   gotRemoteStream,
        const { gotSources, 
          createPeerConnection,
          onSetSessionDescriptionSuccess,
          onSetSessionDescriptionError, 
          createAnswerButton,
          onCreateSessionDescriptionError
            } =  await useCommon ();
        console.log('DOMContentLoaded - use caller');
       
         console.log('use caller')
        //GET CAMERA AND AUDIO
        try {
            const enumerateDevices = await navigator.mediaDevices.enumerateDevices();
            gotSources(enumerateDevices);
        } catch (e) {
            console.log(e);
        }

        //GET ELEMENTS - CALLER
        const getMediaButton = document.querySelector('button#getMedia');
        const localVideo = document.querySelector('div#local video');
        const createOfferButton = document.querySelector('button#createOffer');
        const createPeerConnectionButton = document.querySelector('button#createPeerConnection');
        // const createOfferButton = document.querySelector('button#createOffer');
        const setOfferButton = document.querySelector('button#setOffer');

        //ADD BUTTON EVENTS - CALLER
        getMediaButton.onclick = getMedia;
        createPeerConnectionButton.onclick = createPeerConnection;
        createOfferButton.onclick = createOffer;
        setOfferButton.onclick = setOffer;

        //SHOW OFFER AND ACCEPTANCE KEY
        const offerSdpTextarea = document.querySelector('div#local textarea');

        //ADD SELECT OPTION CHANGE EVENT - TO SELECT CAMERA OR AUDIO INPUT
        const audioSelect = document.querySelector('select#audioSrc');
        const videoSelect = document.querySelector('select#videoSrc');
        audioSelect.onchange = videoSelect.onchange = getMedia;

        let localPeerConnection;
        let remotePeerConnection;
        let localStream;
        let sendChannel;
        
        const dataChannelOptions = {ordered: true};

        const offerOptions = {
            offerToReceiveAudio: 1,
            offerToReceiveVideo: 1
        };

            //GET LOCAL DEVICE MEDIA OPTIONS - VIDEO AND AUDIO
    async function getMedia() {
        // getMediaButton.disabled = true;
        console.log('caller GET MEDIA')
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
        //SETUP WEB RTC CONNEXTION
        // function createPeerConnection() {

        //     //CALLER CREATE PEER CONNECTION
        //     createPeerConnectionButton.disabled = true;
        //     createOfferButton.disabled = false;
        //     console.log('Starting call');
        //     const videoTracks = localStream.getVideoTracks();
        //     const audioTracks = localStream.getAudioTracks();

        //     if (videoTracks.length > 0) {
        //     console.log(`Using video device: ${videoTracks[0].label}`);
        //     }

        //     if (audioTracks.length > 0) {
        //     console.log(`Using audio device: ${audioTracks[0].label}`);
        //     }
        //     const servers = null;

        //     window.localPeerConnection = localPeerConnection = new RTCPeerConnection(servers);
        //     console.log('Created local peer connection object localPeerConnection');
        //     localPeerConnection.onicecandidate = e => onIceCandidate(localPeerConnection, e);
        //     sendChannel = localPeerConnection.createDataChannel('sendDataChannel', dataChannelOptions);
        //     sendChannel.onopen = onSendChannelStateChange;
        //     sendChannel.onclose = onSendChannelStateChange;
        //     sendChannel.onerror = onSendChannelStateChange;

        //     //CALLEE PEER CONNECTION *** TODO
        //     window.remotePeerConnection = remotePeerConnection = new RTCPeerConnection(servers);
        //     console.log('Created remote peer connection object remotePeerConnection');
        //     remotePeerConnection.onicecandidate = e => onIceCandidate(remotePeerConnection, e);
        //     remotePeerConnection.ontrack = gotRemoteStream;
        //     remotePeerConnection.ondatachannel = receiveChannelCallback;

        //     //ADD LOCAL VIDEO STREAM
        //     localStream.getTracks()
        //         .forEach(track => localPeerConnection.addTrack(track, localStream));
        //     console.log('Adding Local Stream to peer connection');
        // }

        function gotDescriptionCaller(description) {
            offerSdpTextarea.disabled = false;
            offerSdpTextarea.value = description.sdp;
            createOfferButton.disabled = true;
            setOfferButton.disabled = false;
        }

        async function createOffer() {
            try {
            const offer = await localPeerConnection.createOffer(offerOptions);
            gotDescriptionCaller(offer);
            } catch (e) {
            onCreateSessionDescriptionError(e);
            }
        }
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

}

export default useCaller;
