export function ProblemStatement({ problem }) {
    return (
        <div
            style={{
                color: "white",
                height: "100%",
                overflowY: "auto",
                padding: "15px",
                boxSizing: "border-box"
            }}
        >
            {/* Title */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "20px"
                }}
            >
                <h2
                    style={{
                        margin: 0
                    }}
                >
                    {problem.title}
                </h2>

                <span
                    style={{
                        border: "1px solid white",
                        borderRadius: "15px",
                        padding: "4px 10px",
                        fontSize: "12px"
                    }}
                >
                    {problem.difficulty}
                </span>
            </div>

            {/* Description */}
            <p>
                {problem.description}
            </p>

            {/* Input Format */}
            <section
                style={{
                    marginTop: "25px"
                }}
            >
                <h3>Input Format</h3>

                <p>
                    {problem.inputFormat}
                </p>
            </section>

            {/* Output Format */}
            <section
                style={{
                    marginTop: "25px"
                }}
            >
                <h3>Output Format</h3>

                <p>
                    {problem.outputFormat}
                </p>
            </section>

            {/* Examples */}
            <section
                style={{
                    marginTop: "25px"
                }}
            >
                <h3>Examples</h3>

                {problem.examples?.map((example, index) => (
                    <div
                        key={index}
                        style={{
                            marginTop: "15px"
                        }}
                    >
                        <strong>
                            {example.title}
                        </strong>

                        <div
                            style={{
                                border: "1px solid white",
                                padding: "12px",
                                marginTop: "8px",
                                borderRadius: "4px"
                            }}
                        >
                            <div>
                                <strong>Input:</strong>
                            </div>

                            <pre
                                style={{
                                    whiteSpace: "pre-wrap",
                                    margin: "8px 0"
                                }}
                            >
                                {example.input}
                            </pre>

                            <div>
                                <strong>Output:</strong>
                            </div>

                            <pre
                                style={{
                                    whiteSpace: "pre-wrap",
                                    margin: "8px 0"
                                }}
                            >
                                {example.output}
                            </pre>

                            {example.explanation && (
                                <div>
                                    <strong>
                                        Explanation:
                                    </strong>

                                    <p>
                                        {example.explanation}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </section>

            {/* Constraints */}
            <section
                style={{
                    marginTop: "25px"
                }}
            >
                <h3>Constraints</h3>

                <pre
                    style={{
                        whiteSpace: "pre-wrap"
                    }}
                >
                    {problem.constraints}
                </pre>
            </section>

            {/* Topics */}
            <section
                style={{
                    marginTop: "25px",
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap"
                }}
            >
                {problem.topics?.map((topic) => (
                    <span
                        key={topic._id}
                        style={{
                            border: "1px solid white",
                            borderRadius: "15px",
                            padding: "4px 10px",
                            fontSize: "12px"
                        }}
                    >
                        {topic.name}
                    </span>
                ))}
            </section>
        </div>
    );
}