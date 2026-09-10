export function ProfileHeader() {
    return (
        <div
            style={{
                border: "1px solid white",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                boxSizing: "border-box",
                minHeight: "68px"
            }}
        >
            {/* Avatar */}
            <div
                style={{
                    width: "50px",
                    height: "50px",
                    border: "1px solid white",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    flexShrink: 0
                }}
            >
                P
            </div>

            {/* User Information */}
            <div
                style={{
                    marginLeft: "10px",
                    lineHeight: "1.2"
                }}
            >
                <div
                    style={{
                        fontSize: "14px",
                        fontWeight: "600"
                    }}
                >
                    Prashant
                </div>

                <div
                    style={{
                        fontSize: "12px"
                    }}
                >
                    @prashant001
                </div>

                <div
                    style={{
                        fontSize: "11px"
                    }}
                >
                    Joined Aug 2026
                </div>

                <div
                    style={{
                        fontSize: "11px",
                        fontStyle: "italic",
                        marginTop: "2px"
                    }}
                >
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