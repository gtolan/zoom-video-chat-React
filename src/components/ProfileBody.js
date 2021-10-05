import avatar from '../images/avatar.svg';
import { useState } from 'react';

const ProfileBody = () => {
    const phoneNum = 91203120312;
    const owner = {
        username:'GTolan',
        name:'Ger Tolan',

    }
    const [phoneValue,setPhoneValue] = useState()
    const [emailValue,setEmailValue] = useState()
    //Combine to one inut change
    const phoneInputChange = (e) => {
        console.log('input')
        
        setPhoneValue(e.target.value)
    }
    const emailInputChange = (e) => {
        console.log('input email')
        
        setPhoneValue(e.target.value)
    }


    return (
              <section className="details">
                <div className="profiel-col">
                    <p className="profile-terms">
                        When you join meetings and webinars hosted on Zoom, your profile information, including your name and profile picture, may be visible to other participants. Your name and email address will also be visible to the account owner and host when you join meetings or webinars on their account while you’re signed in. The account owner and others in the meeting can share this information with apps and others.
                    </p>

                    <div className="profile-owner">
                        <img src={avatar} className="avatar" alt="owner avatar"/>
                        <div className="name-username">
                            <h4>{owner.username}</h4>
                            <p>{owner.name}</p>
                        </div>
                        <button>Edit</button>
                    </div>

                    <div className="personal">
                        <h5 className="personal-title">Personal</h5>
                        <p className="phone">Phone</p>
                        <input placeholder="087 2131 232" className="enter-phone" type="number" onChange={phoneInputChange} value={phoneValue}/>
                        <p className="email">Email</p>
                        <input placeholder="087 2131 232" className="enter-email" type="text" onChange={emailInputChange} value={emailValue}/>
                    </div>
                </div>
            </section>
    )
}

export default ProfileBody
