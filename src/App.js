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


function App() {
  return (
    
      <div className="App">
      
          <header className="App-header">
          <Navbar/>
          </header>

            <Switch>
              <Route path="/about">
                <h1>ZZOOM aBOUT</h1>
              </Route>
              <Route path="/meeting-room/:roomID">
                <MeetingRoom/>
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
