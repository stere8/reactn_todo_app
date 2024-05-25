import logo from './logo.svg';
import './App.css';
import TaskList from './components/TaskList';
import UserList from './components/UsersList';

function App() {
  return (
    <div className="App">
       <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/users" element={<UserList />} />
        </Routes>

    </div>
  );
}

export default App;
