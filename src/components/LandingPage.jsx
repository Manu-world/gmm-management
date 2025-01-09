import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => (
  <div>
    <h1>Welcome to the Landing Page</h1>

    <Link to="/login">Login</Link>
  </div>
);

export default LandingPage;
