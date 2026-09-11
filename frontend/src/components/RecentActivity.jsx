export function RecentActivity() {
    const activities = [
        {
            problem: "Two Sum",
            difficulty: "Easy",
            status: "Accepted",
            time: "2h ago"
        },
        {
            problem: "Binary Search",
            difficulty: "Easy",
            status: "Accepted",
            time: "5h ago"
        },
        {
            problem: "Longest Substring",
            difficulty: "Medium",
            status: "Accepted",
            time: "1d ago"
        },
        {
            problem: "Merge Intervals",
            difficulty: "Medium",
            status: "Wrong Answer",
            time: "2d ago"
        },
        {
            problem: "Trapping Rain Water",
            difficulty: "Hard",
            status: "Accepted",
            time: "3d ago"
        }
    ];

    return (
        <div
            style={{
                border: "1px solid white",
                padding: "12px",
                marginTop: "10px",
                boxSizing: "border-box"
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px"
                }}
            >
                <div
                    style={{
                        fontSize: "14px",
                        fontWeight: "600"
                    }}
                >
                    Recent Activity
                </div>

                <button
                    style={{
                        backgroundColor: "black",
                        color: "white",
                        border: "1px solid white",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        fontSize: "10px",
                        cursor: "pointer"
                    }}
                >
                    View All →
                </button>
            </div>

            {/* Activity List */}
            <div>
                {activities.map((activity, index) => (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "9px 0",

                            borderTop:
                                index !== 0
                                    ? "1px solid #333"
                                    : "none"
                        }}
                    >
                        {/* Problem */}
                        <div
                            style={{
                                flex: 1,
                                fontSize: "12px",
                                fontWeight: "500"
                            }}
                        >
                            {activity.problem}
                        </div>

                        {/* Difficulty */}
                        <div
                            style={{
                                width: "65px",
                                fontSize: "10px"
                            }}
                        >
                            {activity.difficulty}
                        </div>

                        {/* Status */}
                        <div
                            style={{
                                width: "85px",
                                fontSize: "10px",
                                fontWeight: "500",
                                color:
                                    activity.status === "Accepted"
                                        ? "white"
                                        : "#999"
                            }}
                        >
                            {activity.status}
                        </div>

                        {/* Time */}
                        <div
                            style={{
                                width: "50px",
                                textAlign: "right",
                                fontSize: "10px",
                                color: "#aaa"
                            }}
                        >
                            {activity.time}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}