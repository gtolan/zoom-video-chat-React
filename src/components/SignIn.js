import '../styles/HomePage.scss';
import { useState } from 'react';
import { useHistory, Link } from "react-router-dom";
const SignIn = () => {
        const [btnDisabled, toggleBtnDisabled] = useState(true);
    const [meetingRoomID, setMeetingRoomID] = useState(true);
    const history = useHistory();
    const submitHandler = (e) => {
        console.log(e,'change paegg')
        e.preventDefault()
        //TODO: validate ID before or after submit?
        history.push(`/meeting-room/${meetingRoomID}`)
    }



    const inputChanged = (e) => {
            //enable join btn
            e.target.value.length > 2 ?
            (toggleBtnDisabled(false)) :
            (toggleBtnDisabled(true));
            //set the input value in state
            setMeetingRoomID(e.target.value)
    }

    return (
        <main className="homepage">
            <section>
                    <h1 className="sign-in-title">Sign In</h1>
                    <p className="title">New to ZZoom? <Link to="/sign-up">Sign up free</Link></p>
                    <form className="meeting-room-form" onSubmit={submitHandler}>
                        <label>Name or Email</label>
                        <input type="text" className="join-meeting" onChange={inputChanged} placeholder="Your name or Your email"/>
                        <label>Password</label>
                        <input type="password" className="join-meeting" onChange={inputChanged} placeholder="Password"/>
                        <p className="meeting-terms">
                            By clicking "Sign In", you agree to our Terms of Services and Privacy Statement
                        </p>
                        <button className="submit" type="submit" disabled={btnDisabled}>
                            Sign In
                        </button>
                    </form>
            </section>
        </main>
    )
}

export default SignIn
