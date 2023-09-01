import './App.css';
import { Route } from 'react-router-dom/cjs/react-router-dom.min';
import { ChatPage } from './Pages/chatApp';
import HomePage from './Pages/HomePage';
function App() {
  return (
    <div className="App">
      <Route path="/" component={HomePage} exact ></Route>
      <Route path="/chats" component={ChatPage} exact ></Route>
    </div>
  );
}

export default App;
