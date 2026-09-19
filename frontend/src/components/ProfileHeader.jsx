export function ProfileHeader({ user }) {
    const username = user?.username || "User";
    const createdAt = user?.createdAt;
    const joinedDate = createdAt ? new Date(createdAt).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }) : "";

    return (
        <div style={{ border: "1px solid white", padding: "16px", display: "flex", alignItems: "center", boxSizing: "border-box", minHeight: "116px", gap: "12px" }}>
            
            {/* Avatar */}
            <div style={{ width: "64px", height: "64px", border: "1px solid white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>
                {username.charAt(0).toUpperCase()}
            </div>

            {/* User Information */}
            <div style={{ lineHeight: "1.35", minWidth: 0 }}>
                
                <div style={{ fontSize: "18px", fontWeight: "600" }}>
                    {username}
                </div>

                {/* Handle */}
                <div style={{ fontSize: "12px", color: "#bbb" }}>
                    @{username}
                </div>

                {/* Joined Date */}
                <div style={{ fontSize: "11px", marginTop: "5px" }}>
                    Joined {joinedDate}
                </div>

                <div style={{ fontSize: "11px", fontStyle: "italic", color: "#aaa", marginTop: "3px" }}>
                    "Consistent practice leads to progress."
                </div>

            </div>

            {/* Edit Profile */}
            <button
                style={{
                    marginLeft: "auto",
                    backgroundColor: "black",
                    color: "white",
                    border: "1px solid white",
                    borderRadius: "2px",
                    padding: "7px 10px",
                    fontSize: "11px",
                    cursor: "pointer",
                    flexShrink: 0
                }}
            >
                Edit Profile
            </button>
        </div>
    );
}