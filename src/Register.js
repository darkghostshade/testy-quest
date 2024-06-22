import React, { useState } from 'react';
import axios from 'axios';
import { ApiConnectionReplacement} from '../src/Enviromental Variables/APIConnection';
import Cookies from 'js-cookie';

export const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        token: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${ApiConnectionReplacement()}/firebase/createUserWithRole`, formData,
            {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('firebaseToken')}`,
                    'Content-Type': 'application/json'
                }
            }
        );
            setSuccessMessage('User registered successfully!');
            setError('');
            console.log(response.data); // Log the response for debugging
        } catch (error) {
            setSuccessMessage('');
            setError(error.response?.data || 'Error occurred while registering user.');
        }
    };

    return (
        <div className="container mt-5 bg-light p-2">
            <h2>Register</h2>
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            {successMessage && <div className="alert alert-success mt-3">{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label text-dark">Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-dark">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-dark">Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-dark">Verification Token:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="token"
                        value={formData.token}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    );
};

export default Register;
