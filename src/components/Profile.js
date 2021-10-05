import { Link } from 'react-router-dom';
import '../styles/Profile.scss';
import { useState } from 'react';
import ProfileBody from './ProfileBody';
import ProfileFooter from './ProfileFooter';

//Uses 'ul' instead of 'select' for animation and easier styling
const Profile = () => {
    const [menuIsOpen, setToggleMenu] = useState(true)
    const toggleMenu = () => {
        console.log('toggle menu',menuIsOpen)
        setToggleMenu(!menuIsOpen);
    }

    const [selectedOption, setSelectedOption] = useState('Profile')
    return (
        <main className="profile">
            <section className="menu">
                <h4 onClick={toggleMenu} className={`selected-option`}>{selectedOption}
                    <span className={`down-arrow ${menuIsOpen ? 'active' : ''}`}>&#9660;</span></h4>
                <div className="menu-container">
                    <div className={`menu-slide ${menuIsOpen ? 'active' : ''}`}>
                        <ul default="profile" >
                            <li disabled className="title">Personal</li>
                            <li >Profile</li>
                            <li >Meetings</li>
                            <li >Settings</li>
                        </ul>
                        <ul>
                            <li disabled ="title" className="title">Admin</li>
                            <li >User Management</li>
                            <li >Account Management</li>
                            <li >Advanced</li>
                        </ul>
                           <ProfileBody/>
                    </div>
                 
                    
                </div>
            </section>
            
            <ProfileFooter/>
        </main>
    )
}

export default Profile
