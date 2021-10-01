
import useCommon from './useCommon.js';


const useCaller = async ()=> {
        const { gotSources } = useCommon();
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
        const createPeerConnectionButton = document.querySelector('button#createPeerConnection');
        const createOfferButton = document.querySelector('button#createOffer');
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

}

export default useCaller;
