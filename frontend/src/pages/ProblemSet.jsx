import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import api from "../services/api";
import { Navbar } from "../components/Navbar";
import { CheckCircle2, Circle } from "lucide-react";

export function ProblemSet() {
    const { slug } = useParams();

    const [problem, setProblem] = useState(null);
    const [problems, setProblems] = useState([]);
    const [userProgress, setUserProgress] = useState([]);
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
                    setProblems(response.data.problems || []);

                    try {
                        const progressResponse = await api.get("/user-problems");
                        setUserProgress(progressResponse.data.progress || []);
                    } catch {
                        // Unauthenticated users have no progress to show
                    }
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
                    Loading problems...
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
        const progressByProblem = new Map(
            userProgress.map((item) => [
                item.problemId?._id || item.problemId,
                item.status
            ])
        );
        const groupedProblems = problems.reduce((groups, item) => {
            const topicName = item.primaryTopic?.name || "Uncategorized";
            const group = groups.find((entry) => entry.name === topicName);

            if (group) {
                group.problems.push(item);
            } else {
                groups.push({ name: topicName, problems: [item] });
            }

            return groups;
        }, []).sort((first, second) => first.name.localeCompare(second.name));

        return (
            <div style={{ minHeight: "100vh", backgroundColor: "black" }}>
                <Navbar />
                <main style={{ maxWidth: "920px", margin: "34px auto", padding: "0 24px 40px", color: "white", boxSizing: "border-box" }}>
                    <h1 style={{ fontSize: "28px", fontWeight: "600", margin: "0 0 24px" }}>Problem Set</h1>
                    {groupedProblems.length === 0 ? (
                        <p>No problems available.</p>
                    ) : groupedProblems.map((group) => (
                        <section key={group.name} style={{ marginTop: "16px", border: "1px solid white", padding: "18px 20px", boxSizing: "border-box" }}>
                            <h2 style={{ fontSize: "19px", fontWeight: "500", margin: "0 0 18px" }}>{group.name}</h2>
                            <div style={{ display: "flex", paddingBottom: "9px", color: "#aaa", fontSize: "13px", borderBottom: "1px solid white" }}>
                                <div style={{ flex: 1 }}>Problem</div>
                                <div style={{ width: "130px" }}>Difficulty</div>
                                <div style={{ width: "56px", textAlign: "right" }}>Status</div>
                            </div>
                            {group.problems
                                .sort((first, second) => first.title.localeCompare(second.title))
                                .map((item) => {
                                    const status = progressByProblem.get(item._id);

                                    return (
                                        <div key={item._id} style={{ display: "flex", alignItems: "center", minHeight: "46px", padding: "8px 0", borderBottom: "1px solid #333", boxSizing: "border-box" }}>
                                            <div style={{ flex: 1, minWidth: 0, fontSize: "15px" }}>
                                                <Link style={{ color: "white" }} to={`/problem/${item.slug}`}>
                                                    {item.title}
                                                </Link>
                                            </div>
                                            <div style={{ width: "130px", fontSize: "14px", color: item.difficulty === "Easy" ? "#6fce82" : item.difficulty === "Medium" ? "#e6c85c" : "#e87878" }}>
                                                {item.difficulty}
                                            </div>
                                            <div style={{ width: "56px", display: "flex", justifyContent: "flex-end" }} title={status || "Unattempted"}>
                                                {status === "Solved"
                                                    ? <CheckCircle2 size={20} strokeWidth={1.5} />
                                                    : <Circle size={20} strokeWidth={1.5} />}
                                            </div>
                                        </div>
                                    );
                                })}
                        </section>
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