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
                padding: "10px",
                boxSizing: "border-box",
                width: "260px",
                minHeight: "68px"
            }}
        >
            {/* Title */}
            <div
                style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    marginBottom: "8px"
                }}
            >
                Difficulty Breakdown
            </div>

            {/* Difficulty Rows */}
            {difficulty.map((item) => {
                const progress =
                    (item.solved / item.total) * 100;

                return (
                    <div
                        key={item.name}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "6px",
                            fontSize: "10px"
                        }}
                    >
                        <span
                            style={{
                                width: "45px"
                            }}
                        >
                            {item.name}
                        </span>

                        <div
                            style={{
                                flex: 1,
                                height: "5px",
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

                        <span>
                            {item.solved}/{item.total}
                        </span>
                    </div>
                );
            })}

            {/* Overall */}
            <div
                style={{
                    textAlign: "right",
                    marginTop: "6px",
                    fontSize: "11px"
                }}
            >
                Overall: {percentage}%
            </div>
        </div>
    );
}