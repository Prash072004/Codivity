import { Link } from "react-router";
import { NavLink } from "./NavLink";
import { useEffect, useState } from "react";

export function Navbar({showAuth = true}) {
    const [isAuthenticated, setIsAuthenticated] = useState(() =>
        Boolean(localStorage.getItem("token"))
    );

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(Boolean(localStorage.getItem("token")));
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return <div style={{display: "flex", alignItems: "center", backgroundColor: "black", color: "white", border: "1px solid white", borderRadius: "8px", padding: "10px 12px"}}>
        {/* Logo */}
        <div>
            <Link to="/" style={{textDecoration: "none", color: "white", fontSize: "20px", fontWeight: "600"}}>Codivity</Link>
        </div>

        {/* Navigation Links */}
        <div style={{display: "flex", gap: "10px", marginLeft: "120px"}}>
            <NavLink to="/problem-set">Problem Set</NavLink>
            <NavLink to="/custom-contest">Custom Contest</NavLink>
            <NavLink to="/leaderboard">Leaderboard</NavLink>
            <NavLink to="/discuss">Discuss</NavLink>
            <NavLink to="/about">About</NavLink>
        </div>

        {/* Authentication */}
        {showAuth && !isAuthenticated && (
            <div style={{display: "flex", gap: "10px", marginLeft: "auto"}}>
                <NavLink to="/signin">Login</NavLink>
                <NavLink to="/signup">Sign Up</NavLink>
            </div>
        )}

        {showAuth && isAuthenticated && (
            <div style={{display: "flex", gap: "10px", marginLeft: "auto"}}>
                <NavLink to="/profile">Profile</NavLink>
            </div>
        )}
    </div>
}