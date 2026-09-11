import { NavLink } from "react-router";
import { User, FileCheckCorner, Trophy, Sheet, Settings } from "lucide-react";

export function ProfileSidebar() {
    const items = [
        {
            label: "Profile",
            path: "/profile",
            icon: <User />
        },
        {
            label: "Submissions",
            path: "/submissions",
            icon: <FileCheckCorner />
        },
        {
            label: "Custom Contests",
            path: "/custom-contests",
            icon: <Trophy />
        },
        {
            label: "DSA Sheets",
            path: "/sheets",
            icon: <Sheet />
        },
        {
            label: "Settings",
            path: "/settings",
            icon: <Settings />
        }
    ];

    return (
        <div style={{ width: "160px", border: "1px solid white", padding: "10px 0", boxSizing: "border-box", flexShrink: 0 }}>
            
            {items.map((item, index) => (
                               <NavLink
                    key={item.label}
                    to={item.path}
                    style={({ isActive }) => ({
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",

                        padding: "10px",

                        color: isActive ? "black" : "white",
                        backgroundColor: isActive ? "white" : "black",

                        textDecoration: "none",

                        borderBottom:
                            index !== items.length - 1
                                ? "1px solid white"
                                : "none",

                        fontSize: "13px",

                        boxSizing: "border-box"
                    })}
                >
                    <span
                        style={{
                            width: "18px",
                            textAlign: "center",
                            fontSize: "16px",
                            flexShrink: 0
                        }}
                    >
                        {item.icon}
                    </span>

                    <span>
                        {item.label}
                    </span>
                </NavLink>
            ))}
        </div>
    );
}