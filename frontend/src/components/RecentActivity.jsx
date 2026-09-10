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
                boxSizing: "border-box",
                flex: 1,
                minWidth: 0
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px"
                }}
            >
                <div
                    style={{
                        fontSize: "12px",
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
                        padding: "3px 7px",
                        fontSize: "9px",
                        cursor: "pointer"
                    }}
                >
                    View All
                </button>
            </div>

            {activities.map((activity, index) => (
                <div
                    key={index}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 70px 80px 45px",
                        gap: "8px",
                        alignItems: "center",
                        padding: "8px 0",
                        borderBottom:
                            index !== activities.length - 1
                                ? "1px solid #444"
                                : "none",
                        fontSize: "9px"
                    }}
                >
                    <span>{activity.problem}</span>

                    <span>
                        {activity.difficulty}
                    </span>

                    <span>
                        {activity.status}
                    </span>

                    <span
                        style={{
                            textAlign: "right"
                        }}
                    >
                        {activity.time}
                    </span>
                </div>
            ))}
        </div>
    );
}