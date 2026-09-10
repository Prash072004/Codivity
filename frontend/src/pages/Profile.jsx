import { Navbar } from "../components/Navbar";
import { ProfileSidebar } from "../components/ProfileSidebar";
import { ProfileHeader } from "../components/ProfileHeader";
import { DifficultyBreakdown } from "../components/DifficultyBreakdown";
import { SubmissionActivity } from "../components/SubmissionActivity";
import { RecentActivity } from "../components/RecentActivity";
import { DSAProgress } from "../components/DSAProgress";

export function Profile() {
    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "black",
                color: "white",
                padding: "12px",
                boxSizing: "border-box"
            }}
        >
            <Navbar showAuth={false} />

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "10px",
                    border: "1px solid white",
                    padding: "10px",
                    boxSizing: "border-box"
                }}
            >
                {/* Sidebar */}
                <ProfileSidebar />

                {/* Main Content */}
                <div
                    style={{
                        flex: 1,
                        minWidth: 0
                    }}
                >
                    <ProfileHeader />
                    
                    {/* Submission Activity */}
                    <SubmissionActivity />

                    <RecentActivity />
                    
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: "10px", width: "260px"}}>
                    <DifficultyBreakdown />
                    <DSAProgress />
                </div>
                
            </div>

            
        </div>
    );
}