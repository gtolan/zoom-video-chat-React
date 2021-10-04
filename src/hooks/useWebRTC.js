import { useState } from 'react';
// import { collection, addDoc, getDocs } from "firebase/firestore"; 
// import { getFirestore, collection, getDocs, setDoc } from 'firebase/firestore/lite';

import { doc, getDocs,getDoc, addDoc, collection, setDoc, onSnapshot, updateDoc } from "firebase/firestore";

import db from '../firebaseInit';

const useWebRTC = () => {

    const configuration = {
    iceServers: [
        {
        urls: [
            'stun:stun1.l.google.com:19302',
            'stun:stun2.l.google.com:19302',
        ],
        },
    ],
    iceCandidatePoolSize: 10,
    };

    let peerConnection = null;
    let localStream = null;
    let remoteStream = null;
    let docRef;
    let roomId = null;


    async function createRoom() {
        console.log('create room', db, 'DB')
        //UI state change
        document.querySelector('#createBtn').disabled = true;
        document.querySelector('#joinBtn').disabled = true;

        //Create DB ref
        const roomRefDB = doc(collection(db, "Rooms"));

        console.log('Create PeerConnection with configuration: ', configuration, 'roomRefDB', roomRefDB);
        //Start Peer connection
        peerConnection = new RTCPeerConnection(configuration);

        //Add Peer connction listeners
        registerPeerConnectionListeners(peerConnection);

        //Get local stream and add it to peer connection
        localStream.getTracks().forEach(track => {
             console.log('localStream ADD')
            peerConnection.addTrack(track, localStream);
        });
  
        // await doc(collection(roomRefDB,"callerCandidates"));

        peerConnection.addEventListener('icecandidate', async (event) => {
            if (!event.candidate) {
            console.log('Got final candidate!');
            return;
            }
            console.log('Got candidate: ', event.candidate);
            //write ICE candidates for Caller to Room
            docRef = await addDoc(collection(roomRefDB, 'callerCandidatesCollection'), event.candidate.toJSON());
            console.log("Document written with ID: ", docRef.id, docRef);

        });

        //Create Offer
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        console.log('LOCAL DESC SET');
        console.log('Created offer:', offer);

        const roomWithOffer = {
            'offer': {
            type: offer.type,
            sdp: offer.sdp,
            },
        };
        //Set the offer to the Room ID
        await setDoc(roomRefDB, roomWithOffer);

        roomId = roomRefDB.id;
        console.log(`New room created with SDP offer. Room ID: ${roomRefDB.id}`);
        document.querySelector(
            '#currentRoom').innerText = `Current room is ${roomRefDB.id} - You are the caller!`;
        // Code for showing Room ID above

        // //add listener for peer connection Tracks to Remote Stream
        // peerConnection.addEventListener('track', event => {
        //     console.log('Got remote track:', event.streams[0]);
        //     event.streams[0].getTracks().forEach(track => {
        //         console.log('Add a track to the remoteStream:', track);
        //         remoteStream.addTrack(track);
        //     });
        // });

        // Listening for remote session description below       
        const unsub = onSnapshot(doc(db,'Rooms',roomId), async(doc) => {
                console.log(doc, 'doc')
                const data = doc.data()
                if (!peerConnection.currentRemoteDescription && data.answer) {
                console.log('Got remote answer: ', data.answer);
                const rtcSessionDescription = new RTCSessionDescription(data.answer);
                //peerConnection.setRemoteDescription(rtcSessionDescription);
                await peerConnection.setRemoteDescription(rtcSessionDescription);
                console.log('REMOTE DESC SET');
            }
        });

        // Listen for remote ICE candidates
        const unsubAnswer = onSnapshot(collection(db,'Rooms',`${roomId}`,'calleeCandidates'), (snapshot) => {
            snapshot.docChanges().forEach(async change => {
            if (change.type === 'added') {
                let data = change.doc.data();
                console.log(`Got new remote ICE callee candidate: ${JSON.stringify(data)}`);
                await peerConnection.addIceCandidate(new RTCIceCandidate(data));
            }
            });
        });

                // //add listener for peer connection Tracks to Remote Stream
        peerConnection.addEventListener('track', event => {
            console.log('Got remote track:', event.streams[0]);
            event.streams[0].getTracks().forEach(track => {
                console.log('Add a track to the remoteStream:', track);
                remoteStream.addTrack(track);
            });
        });
        console.log('Listen for remote ICE candidates')



       
    }

    function joinRoom() {
        console.log('join room')
        document.querySelector('#createBtn').disabled = true;
        document.querySelector('#joinBtn').disabled = true;

        document.querySelector('#confirmJoinBtn').
            addEventListener('click', async () => {
                roomId = document.querySelector('#room-id').value;
                console.log('Join room: ', roomId);
                document.querySelector(
                    '#currentRoom').innerText = `Current room is ${roomId} - You are the callee!`;
                await joinRoomById(roomId);
            }, {once: true});
        console.log('open modal')
    }

    async function joinRoomById(roomId) {
    
        const roomRefDB = doc(db, "Rooms", roomId);
        const roomSnapshot = await getDoc(roomRefDB);
        
///The Callee answers the room Snapshot
    if (roomSnapshot.exists) {
        console.log("I AM THE CALLEE")
        console.log('Create PeerConnection with configuration: ', configuration);
        peerConnection = new RTCPeerConnection(configuration);
        console.log("Register local callee listeners for tracks")
        registerPeerConnectionListeners();

        localStream.getTracks().forEach(track => {
            console.log('localStream ADD')
            peerConnection.addTrack(track, localStream);
        });

        //Write an Callee Candidates ICE list
        await doc(collection(roomRefDB,"calleeCandidates"));

        // Code for collecting ICE candidates below
        peerConnection.addEventListener('icecandidate', async(event) => {
                if (!event.candidate) {
                    console.log('Got final candidate!');
                    return;
                }
                //Wite Candidates to Firestore
                console.log('Got candidate: ', event.candidate);
                await addDoc(collection(roomRefDB, 'calleeCandidatesCollection'), event.candidate.toJSON());
        // Code for collecting ICE candidates above
        })

        //
        peerConnection.addEventListener('track', event => {
            console.log('Got remote track:', event.streams[0]);
            event.streams[0].getTracks().forEach(track => {
                console.log('Add a track to the remoteStream:', track, event.track);
                remoteStream.addTrack(track);
            });
        });

        // Code for creating SDP answer below
        const offer = roomSnapshot.data().offer;
        console.log('Got offer:', offer);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        console.log('REMOTE DESC SET');
        const answer = await peerConnection.createAnswer();
        console.log('Created answer:', answer);
        await peerConnection.setLocalDescription(answer);
        console.log('LOCAL DESC SET');

        const roomWithAnswer = {
        answer: {
            type: answer.type,
            sdp: answer.sdp,
        },
        };
        await updateDoc(roomRefDB, roomWithAnswer);
        // Code for creating SDP answer above

        // Listening for remote ICE candidates below

        const unsubCallerCandidates = onSnapshot(collection(db,'Rooms',`${roomId}`,'callerCandidates'), (snapshot) => {
            snapshot.docChanges().forEach(async change => {
            if (change.type === 'added') {
                let data = change.doc.data();
                console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
                await peerConnection.addIceCandidate(new RTCIceCandidate(data));
            }
        });
    });


        

        // Listening for remote ICE candidates above
    }

    }
    async function openUserMedia(e) {
    console.log('openUserMedia')
    const stream = await navigator.mediaDevices.getUserMedia(
        {video: true, audio: true});
    document.querySelector('#localVideo').srcObject = stream;
    localStream = stream;
    remoteStream = new MediaStream();
    document.querySelector('#remoteVideo').srcObject = remoteStream;

    console.log('Stream:', document.querySelector('#localVideo').srcObject);
    console.log('Stream:', document.querySelector('#remoteVideo').srcObject);
    document.querySelector('#cameraBtn').disabled = true;
    document.querySelector('#joinBtn').disabled = false;
    document.querySelector('#createBtn').disabled = false;
    document.querySelector('#hangupBtn').disabled = false;
    console.log('fin open use media');
    }

    async function hangUp(e) {
    console.log('hang up');
    const tracks = document.querySelector('#localVideo').srcObject.getTracks();
    tracks.forEach(track => {
        track.stop();
    });

    if (remoteStream) {
        remoteStream.getTracks().forEach(track => track.stop());
    }

    if (peerConnection) {
        peerConnection.close();
    }

    document.querySelector('#localVideo').srcObject = null;
    document.querySelector('#remoteVideo').srcObject = null;
    document.querySelector('#cameraBtn').disabled = false;
    document.querySelector('#joinBtn').disabled = true;
    document.querySelector('#createBtn').disabled = true;
    document.querySelector('#hangupBtn').disabled = true;
    document.querySelector('#currentRoom').innerText = '';

    // Delete room on hangup
    if (roomId) {
        // const db = firestore();
        const roomRefDB = db.collection('rooms').doc(roomId);
        const calleeCandidates = await roomRefDB.collection('calleeCandidates').getDocs();
        calleeCandidates.forEach(async candidate => {
        await candidate.ref.delete();
        });
        const callerCandidates = await roomRefDB.collection('callerCandidates').getDocs();
        callerCandidates.forEach(async candidate => {
        await candidate.ref.delete();
        });
        await roomRefDB.delete();
    }

    document.location.reload(true);
    }
    //redo
    function registerPeerConnectionListeners() {
    peerConnection.addEventListener('icegatheringstatechange', () => {
        console.log(
            `ICE gathering state changed: ${peerConnection.iceGatheringState}`);
    });

    peerConnection.addEventListener('connectionstatechange', () => {
        console.log(`Connection state change: ${peerConnection.connectionState}`);
    });

    peerConnection.addEventListener('signalingstatechange', () => {
        console.log(`Signaling state change: ${peerConnection.signalingState}`);
    });

    peerConnection.addEventListener('iceconnectionstatechange ', () => {
        console.log(
            `ICE connection state change: ${peerConnection.iceConnectionState}`);
    });
    }

    return {createRoom, joinRoom, openUserMedia, hangUp};

}//END

export default useWebRTC;