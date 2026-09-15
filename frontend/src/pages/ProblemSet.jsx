import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import api from "../services/api";
import { Navbar } from "../components/Navbar";

export function ProblemSet() {
    const { slug } = useParams();

    const [problem, setProblem] = useState(null);
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                if (slug) {
                    const response = await api.get(`/problems/${slug}`);
                    setProblem(response.data.problem);
                } else {
                    const response = await api.get("/problems");
                    setProblems(response.data.problems);
                }
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load problem"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProblem();
    }, [slug]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div style={{ padding: "30px", color: "white" }}>
                    Loading problem...
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div style={{ padding: "30px", color: "white" }}>
                    {error}
                </div>
            </>
        );
    }

    if (!slug) {
        return (
            <div>
                <Navbar />
                <main style={{ maxWidth: "1000px", margin: "30px auto", padding: "0 20px", color: "white" }}>
                    <h1>Problem Set</h1>
                    {problems.map((item) => (
                        <article key={item._id} style={{ marginTop: "20px" }}>
                            <h2>
                                <Link style={{ color: "white" }} to={`/problem/${item.slug}`}>
                                    {item.title}
                                </Link>
                            </h2>
                            <p>{item.difficulty}</p>
                        </article>
                    ))}
                </main>
            </div>
        );
    }

    return (
        <div>
            <Navbar />

            <main
                style={{
                    maxWidth: "1000px",
                    margin: "30px auto",
                    padding: "0 20px",
                    color: "white"
                }}
            >
                <h1>{problem.title}</h1>

                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "25px"
                    }}
                >
                    <span>{problem.difficulty}</span>

                    {problem.topics?.map((topic) => (
                        <span key={topic._id}>
                            {topic.name}
                        </span>
                    ))}
                </div>

                <section>
                    <p>{problem.description}</p>
                </section>

                <section style={{ marginTop: "30px" }}>
                    <h2>Input Format</h2>
                    <p>{problem.inputFormat}</p>
                </section>

                <section style={{ marginTop: "30px" }}>
                    <h2>Output Format</h2>
                    <p>{problem.outputFormat}</p>
                </section>

                <section style={{ marginTop: "30px" }}>
                    <h2>Examples</h2>

                    {problem.examples?.map((example, index) => (
                        <div
                            key={index}
                            style={{
                                border: "1px solid white",
                                borderRadius: "8px",
                                padding: "15px",
                                marginTop: "15px"
                            }}
                        >
                            <h3>{example.title}</h3>

                            <p>
                                <strong>Input:</strong>
                            </p>

                            <pre>{example.input}</pre>

                            <p>
                                <strong>Output:</strong>
                            </p>

                            <pre>{example.output}</pre>

                            {example.explanation && (
                                <>
                                    <p>
                                        <strong>
                                            Explanation:
                                        </strong>
                                    </p>

                                    <p>
                                        {example.explanation}
                                    </p>
                                </>
                            )}
                        </div>
                    ))}
                </section>

                <section style={{ marginTop: "30px" }}>
                    <h2>Constraints</h2>
                    <pre>{problem.constraints}</pre>
                </section>
            </main>
        </div>
    );
}