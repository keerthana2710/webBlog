import React from 'react';
import '../../Css/Footer.css';

const Footer = () => {
    return (
        <div className="footer-container">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>About Us</h3>
                    <p>We are a team of passionate individuals dedicated to providing the best blog experience.</p>
                </div>
                <div className="footer-section">
                    <h3>Contact Us</h3>
                    <p>Email: keerthanacs1012@gmail.com</p>
                    <p>Phone: (123) 456-7890</p>
                </div>
                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="/about">About</a></li>
                        <li><a href="/contact">Contact</a></li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Follow Us</h3>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a><br/>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a><br/>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2024 Keerthana. All Rights Reserved</p>
            </div>
        </div>
    );
};

export default Footer;
