import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store'; // Adjust the import path if needed
import { TestQuestNavbar } from './TestQuestNavbar';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store ={store}>
        <BrowserRouter>
            <TestQuestNavbar/>
            <App />
        </BrowserRouter>
        </Provider>
    </React.StrictMode>
);
