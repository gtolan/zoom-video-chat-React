import { Link } from 'react-router-dom';
import '../styles/Footer.scss';


const Footer = () => {
    const year = new Date().getFullYear()
    return (
        <footer>
            <p className="copyright">
                ©{year} ZZOOM Video inc. All rights reserved. No privacy and terms :)</p>
            <div className="footer-tabs">
                <Link to="/help">Support</Link>
                <Link to="/help">English</Link>
            </div>
        </footer>
    )
}

export default Footer
