import useWebRTC from '../hooks/useWebRTC';
import { useEffect, useState, createRef } from 'react';
import '../styles/MeetingRoom.scss';
import { useLocation, useHistory, Link } from 'react-router-dom';
const ChatRoom = () => {
    const currentRoom = createRef()
    const history = useHistory();


    const closeModal = () => {
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
    }
    const shareWithCallee = ()=> {
                const id = currentRoom.current.innerText;
                const shareViaWhatsAppLink = `https://wa.me/?text=${id}`  //urlencodedtext
                const win = window.open(shareViaWhatsAppLink, "_blank");
                win.focus();
    }

    const {createRoom, joinRoom, openUserMedia, hangUp, roomReady} = useWebRTC()
        
    useEffect(() => {
                document.querySelector('#hangupBtn').addEventListener('click', hangUp);
                document.querySelector('#createBtn').addEventListener('click', handleCreateRoom);
                document.querySelector('#joinBtn').addEventListener('click', joinRoom);
                       if(!isHost){
            setCreateRoomBtn(false)
        }
    }, [])

    const [createdRoom, setCreatedRoom] = useState(false)
    const [cameraIsOn, setCameraIsOn] = useState(false)
    const { pathname } = useLocation();
    const chatRoomID = pathname.substring(pathname.lastIndexOf('/') + 1)
    const isHost = pathname.includes('host');
    const [createRoomBtn, setCreateRoomBtn ] = useState(false)
      
    
    return (
        <div>
        <main className={`chat-room ${isHost ? '' : 'modal-open'}`}>

            
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
                    
                    <button id="createBtn"  className={`caller-control create ${createdRoom ? 'hide' : ''}`}>
                        <svg className="show" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
                        <svg className="hide" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
                            Create room
                    </button>
                    <div className={`callee-controls ${isHost ? '' : 'active'}`}>
                        <button id="confirmJoinBtn">
                            <svg className={`show`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10 8.64L15.27 12 10 15.36V8.64M8 5v14l11-7L8 5z"/></svg>
                            <svg className={`hide`} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10 8.64L15.27 12 10 15.36V8.64M8 5v14l11-7L8 5z"/></svg>
                                Join room
                        </button>   
                      
                    </div>
                    <button id="shareBtn" onClick={shareWithCallee} className="hide">
                        <svg className={` show share-room ${createRoomBtn ? 'off' : 'on'} `} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
                        <svg className={` hide share-room ${createRoomBtn ? 'on' : 'off'} `} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
                            Share Chat
                    </button>
                    
                    <button id="hangupBtn" className={`create ${!createdRoom ? 'hide' : ''}`}>  
                        <svg xmlns="http://www.w3.org/2000/svg" className="show" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" className="hide" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/></svg>
                            Hangup
                    </button>
                </div>
            </section>
            <div className="room-link">
                <a href="" target="blank" id="currentRoom" ref={currentRoom}></a>
            </div>
            
        </main>
         <div className={`callee-modal ${isHost ? '' : 'active'}`}>
                 {/* <h4 className="modal-welcome">Join your Meeting</h4> */}
                    <input type="text" id="join-room-id" name="join-room-id" className="room-input" value={chatRoomID} onChange={inputChange} placeholder="your meeting ID"/>
                        <div className="modal-controls">
                            <button type="button" className="cancel" onClick={closeModal} data-mdc-dialog-action="no">
                                <span className="mdc-button__label">Cancel</span>
                            </button>
                            <button id="joinBtn" type="button" className="join"
                                        data-mdc-dialog-action="yes">
                                <span className="mdc-button__label">Join</span>
                            </button>
                        </div>
        </div>
            </div>

    )
}

export default ChatRoom
