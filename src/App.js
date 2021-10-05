import Navbar from './components/Navbar.js';
import './App.scss';
import HomePage from './components/HomePage.js';
import FAQs from './components/FAQs.js';
import Footer from './components/Footer';
import {
  Switch,
  Route
} from "react-router-dom";
import MeetingRoom from './components/MeetingRoom.js';
// import Caller from './components/Caller';
// import Callee from './components/Callee';
import ChatRoom from './components/ChatRoom';
import Profile from './components/Profile';
import SignIn from './components/SignIn.js';

function App() {
  return (
    
      <div className="App">
      
          <header className="App-header">
          <Navbar/>
          </header>

            <Switch>
              <Route path="/sign-in">
                <SignIn/>
              </Route>
              <Route path="/meeting-room/:roomID">
                <ChatRoom/>
              </Route>
              <Route path="/profile">
                <Profile/>
              </Route>
              <Route path="/faq">
                <FAQs/>
              </Route>
              <Route path="/users">
                <h1>ZZOOM users</h1>
              </Route>
              <Route path="/" exact>
                <HomePage/>
              </Route>
            </Switch>
          
          <Footer/>
            
      </div>
  );
}

export default App;
