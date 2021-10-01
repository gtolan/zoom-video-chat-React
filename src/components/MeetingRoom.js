import '../styles/MeetingRoom.scss';
import useMeeting from '../hooks/useMeeting';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';



const MeetingRoom = () => {
    const { ID } = useParams()
    const meet = useMeeting()

    console.log(ID, 'ID');
    meet()


    return (
        <main>
            <section className="connections">
                    <div id="buttons">
                        <button id="getMedia">Get media</button>
                        <button id="createPeerConnection" disabled>Create peer connection</button>
                        <button id="createOffer" disabled>Create offer</button>
                        <button id="setOffer" disabled>Set offer</button>
                        <button id="createAnswer" disabled>Create answer</button>
                        <button id="setAnswer" disabled>Set answer</button>
                        <button id="hangup" disabled>Hang up</button>
                    </div>
                    <div id="preview">
                        <div id="local">
                                <h2>Local</h2>
                                <video playsinline autoplay muted></video>
                                <h2>Offer SDP</h2>
                                <textarea></textarea>
                                <br>
                                </br>
                        </div>
                    </div>
                    <div id="remote">
                        <h2>Remote</h2>
                        <video playsinline autoplay></video>
                        <h2>Answer SDP</h2>
                        <textarea></textarea>
                    </div>
            </section>
        </main>
    )
}

export default MeetingRoom
