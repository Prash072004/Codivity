import { Link } from "react-router";
import { NavLink } from "./NavLink";
import { useEffect, useState } from "react";
import api from "../services/api";

export function Navbar({showAuth = true}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        let cancelled = false;

        api.get("/profile")
            .then(() => {
                if (!cancelled) setIsAuthenticated(true);
            })
            .catch(() => {
                if (!cancelled) setIsAuthenticated(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return <div style={{display: "flex", alignItems: "center", backgroundColor: "black", color: "white", border: "1px solid white", borderRadius: "8px", padding: "10px 12px"}}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
            <img src="/codivity-logo.png" alt="Codivity"
                className="h-14 w-auto object-contain"
            />
        </Link>

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