import { useState } from 'react';
import { useHistory } from "react-router-dom";
import '../styles/HomePage.scss';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import db from '../firebaseInit';

const HomePage = () => {

    const [btnDisabled, toggleBtnDisabled] = useState(true);
    const [meetingRoomID, setMeetingRoomID] = useState(true);
    const history = useHistory();
    const submitHandler = (e) => {
        console.log(e,'change paegg')
        e.preventDefault()
        //TODO: validate ID before or after submit?
        history.push(`/meeting-room/${meetingRoomID}`)
    }

    // async function getRoom(db) {
    //     const roomCol = collection(db, 'Rooms');
    //     const roomSnapshot = await getDocs(roomCol);
    //     const roomList = roomSnapshot.docs.map(doc => doc.data());
    //     console.log('roomList', roomList)
    //     return roomList;
    //     }
    // getRoom(db)

    const inputChanged = (e) => {
            //enable join btn
            e.target.value.length > 5 ?
            (toggleBtnDisabled(false)) :
            (toggleBtnDisabled(true));
            //set the input value in state
            setMeetingRoomID(e.target.value)
    }

    return (
        <main className="homepage">
            <section>
                    <p className="title">Meeting ID or Personal Link Name</p>
                    <form className="meeting-room-form" onSubmit={submitHandler}>
                        <input type="text" name="meeting-code" onChange={inputChanged} placeholder="Enter Meeting ID or Personal Link Name"/>
                        <p className="meeting-terms">
                            By clicking "Join", you agree to our Terms of Services and Privacy Statement
                        </p>
                        <button className="submit" type="submit" disabled={btnDisabled}>
                            Join
                        </button>
                    </form>
            </section>
        </main>
    )
}

export default HomePage
