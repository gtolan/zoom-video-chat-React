import Navbar from './components/Navbar.js';
import './App.scss';
import HomePage from './components/HomePage.js';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";


function App() {
  return (
    <Router>
    <div className="App">
     
        <header className="App-header">
          <Navbar/>
        </header>

        <Switch>
          <Route path="/about">
            <h1>ZZOOM aBOUT</h1>
          </Route>
          <Route path="/users">
             <h1>ZZOOM users</h1>
          </Route>
          <Route path="/" exact>

            <HomePage/>
          </Route>
        </Switch>
          
     
      
    </div>
    </Router>
  );
}

export default App;
