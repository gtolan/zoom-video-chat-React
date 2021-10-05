import { Link } from 'react-router-dom';
import '../styles/Profile.scss';
import { useState } from 'react';


//Uses 'ul' instead of 'select' for animation and easier styling
const Profile = () => {


    const [selectedOption, setSelectedOption] = useState('Profile')
    return (
        <main className="profile">
            <section className="menu">
                <h4 className="selected-option">{selectedOption}</h4>
                <ul default="profile" >
                    <li disabled className="profile-title">Personal</li>
                    <li ><Link to="profile">Profile</Link></li>
                    <li ><Link to="meetings">Meetings</Link></li>
                    <li ><Link to="settings">Settings</Link></li>
                </ul>
                <ul>
                    <li disabled ="admin-title" className="menu-title">Admin</li>
                    <li ><Link to="user-management">User Management</Link></li>
                    <li ><Link to="account-management">Account Management</Link></li>
                    <li ><Link to="advanced">Advanced</Link></li>
                </ul>
            </section>
            <section className="details">
                <ul>

                </ul>
            </section>
            
        </main>
    )
}

export default Profile
