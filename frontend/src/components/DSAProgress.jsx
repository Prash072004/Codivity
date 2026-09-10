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
                    DSA Progress
                </div>

                <span
                    style={{
                        fontSize: "9px"
                    }}
                >
                    View Sheet →
                </span>
            </div>

            {topics.map((topic) => {
                const percentage =
                    (topic.solved / topic.total) * 100;

                return (
                    <div
                        key={topic.name}
                        style={{
                            marginBottom: "10px"
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: "9px",
                                marginBottom: "3px"
                            }}
                        >
                            <span>{topic.name}</span>

                            <span>
                                {topic.solved}/{topic.total}
                            </span>
                        </div>

                        <div
                            style={{
                                width: "100%",
                                height: "5px",
                                border: "1px solid white",
                                boxSizing: "border-box"
                            }}
                        >
                            <div
                                style={{
                                    width: `${percentage}%`,
                                    height: "100%",
                                    backgroundColor: "white"
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}