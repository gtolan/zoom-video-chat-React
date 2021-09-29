import '../styles/Navbar.scss';
import { Link } from 'react-router-dom';
import zzoomLogo from '../images/zzoomLogo.png';


const Navbar = () => {
    console.log('Navbar render')
    const screenWidth = window.screen.width;
    console.log(screenWidth)
    return (
        <nav>   
            <div className="left-nav">
                <Link to="/">
                    <img src={zzoomLogo} alt="zzoom page logo" className="logo-img" />
                </Link>
            </div>
            <div className="right-nav">

                <button className="tab-btn join">
                    {screenWidth > 600 ? 'Join a meeting' : 'Join'}
                </button>  
                <button className="tab-btn host">
                    {screenWidth > 600 ? 'Host a meeting' : 'Join'}
                    {screenWidth > 600 ? `chev` : ''}
                </button> 
                <button className="tab-btn sign-in">
                    {screenWidth > 600 ? 'Sign in' : ''}
                </button>  
                <button className="tab-btn sign-up">
                    {screenWidth > 600 ? `Sign up, it's free` : ''}
                </button>      
            </div>
        </nav>
    )
}

export default Navbar
