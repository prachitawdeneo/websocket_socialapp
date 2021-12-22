import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import './App.css';
import AddPost from './components/AddPost';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/register' exact element={<Register/>}/>
          <Route path='/' exact element={<Login/>}/>
          <Route path='/dashboard' exact element={<Dashboard/>}/>
          <Route path='/addpost' exact element={<AddPost/>}/>
        </Routes>
      </Router>
     
    </div>
  );
}

export default App;
