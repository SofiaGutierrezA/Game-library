import "./NavBar.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

function Navbar() {
    return (
        <nav className="navbar">
            <h2 className="navbar-title">Game Library</h2>

            
        <ul className="navbar-menu">
            <li><Link to="/account"> <FontAwesomeIcon icon={faUser} /></Link></li>
        </ul>

                

        </nav>
        
    )
}

export default Navbar;