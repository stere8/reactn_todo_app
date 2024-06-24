import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {ThemeProvider} from '@mui/material/styles';
import TaskPage from './pages/TaskPage';
import TaskForm from './components/TaskForm'
import UserPage from './pages/UserPage';
import TaskView from './pages/TaskView';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import theme from './theme'; // Import your theme

function App() {
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <NavBar/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/users" element={<UserPage/>}/>
                    <Route path="/tasks" element={<TaskPage/>}/>
                    <Route path="/tasks/add" element={<TaskForm/>}/>
                    <Route path="/tasks/edit/:taskId" element={<TaskForm/>}/>
                    <Route path="/tasks/:taskId" element={<TaskView/>}/> </Routes>
            </div>
        </ThemeProvider>
    );
}

export default App;
