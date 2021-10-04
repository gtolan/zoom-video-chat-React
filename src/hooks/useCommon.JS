import { useState } from 'react';
// import { collection, addDoc, getDocs } from "firebase/firestore"; 
// import { getFirestore, collection, getDocs, setDoc } from 'firebase/firestore/lite';

import { doc, getDocs,getDoc, addDoc, collection, setDoc, onSnapshot } from "firebase/firestore";

import db from '../firebaseInit';

const useCommon = () => {

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
let roomDialog = null;
let docRef;
// const [remoteStream, setRemoteStream] = useState();
// const [roomId, setRoomId] = useState();
let roomId = null;
// const [localStream, setLocalStream] = useState();
// const [peerConnection, setPeerConnection] = useState();


// async function addCallerCandidate(event, callerCandidatesCollection, roomRefDB){
//     callerCandidatesCollection.addDoc(event.candidate.toJSON());
//     const docRef = await addDoc(collection(roomRefDB, 'callerCandidatesCollection'));
    // Add a new document with a generated id.
    // const docRef = await addDoc(collection(db, "cities"), {
    //   name: "Tokyo",
    //   country: "Japan"
    // });
//     console.log("Document written with ID: ", docRef.id);
// }


async function createRoom() {
  console.log('create room', db, 'DB')
  document.querySelector('#createBtn').disabled = true;
  document.querySelector('#joinBtn').disabled = true;
  //const roomRefDB = await getDocs(collection(db, "Rooms"));
  const roomRefDB = doc(collection(db, "Rooms"));
  // const roomRefDB = doc(db, 'rooms');
    // const roomRefDB = db.collection('rooms').doc(`${roomId}`);
  //const roomRefDB = doc(db, "Rooms");

  console.log('roomRefDB',roomRefDB)
  // const roomRefDB = await db.collection('rooms').doc();

  console.log('Create PeerConnection with configuration: ', configuration, 'roomRefDB', roomRefDB);
  // peerConnection = new RTCPeerConnection(configuration);

  // setPeerConnection(new RTCPeerConnection(configuration))
  peerConnection = new RTCPeerConnection(configuration);

  registerPeerConnectionListeners(peerConnection);

  localStream.getTracks().forEach(track => {
    peerConnection.addTrack(track, localStream);
  });

  // Code for collecting ICE candidates below from DB
  //const callerCandidatesCollection = roomRefDB.collection('callerCandidates');
  //const callerCandidatesCollection = getDocs(collection(db,'callerCandidates'))
  // const roomRefDB = doc(collection(db, "Rooms"));
  const callerCandidatesCollection = await doc(collection(roomRefDB,"callerCandidates"));
  //
  
  //const callerCandidatesCollection = await getDoc(roomRefDB,'callerCandidates' )
  //const callerCandidatesCollection = (roomRefDB, 'callerCandidates');
  //const callerCandidatesCollection = doc(roomRefDB,"callerCandidates");
  //const callerCandidatesCollection = doc(db, 'callerCandidates');
  console.log(callerCandidatesCollection, 'callerCandidatesCollection')
  peerConnection.addEventListener('icecandidate', async (event) => {
    if (!event.candidate) {
      console.log('Got final candidate!');
      return;
    }
    console.log('Got candidate: ', event.candidate);
    // callerCandidatesCollection.addDoc(event.candidate.toJSON());

    // callerCandidatesCollection.addDoc(event.candidate.toJSON());
    //const docRef = await addDoc(collection(callerCandidatesCollection),event.candidate.toJSON()));
    //const docRef = await setDoc(collection(roomRefDB, 'callerCandidatesCollection'),event.candidate.toJSON());
    // Add a new document with a generated id.
    docRef = await addDoc(collection(roomRefDB, 'callerCandidatesCollection'), event.candidate.toJSON());
    console.log("Document written with ID: ", docRef.id);
    console.log("Document written with ID: ", docRef.id, docRef);

  });
  // Code for collecting ICE candidates above

  // Code for creating a room below
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  console.log('Created offer:', offer);

  const roomWithOffer = {
    'offer': {
      type: offer.type,
      sdp: offer.sdp,
    },
  };


  // Add a new document with a generated id
//const newCityRef = doc(collection(db, "cities"));

// later...
  await setDoc(roomRefDB, roomWithOffer);

  // await roomRefDB.set(roomWithOffer);
  //await roomRefDB.setDoc(roomWithOffer);
  // roomId = roomRefDB.id;
  roomId = roomRefDB.id;
  console.log(`New room created with SDP offer. Room ID: ${roomRefDB.id}`);
  document.querySelector(
      '#currentRoom').innerText = `Current room is ${roomRefDB.id} - You are the caller!`;
  // Code for creating a room above

  peerConnection.addEventListener('track', event => {
    console.log('Got remote track:', event.streams[0]);
    event.streams[0].getTracks().forEach(track => {
      console.log('Add a track to the remoteStream:', track);
      remoteStream.addTrack(track);
    });
  });

  // Listening for remote session description below
  // roomRefDB.onSnapshot(async snapshot => {
  //   const data = snapshot.data();
  //   if (!peerConnection.currentRemoteDescription && data && data.answer) {
  //     console.log('Got remote description: ', data.answer);
  //     const rtcSessionDescription = new RTCSessionDescription(data.answer);
  //     await peerConnection.setRemoteDescription(rtcSessionDescription);
  //   }
  // });
  console.log(docRef, 'docRef', roomId, roomRefDB, 'roomRefDB');


  const unsub = onSnapshot(doc(db,'Rooms',roomId), (doc) => {
    console.log("Current data: ", doc.data());
        if (!peerConnection.currentRemoteDescription && doc && doc.answer) {
          console.log('Got remote description: ', doc.answer);
          const rtcSessionDescription = new RTCSessionDescription(doc.answer);
          peerConnection.setRemoteDescription(rtcSessionDescription);
           //await peerConnection.setRemoteDescription(rtcSessionDescription);
    }
});

//   const unsub = onSnapshot(doc(db, "cities", "SF"), (doc) => {
//     console.log("Current data: ", doc.data());
// });
// const unsub = onSnapshot(doc(roomRefDB), (doc) => {
//     console.log("Current data: ", doc.data());
// });
// unsub()
// roomRefDB.onSnapshot(doc(callerCandidatesCollection), (doc) => {
//     console.log("Current data: ", doc.data());
//     if (!peerConnection.currentRemoteDescription && doc && doc.answer) {
//       console.log('Got remote description: ', data.answer);
//       const rtcSessionDescription = new RTCSessionDescription(data.answer);
//       await peerConnection.setRemoteDescription(rtcSessionDescription);
//     }
//     }
// });


  // Listening for remote session description above

  // Listen for remote ICE candidates below
  // roomRefDB.collection('calleeCandidates').onSnapshot(snapshot => {
  //   snapshot.docChanges().forEach(async change => {
  //     if (change.type === 'added') {
  //       let data = change.doc.data();
  //       console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
  //       await peerConnection.addIceCandidate(new RTCIceCandidate(data));
  //     }
  //   });
  // });

  const unsubAnswer = onSnapshot(collection(db,'Rooms',`${roomId}`,'calleeCandidates'), (snapshot) => {
    snapshot.docChanges().forEach(async change => {
      if (change.type === 'added') {
        let data = change.doc.data();
        console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
        await peerConnection.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });



  // Listen for remote ICE candidates above
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
  // roomDialog.open();
  console.log('open modal')
}

async function joinRoomById(roomId) {
  console.log('join room by id', roomId)
  // const db = firestore();
  const roomRefDB = db.collection('rooms').doc(`${roomId}`);
  const roomSnapshot = await roomRefDB.getDocs();
  console.log('Got room:', roomSnapshot.exists);

  if (roomSnapshot.exists) {
    console.log('Create PeerConnection with configuration: ', configuration);
    peerConnection = new RTCPeerConnection(configuration);
    registerPeerConnectionListeners();
    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    // Code for collecting ICE candidates below
    const calleeCandidatesCollection = roomRefDB.collection('calleeCandidates');
    peerConnection.addEventListener('icecandidate', event => {
      if (!event.candidate) {
        console.log('Got final candidate!');
        return;
      }
      console.log('Got candidate: ', event.candidate);
      calleeCandidatesCollection.addDoc(event.candidate.toJSON());
    });
    // Code for collecting ICE candidates above

    peerConnection.addEventListener('track', event => {
      console.log('Got remote track:', event.streams[0]);
      event.streams[0].getTracks().forEach(track => {
        console.log('Add a track to the remoteStream:', track);
        remoteStream.addTrack(track);
      });
    });

    // Code for creating SDP answer below
    const offer = roomSnapshot.data().offer;
    console.log('Got offer:', offer);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    console.log('Created answer:', answer);
    await peerConnection.setLocalDescription(answer);

    const roomWithAnswer = {
      answer: {
        type: answer.type,
        sdp: answer.sdp,
      },
    };
    await roomRefDB.update(roomWithAnswer);
    // Code for creating SDP answer above

    // Listening for remote ICE candidates below
    roomRefDB.collection('callerCandidates').onSnapshot(snapshot => {
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
  // setLocalStream(stream)
  remoteStream = new MediaStream();
  // setRemoteStream(new MediaStream())
  document.querySelector('#remoteVideo').srcObject = remoteStream;

  console.log('Stream:', document.querySelector('#localVideo').srcObject);
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

export default useCommon;