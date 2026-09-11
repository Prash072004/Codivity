export function ProfileHeader({ user }) {
    const username = user?.username || "User";
    const createdAt = user?.createdAt;
    const joinedDate = createdAt ? new Date(createdAt).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }) : "";

    return (
        <div style={{ border: "1px solid white", padding: "10px", display: "flex", alignItems: "center", boxSizing: "border-box", minHeight: "68px" }}>
            
            {/* Avatar */}
            <div style={{ width: "50px", height: "50px", border: "1px solid white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0}}>
                {username.charAt(0).toUpperCase()}
            </div>

            {/* User Information */}
            <div style={{ marginLeft: "10px", lineHeight: "1.2" }}>
                
                <div style={{ fontSize: "14px", fontWeight: "600" }}>
                    {username}
                </div>

                {/* Handle */}
                <div style={{ fontSize: "12px" }}>
                    @{username}
                </div>

                {/* Joined Date */}
                <div style={{ fontSize: "11px"}}>
                    Joined {joinedDate}
                </div>

                <div style={{ fontSize: "11px", fontStyle: "italic", marginTop: "2px" }}>
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
                    borderRadius: "4px",
                    padding: "4px 8px",
                    fontSize: "11px",
                    cursor: "pointer"
                }}
            >
                Edit Profile
            </button>
        </div>
    );
}