

const useCaller = () => {
    return {}
}

export default useCaller;
        //SETUP WEB RTC CONNEXTION
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

                function gotDescription1(description) {
    offerSdpTextarea.disabled = false;
    offerSdpTextarea.value = description.sdp;
    createOfferButton.disabled = true;
    setOfferButton.disabled = false;
  }
    async function createOffer() {
        try {
        const offer = await localPeerConnection.createOffer(offerOptions);
        gotDescription1(offer);
        } catch (e) {
        onCreateSessionDescriptionError(e);
        }
    }

