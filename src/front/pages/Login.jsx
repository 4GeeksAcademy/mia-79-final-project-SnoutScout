import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }
            const data = await response.json();
            console.log('Login successful:', data);
            // Save token or user data as needed
            navigate('/'); // Redirect to home page after successful login
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className='container d-flec flex-column aling-items-center justify-content-cneter mt-5'>
            <form onSubmit={handleSubmit} className='w-100' style={{ maxWidth: '400px' }}>
                <div className='mb-3'>
                    <imput
                        type="email"
                        className="form-control"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                {error && <div className='alert alert-danger'>{error}</div>}
                <button type="submit" className='btn w-100 text-whte' style={{ backgroundColor: '#fd7e14', borderRadius: "25px" }}>
                    Log In
                </button>
            </form>
            <p className='mt-3'>
                Don't have an account? <Link to="/registerForm" style={{ color: "green" }}>Sign Up</Link>
            </p>
        </div>
    );
};

export default Login;