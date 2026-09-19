const activity = Array.from(
    { length: 364 },
    (_, index) => (index * 17 + Math.floor(index / 7) * 3) % 5
);

export function SubmissionActivity() {

    const getActivityColor = (level) => {
        if (level === 0) return "black";
        if (level === 1) return "#333";
        if (level === 2) return "#666";
        if (level === 3) return "#999";
        return "white";
    };

    return (
        <div
            style={{
                border: "1px solid white",
                padding: "10px",
                boxSizing: "border-box",
                marginTop: "10px"
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
                <div>
                    <div
                        style={{
                            fontSize: "12px",
                            fontWeight: "600"
                        }}
                    >
                        Submission Activity
                    </div>

                    <div
                        style={{
                            fontSize: "9px",
                            marginTop: "2px"
                        }}
                    >
                        Demo activity data · 329 submissions in the past year
                    </div>
                </div>

                {/* Statistics */}
                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        fontSize: "9px",
                        alignItems: "center",
                        flexWrap: "wrap",
                        justifyContent: "flex-end"
                    }}
                >
                    <div>
                        12
                        <div>Current streak</div>
                    </div>

                    <div>
                        170
                        <div>Total active days</div>
                    </div>

                    <div>
                        15
                        <div>Max streak</div>
                    </div>

                    <select
                        style={{
                            backgroundColor: "black",
                            color: "white",
                            border: "1px solid white",
                            fontSize: "9px"
                        }}
                    >
                        <option>Past year</option>
                        <option>Past month</option>
                        <option>Past week</option>
                    </select>
                </div>
            </div>

            {/* Heatmap */}
            <div
                style={{
                    overflowX: "auto",
                    paddingBottom: "5px"
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateRows: "repeat(7, 10px)",
                        gridAutoFlow: "column",
                        gridAutoColumns: "10px",
                        gap: "3px",
                        width: "max-content"
                    }}
                >
                    {activity.map((level, index) => (
                        <div
                            key={index}
                            title={`${level} submissions`}
                            style={{
                                width: "10px",
                                height: "10px",
                                backgroundColor:
                                    getActivityColor(level),
                                border: "1px solid #444",
                                boxSizing: "border-box"
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Footer */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "8px",
                    fontSize: "8px"
                }}
            >
                <span>Each square represents a day.</span>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "3px"
                    }}
                >
                    <span>Less</span>

                    {[0, 1, 2, 3, 4].map((level) => (
                        <div
                            key={level}
                            style={{
                                width: "9px",
                                height: "9px",
                                backgroundColor:
                                    getActivityColor(level),
                                border: "1px solid #444"
                            }}
                        />
                    ))}

                    <span>More</span>
                </div>
            </div>
        </div>
    );
}