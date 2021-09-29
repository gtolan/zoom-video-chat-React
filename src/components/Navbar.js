import '../styles/Navbar.scss';
import { Link } from 'react-router-dom';
import zzoomLogo from '../images/zzoomLogo.png';
import { useEffect, useState } from 'react';

const Navbar = () => {
    console.log('Navbar render')

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
                        Host a meeting
                    </span>
                </button> 
                <button className="tab-btn sign-in">
                    Sign in
                </button>  
                <button className="tab-btn sign-up">
                    Sign up, it's free
                </button>  
                <button className="tab-btn hamburger">
                    HAM
                </button>      
            </div>
        </nav>
    )
}

export default Navbar
