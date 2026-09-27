import { Navbar } from "../components/Navbar";
import { ProfileSidebar } from "../components/ProfileSidebar";
import { ProfileHeader } from "../components/ProfileHeader";
import { SubmissionActivity } from "../components/SubmissionActivity";
import { RecentActivity } from "../components/RecentActivity";
import { DifficultyBreakdown } from "../components/DifficultyBreakdown";
import { DSAProgress } from "../components/DSAProgress";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../services/api";

export function Profile() {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/profile");
                
                setUser(response.data.user);
            } catch (err) {
                console.error("Profile error: ", err);

                // Handle expired/invalid/missing JWT
                if (err.response?.status === 401) {
                    navigate("/signin");
                    return;
                }

                setError(err.response?.data?.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    // Loading state
    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    backgroundColor: "black",
                    color: "white",
                    padding: "12px"
                }}
            >
                <Navbar showAuth={false} />

                <div
                    style={{
                        marginTop: "10px",
                        border: "1px solid white",
                        padding: "20px",
                        textAlign: "center"
                    }}
                >
                    Loading profile...
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    backgroundColor: "black",
                    color: "white",
                    padding: "12px"
                }}
            >
                <Navbar showAuth={false} />

                <div
                    style={{
                        marginTop: "10px",
                        border: "1px solid white",
                        padding: "20px",
                        textAlign: "center"
                    }}
                >
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "black", color: "white", padding: "12px", boxSizing: "border-box" }}>
            
            <Navbar showAuth={false} />

            <div style={{ display: "flex", gap: "10px", marginTop: "10px", border: "1px solid white", padding: "10px", boxSizing: "border-box", alignItems: "flex-start", flexWrap: "wrap" }}>
                <ProfileSidebar />

                <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(220px, 260px)", gap: "10px", flex: "1 1 620px", minWidth: 0 }}>
                    <div style={{ minWidth: 0 }}>
                        <ProfileHeader user={user} />
                        <SubmissionActivity />
                        <RecentActivity />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: 0 }}>
                        <DifficultyBreakdown />
                        <DSAProgress />
                    </div>
                </div>
            </div>
        </div>
    );
}