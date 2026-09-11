export function DSAProgress() {
    const topics = [
        {
            name: "Arrays",
            solved: 32,
            total: 50
        },
        {
            name: "Strings",
            solved: 24,
            total: 40
        },
        {
            name: "Linked Lists",
            solved: 18,
            total: 30
        },
        {
            name: "Trees",
            solved: 21,
            total: 35
        },
        {
            name: "Graphs",
            solved: 14,
            total: 30
        },
        {
            name: "Dynamic Programming",
            solved: 12,
            total: 40
        }
    ];

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
                    fontSize: "14px",
                    fontWeight: "600",
                    marginBottom: "12px"
                }}
            >
                DSA Progress
            </div>

            {/* Topics */}
            {topics.map((topic) => {
                const progress = Math.round(
                    (topic.solved / topic.total) * 100
                );

                return (
                    <div
                        key={topic.name}
                        style={{
                            marginBottom: "11px"
                        }}
                    >
                        {/* Topic Info */}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                fontSize: "11px",
                                marginBottom: "4px"
                            }}
                        >
                            <span>{topic.name}</span>

                            <span>
                                {topic.solved}/{topic.total}
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

            {/* View Sheet */}
            <button
                style={{
                    width: "100%",
                    marginTop: "2px",
                    padding: "6px",

                    backgroundColor: "black",
                    color: "white",

                    border: "1px solid white",
                    borderRadius: "4px",

                    fontSize: "11px",
                    cursor: "pointer"
                }}
            >
                View DSA Sheets →
            </button>
        </div>
    );
}