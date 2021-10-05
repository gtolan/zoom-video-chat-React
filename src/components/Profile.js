import { Link } from 'react-router-dom';
import '../styles/Profile.scss';
import { useState } from 'react';


//Uses 'ul' instead of 'select' for animation and easier styling
const Profile = () => {
    const [menuIsOpen, setToggleMenu] = useState(true)
    const toggleMenu = () => {
        console.log('toggle menu')
    }

    const [selectedOption, setSelectedOption] = useState('Profile')
    return (
        <main className="profile">
            <section className="menu">
                <h4 onClick={toggleMenu} className={`selected-option ${menuIsOpen ? 'active' : ''}`}>{selectedOption}<span className="down-arrow">&#9660;</span></h4>
                <div className="menu-container">
                <div className="menu-slide">
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
                </div>
                </div>
            </section>
            <section className="details">
                <ul>

                </ul>
            </section>
            
        </main>
    )
}

export default Profile
