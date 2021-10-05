import '../styles/Navbar.scss';
import { Link } from 'react-router-dom';
import zzoomLogo from '../images/zzoomLogo.png';
import { useState } from 'react';


const Navbar = () => {
    console.log('Navbar render')

    const [hamburderIsOpen, setHamburgerToggle] = useState(false)

    const toggleHamburder = () => {
            setHamburgerToggle(!hamburderIsOpen);
    }

    return (
        <nav>   
            <div className="left-nav">
                <Link to="/">
                    <img src={zzoomLogo} alt="zzoom page logo" className="logo-img" />
                </Link>
            </div>
            <div className="right-nav">

                <button className="tab-btn join">
                    <span className="mobile">
                        Join
                    </span>
                    <span className="desktop">
                        Join a meeting
                    </span>
                </button>  
                <button className="tab-btn host">
                    <span className="mobile">
                        Host
                    </span>
                    <span className="desktop">
                        Host a meeting <span className="menu-chevron">{'\u25BC'}</span>
                    </span>
                    <span className="desktop menu-dropdown">
                        <ul>
                            <li><Link to="/meeting-room/with-video">With Video Off</Link></li>
                            <li><Link to="/meeting-room/without-video">With Video On</Link></li>
                            <li><Link to="/meeting-room/screen-share">Screen Share Only</Link></li>
                        </ul>
                    </span>
                </button> 
                <button className="tab-btn sign-in">
                    Sign in
                </button>  
                <button className="tab-btn sign-up">
                    Sign up, it's free
                </button>  
                <button className="tab-btn hamburger" onClick={toggleHamburder}>
                    <div className={`hamburger hamburger--3dx ${hamburderIsOpen ? 'is-active' : ''}`}>
                        <div className="hamburger-box">
                        <div className="hamburger-inner"></div>
                        </div>
                    </div>
                    <div className={`hamburger-dropdown-menu ${hamburderIsOpen ? 'is-active' : ''}`}>
                    <ul>
                        <li><Link to="/demo">Request a Demo</Link></li>
                        <li><Link to="/faq">FAQ</Link></li>
                        <li><Link to="/support">Support</Link></li>
                        <li><Link to="/sign-in">Sign In</Link></li>
                        <li><Link to="/sign-up">Sign Up</Link></li>
                    </ul>    
                </div>   
                </button>  
                 
            </div>
        </nav>
    )
}

export default Navbar
