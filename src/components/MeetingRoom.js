import '../styles/MeetingRoom.scss';
import useMeeting from '../hooks/useMeeting';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';



const MeetingRoom = () => {
    const { roomID } = useParams();
    console.log('roomID',roomID)
   
    const { init } = useMeeting()
    const addEvents = () => {
        init()
    }
    const [isCaller, setIsCaller] = useState(true)
    const changeCaller = () => {

    }
    useEffect(() => {
        addEvents()
    }, [])

    return (
        <main>
            <section className="connections">
                    <div id="selectSource" className="hidden">
                        <div id="select">Select an audio &amp; video source, then click <strong>Get media</strong>:</div>
                        <div className="source">
                            <label htmlFor="audioSrc">Audio source:</label>
                            <select id="audioSrc"></select>
                        </div>
                        <div className="source">
                            <label htmlFor="videoSrc">Video source:</label>
                            <select id="videoSrc"></select>
                        </div>
                    </div>
                    <div id="buttons">
                        <button id="changeToCaller">Change to Caller</button>
                        {/* {isCaller && <> */}
                        <button id="getMedia">Get media</button>
                        <button id="createPeerConnection" disabled>Create peer connection</button>
                        <button id="createOffer" disabled>Create offer</button>
                        <button id="setOffer" disabled>Set offer</button>
                        {/* </>
                        } */}
                        {/* {!isCaller && <> */}
                        <button id="createAnswer" disabled>Create answer</button>
                        <button id="setAnswer" disabled>Set answer</button>
                        <button id="hangup" disabled>Hang up</button>
                        {/* </>} */}
                    </div>
                    <div id="preview">
                        <div id="local">
                                <h2>Local</h2>
                                <video playsInline autoPlay muted></video>
                                <h2>Offer SDP</h2>
                                <textarea></textarea>
                                <br>
                                </br>
                        </div>
                    
                    <div id="remote">
                        <h2>Remote</h2>
                        <video playsInline autoPlay></video>
                        <h2>Answer SDP</h2>
                        <textarea></textarea>
                    </div>
                    </div>
            </section>
        </main>
    )
}

export default MeetingRoom
