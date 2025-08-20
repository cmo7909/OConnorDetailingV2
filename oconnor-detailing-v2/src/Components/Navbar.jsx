import React, {useState} from "react";
import { Link, useLocation } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
    const {pathname} = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const links = [
        { name: 'Home', path: '/' },
        { name: 'Pricing', path: '/pricing' },
        { name: 'Gallery', path: '/gallery' },
        { name: 'Contact', path: '/contact' },
      ];

    
return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">O'Connor Auto Detailing</Link>
      </div>

      <div
        className={`hamburger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span />
        <span />
        <span />
      </div>

      <ul className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        {links.map(({ name, path }) => (
          <li key={name} onClick={() => setMenuOpen(false)}>
            <Link
              to={path}
              className={pathname === path ? 'active' : ''}
            >
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;