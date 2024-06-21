import React, { useState } from 'react';
import axios from 'axios';
import { ApiConnectionReplacement} from '../src/Enviromental Variables/APIConnection';

export const FirebaseTokenGenerator = () => {
    const [name, setName] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState('');

    const generateToken = async (role) => {
        try {
            const response = await axios.post(`${ApiConnectionReplacement()}/firebase/generate${role}Token`, { name });
            setToken(response.data);
            setError('');
        } catch (error) {
            setToken('');
            setError(error.response?.data || 'Error occurred while generating token.');
        }
    };

    const copyTokenToClipboard = () => {
        navigator.clipboard.writeText(token)
            .then(() => {
                alert('Token copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy token: ', err);
                alert('Failed to copy token. Please try again.');
            });
    };

    return (
        <div className="container mt-5 bg-light p-2 ">
            <h2>Firebase Token Generator</h2>
            <div className="mb-3">
                <label className="form-label text-dark">Name:</label>
                <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <button className="btn btn-primary me-2" onClick={() => generateToken('Student')}>Generate Student Token</button>
                <button className="btn btn-primary me-2" onClick={() => generateToken('Teacher')}>Generate Teacher Token</button>
                <button className="btn btn-primary me-2" onClick={() => generateToken('Test')}>Generate Test Token</button>
                <button className="btn btn-primary me-2" onClick={() => generateToken('School')}>Generate School Token</button>
            </div>
            {token && (
                <div className="mt-3">
                    <h3>Generated Token:</h3>
                    <div className="d-flex align-items-center">
                        <pre>{token}</pre>
                        <button className="btn btn-secondary ms-3" onClick={copyTokenToClipboard}>Copy Token</button>
                    </div>
                </div>
            )}
            {error && (
                <div className="mt-3">
                    <div className="alert alert-danger">
                        <h3>Error:</h3>
                        <p>{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FirebaseTokenGenerator;
