import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './header.css';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    // Close menu when clicking overlay
    const closeMenu = () => setIsOpen(false);

    return (
        <>
            {/* Overlay */}
            {isOpen && <div className="overlay" onClick={closeMenu}></div>}

            <nav className="navbar">
                <div className="container">
                    <div className="logo">
                        <NavLink to="/">
                            <h1>Abu Hammad</h1>
                        </NavLink>
                    </div>

                    {/* Navigation Links */}
                    <div className={`nav-elements ${isOpen ? 'open' : ''}`}>
                        <ul>
                            <li>
                                <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>Home</NavLink>
                            </li>
                            <li>
                                <NavLink to="/todo" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>Todo</NavLink>
                            </li>
                            <li>
                                <NavLink to="/quiz" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>Quiz</NavLink>
                            </li>
                            <li>
                                <NavLink to="/form" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>Form</NavLink>
                            </li>
                        </ul>
                    </div>

                    {/* Hamburger */}
                    <div
                        className={`hamburger ${isOpen ? 'open' : ''}`}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Header;
