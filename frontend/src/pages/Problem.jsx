import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../services/api";
import { Navbar } from "../components/Navbar";
import { ProblemStatement } from "../components/ProblemStatement";
import { CodeEditor } from "../components/CodeEditor";

export function Problem() {
    const { slug } = useParams();

    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [submissionResult, setSubmissionResult] = useState(null);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await api.get(`/problems/${slug}`);

                setProblem(response.data.problem);
                console.log(response.data.problem);
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
        return <div>
            <Navbar />
            
            <div style={{ padding: "30px" }}>
                Loading problem...
            </div>
        </div>
    }

    if (error) {
        return (
            <>
                <Navbar />
                <div style={{ padding: "30px" }}>
                    {error}
                </div>
            </>
        );
    }

    return <div style={{color: "white"}}>
        
        <Navbar />
        
        <main style={{ display: "flex", gap: "10px", height: "calc(100vh - 100px)", padding: "10px", boxSizing: "border-box" }}>
    
            {/* Problem Statement */}
            <div style={{ flex: 1, minWidth: 0, border: "1px solid white", borderRadius: "6px", overflow: "hidden" }}>
                <ProblemStatement problem={problem} />
            </div>

            {/* Right Side */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                
                {/* Code Editor */}
                <div style={{ flex: 1, minHeight: 0 }}>
                    <CodeEditor
                        problemId={problem._id}
                        examples={problem.examples}
                        onResult={setSubmissionResult}
                    />
                </div>

                {/* Output */}
                <div style={{ flex: 0.5, minHeight: 0, border: "1px solid white", borderRadius: "6px", padding: "15px", boxSizing: "border-box", color: "white", overflowY: "auto"}}>
                    <h3 style={{ marginTop: 0 }}>
                        Output
                    </h3>

                    {submissionResult ? (
                        <div>
                            <strong>
                                {submissionResult.status}
                            </strong>

                            {submissionResult.message && (
                                <p>
                                    {submissionResult.message}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div>
                            Run or submit your code to see the result.
                        </div>
                    )}
                </div>
            
            </div>
        </main>
    </div>
}