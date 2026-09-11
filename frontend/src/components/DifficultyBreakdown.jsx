export function DifficultyBreakdown() {
    const difficulty = [
        {
            name: "Easy",
            solved: 46,
            total: 100
        },
        {
            name: "Medium",
            solved: 40,
            total: 100
        },
        {
            name: "Hard",
            solved: 67,
            total: 100
        }
    ];

    const totalSolved = difficulty.reduce(
        (sum, item) => sum + item.solved,
        0
    );

    const totalProblems = difficulty.reduce(
        (sum, item) => sum + item.total,
        0
    );

    const percentage = Math.round(
        (totalSolved / totalProblems) * 100
    );

    return (
        <div
            style={{
                border: "1px solid white",
                padding: "12px",
                boxSizing: "border-box",
                width: "260px"
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "12px"
                }}
            >
                <span
                    style={{
                        fontSize: "14px",
                        fontWeight: "600"
                    }}
                >
                    Difficulty
                </span>

                <span
                    style={{
                        fontSize: "11px"
                    }}
                >
                    {totalSolved} / {totalProblems}
                </span>
            </div>

            {/* Difficulty Rows */}
            {difficulty.map((item) => {
                const progress = Math.round(
                    (item.solved / item.total) * 100
                );

                return (
                    <div
                        key={item.name}
                        style={{
                            marginBottom: "10px"
                        }}
                    >
                        {/* Label */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "11px",
                                marginBottom: "4px"
                            }}
                        >
                            <span>{item.name}</span>

                            <span>
                                {item.solved}/{item.total}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div
                            style={{
                                width: "100%",
                                height: "6px",
                                border: "1px solid white",
                                boxSizing: "border-box"
                            }}
                        >
                            <div
                                style={{
                                    width: `${progress}%`,
                                    height: "100%",
                                    backgroundColor: "white"
                                }}
                            />
                        </div>
                    </div>
                );
            })}

            {/* Overall */}
            <div
                style={{
                    borderTop: "1px solid white",
                    paddingTop: "10px",
                    marginTop: "4px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <span
                    style={{
                        fontSize: "11px"
                    }}
                >
                    Overall Progress
                </span>

                <span
                    style={{
                        fontSize: "14px",
                        fontWeight: "600"
                    }}
                >
                    {percentage}%
                </span>
            </div>
        </div>
    );
}