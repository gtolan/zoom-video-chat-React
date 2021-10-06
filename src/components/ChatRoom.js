import useWebRTC from '../hooks/useWebRTC';
import { useEffect, useState } from 'react';
import '../styles/MeetingRoom.scss';
import videoCam from '../images/videoCam.svg';
import { useLocation, useHistory } from 'react-router-dom';
const ChatRoom = () => {
    const history = useHistory();
    const closeModal = () => {
        console.log('close modal')
        history.push("/");
    }
    
    const {createRoom, joinRoom, openUserMedia, hangUp} = useWebRTC()
        useEffect(() => {
                document.querySelector('#cameraBtn').addEventListener('click', openUserMedia);
                document.querySelector('#hangupBtn').addEventListener('click', hangUp);
                document.querySelector('#createBtn').addEventListener('click', createRoom);
                document.querySelector('#joinBtn').addEventListener('click', joinRoom);
        }, [])
        const [cameraIsOn, setCameraIsOn] = useState(false)

        // const location = useLocation()
        const { pathname } = useLocation();
        console.log(pathname,'path')
        const chatRoomID = pathname.substring(pathname.lastIndexOf('/') + 1)
        const isHost = pathname.includes('host');
        console.log(isHost, 'isHost')
    return (
        <div>
        <main className="chat-room">
        

            <div>
                <span id="currentRoom"></span>
            </div>
            <div id="videos">
                <video id="localVideo" muted autoPlay playsInline></video>
                <video id="remoteVideo" autoPlay playsInline></video>
            </div>
            <section>
                <h5>Enter ID for room to join:</h5>
                <div className="mdc-text-field">
                    <input type="text" id="room-id" className="mdc-text-field__input"/>
                    <label className="mdc-floating-label" htmlFor="my-text-field">Room ID</label>                 
                </div>            
                      
                       

                                    <div id="controls">
                <button id="cameraBtn">
                    <svg className={` show video-cam ${cameraIsOn ? 'off' : 'on'} `} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15 8v8H5V8h10m1-2H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4V7c0-.55-.45-1-1-1z"/></svg>
                    <svg className={`hide video-cam ${cameraIsOn ? 'on' : 'off'} `}xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M9.56 8l-2-2-4.15-4.14L2 3.27 4.73 6H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.21 0 .39-.08.55-.18L19.73 21l1.41-1.41-8.86-8.86L9.56 8zM5 16V8h1.73l8 8H5zm10-8v2.61l6 6V6.5l-4 4V7c0-.55-.45-1-1-1h-5.61l2 2H15z"/></svg>
                <span className="control-text">{`${!cameraIsOn ? 'Start Video' : 'Stop Video'} `}</span>
                </button>
                <button id="createBtn">
                Create room
                </button>
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
            </section>
            
        </main>
         <div className={`callee-modal ${isHost ? '' : 'active'}`}>
                 <h4 className="modal-welcome">You have been invited to a video call with the ID:</h4>
                            <div className="modal-room">{chatRoomID}</div>
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
