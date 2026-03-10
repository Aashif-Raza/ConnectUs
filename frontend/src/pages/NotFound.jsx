import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/notfound.css';

export default function NotFound() {
    return (
        <div className="nf-root">
            <div className="nf-content">
                <span className="nf-code">404</span>
                <h1 className="nf-title">Page not found.</h1>
                <p className="nf-sub">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link to="/" className="nf-link">← Back to ConnectUs</Link>
            </div>
        </div>
    );
}
