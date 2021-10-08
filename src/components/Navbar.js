import '../styles/Navbar.scss';
import { Link, useHistory, useLocation } from 'react-router-dom';
import zzoomLogo from '../images/zzoomLogo.png';
import { useState } from 'react';



const Navbar = () => {
    console.log('Navbar render')
    const location = useLocation()
    const history = useHistory()
    console.log(location.pathname, 'loco')
    const { pathname } = location;
    
    const createMeeting = () => {
        history.push('/host-meeting-room')
    }

    const [hamburderIsOpen, setHamburgerToggle] = useState(false)

    const toggleHamburder = () => {
            setHamburgerToggle(!hamburderIsOpen);
    }

    return (
        <nav className={pathname.includes('meeting-room') ? 'chat-room' : ''}>   
            <div className="left-nav">
                <Link to="/">
                    <img src={zzoomLogo} alt="zzoom page logo" className="logo-img" />
                </Link>
            </div>
            <div className="right-nav">
                    <Link to="/join-meeting-room/" className="tab-btn nav-btn-link">
                    <span className="mobile">
                        Join
                    </span>
                    <span className="desktop">
                        Join a meeting
                    </span>
                    </Link>
          
                <button className="tab-btn host" onClick={createMeeting}>
                    <span className="mobile">
                        Host
                    </span>
                    <span className="desktop">
                        Host a meeting <span className="menu-chevron">{'\u25BC'}</span>
                    </span>
                    <span className="desktop menu-dropdown">
                        <ul>
                            <li><Link to="/meeting-room">With Video Off</Link></li>
                            <li><Link to="/meeting-room">With Video On</Link></li>
                            <li><Link to="/meeting-room">Screen Share Only</Link></li>
                        </ul>
                    </span>
                </button> 
                {/* <button className="tab-btn sign-in"> */}
                    <Link to="/sign-in" className="tab-btn sign-in nav-btn-link">
                    Sign in
                    </Link>
                {/* </button>   */}
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
