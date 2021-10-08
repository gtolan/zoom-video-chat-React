import useWebRTC from '../hooks/useWebRTC';
import { useEffect, useState, createRef } from 'react';
import '../styles/MeetingRoom.scss';
import { useLocation, useHistory } from 'react-router-dom';
const ChatRoom = () => {
    const currentRoom = createRef()
    const history = useHistory();
    const closeModal = () => {
        console.log('close modal')
        history.push("/");
    }
    const inputChange = () => {
                console.log('andle input change')
    }
    const handleCamera = () => {
                openUserMedia();
                setCameraIsOn(true);   
            }
    const handleCreateRoom = () => {
                setCreatedRoom(!createdRoom);
                createRoom();
            // setCreatedRoom(true)
    }
    const shareWithCallee = ()=> {
        // https://wa.me/?text=host-meeting-room
                const id = currentRoom.current.innerText;
                console.log(id)
                const shareViaWhatsAppLink = `https://wa.me/?text=${id}`  //urlencodedtext
                console.log(shareViaWhatsAppLink, 'shareViaWhatsAppLink')
    }
    const {createRoom, joinRoom, openUserMedia, hangUp, roomReady} = useWebRTC()
        useEffect(() => {
                document.querySelector('#hangupBtn').addEventListener('click', hangUp);
                document.querySelector('#createBtn').addEventListener('click', handleCreateRoom);
                document.querySelector('#joinBtn').addEventListener('click', joinRoom);
                
        }, [])

        const [createdRoom, setCreatedRoom] = useState(false)
        const [cameraIsOn, setCameraIsOn] = useState(false)

        // const location = useLocation()
        const { pathname } = useLocation();
        console.log(pathname,'path')
        const chatRoomID = pathname.substring(pathname.lastIndexOf('/') + 1)
        const isHost = pathname.includes('host');
        console.log(isHost, 'isHost')
        const [createRoomBtn, setCreateRoomBtn ] = useState(false)


    console.log(roomReady,'roomReady')
    
    return (
        <div>
        <main className={`chat-room ${isHost ? '' : 'modal-open'}`}>

            <div>
                <span id="currentRoom" ref={currentRoom}></span>
            </div>
            <div id="videos">
                <video id="localVideo" muted autoPlay playsInline></video>
                <video id="remoteVideo" autoPlay playsInline></video>
            </div>

            <section>
                <div className="room-id-edit">
                    <h5>Enter ID for room to join:</h5>
                    <div className="mdc-text-field">
                        <input onChange={inputChange} type="text" id="room-id" value={chatRoomID} className="mdc-text-field__input"/>
                        <label className="mdc-floating-label" htmlFor="my-text-field">Room ID</label>                 
                    </div>   
                </div>         
                      
                <div id="controls">
                    <button id="cameraBtn" onClick={handleCamera}>
                        <svg className={`show video-cam`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15 8v8H5V8h10m1-2H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4V7c0-.55-.45-1-1-1z"/></svg>
                        <svg className={`hide video-cam`}xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9.56 8l-2-2-4.15-4.14L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.55-.18L19.73 21l1.41-1.41-8.86-8.86L9.56 8zM5 16V8h1.73l8 8H5zm10-8v2.61l6 6V6.5l-4 4V7c0-.55-.45-1-1-1h-5.61l2 2H15z"/></svg>
                        <span className="control-text">{`${!cameraIsOn ? 'Start Video' : 'Stop Video'} `}</span>
                    </button>
                    <button id="createBtn"  className={`create ${createdRoom ? 'hide' : ''}`}>
                        <svg className="show" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
                        <svg className="hide" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
                            Create room
                    </button>
                    <button id="shareBtn" onClick={shareWithCallee}>
                        <svg className={` show share-room ${createRoomBtn ? 'off' : 'on'} `} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
                        <svg className={` hide share-room ${createRoomBtn ? 'on' : 'off'} `} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
                            Share Chat
                    </button>
                    <div className="callee-controls">
                        <button id="joinBtn">
                                Join room
                        </button>
                        <button id="hangupBtn">  
                                Hangup
                        </button>
                        <button id="confirmJoinBtn">
                                Join
                        </button>
                    </div>
                </div>
            </section>
            
        </main>
         <div className={`callee-modal ${isHost ? '' : 'active'}`}>
                 <h4 className="modal-welcome">You have been invited to a video call with the ID:</h4>
                    <input type="text" name="room-id" className="room-input" value={chatRoomID} onChange={inputChange}/>
                        <div className="modal-controls">
                            <button type="button" className="cancel" onClick={closeModal} data-mdc-dialog-action="no">
                                <span className="mdc-button__label">Cancel</span>
                            </button>
                            <button id="confirmJoinBtn" type="button" className="join"
                                        data-mdc-dialog-action="yes">
                                <span className="mdc-button__label">Join</span>
                            </button>
                        </div>
        </div>
            </div>

    )
}

export default ChatRoom
