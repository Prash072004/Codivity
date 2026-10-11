import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../services/api";
import { Navbar } from "../components/Navbar";
import { ProblemStatement } from "../components/ProblemStatement";
import { CodeEditor } from "../components/CodeEditor";
import { Check, CheckCircle2, CircleX, Copy } from "lucide-react";

export function Problem() {
    const { slug } = useParams();

    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [submissionResult, setSubmissionResult] = useState(null);
    const [selectedRunCase, setSelectedRunCase] = useState(0);
    const [copiedField, setCopiedField] = useState("");

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

    const handleResult = (result) => {
        setSubmissionResult(result);
        setCopiedField("");
    };

    const copyOutput = async (field, value) => {
        await navigator.clipboard.writeText(value ?? "");
        setCopiedField(field);
        setTimeout(() => setCopiedField(""), 1200);
    };

    const selectedExample = problem?.examples?.[selectedRunCase];

    if (loading) {
        return <div>
            <div className="px-3 pt-3"><Navbar /></div>
            
            <div style={{ padding: "30px" }}>
                Loading problem...
            </div>
        </div>
    }

    if (error) {
        return (
            <>
                <div className="px-3 pt-3"><Navbar /></div>
                <div style={{ padding: "30px" }}>
                    {error}
                </div>
            </>
        );
    }

    return <div style={{color: "white"}}>
        
        <div className="px-3 pt-3"><Navbar /></div>
        
        <main style={{ display: "flex", gap: "10px", height: "calc(100vh - 116px)", padding: "10px", boxSizing: "border-box" }}>
    
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
                        onResult={handleResult}
                    />
                </div>

                {/* Output */}
                <div style={{ flex: 0.5, minHeight: 0, border: "1px solid white", borderRadius: "6px", padding: "15px", boxSizing: "border-box", color: "white", overflowY: "auto"}}>
                    <h3 style={{ marginTop: 0 }}>
                        Output
                    </h3>

                    {submissionResult ? (
                        submissionResult.status === "RUNNING" ? (
                            <div style={{ border: "1px solid #444", borderRadius: "6px", padding: "18px", minHeight: "120px", boxSizing: "border-box" }}>
                                <strong style={{ display: "block", fontSize: "18px", borderBottom: "1px solid #444", paddingBottom: "10px", marginBottom: "22px" }}>Run Result</strong>
                                <div style={{ color: "#bbb", fontSize: "13px" }}>Running code...</div>
                            </div>
                        ) : submissionResult.status === "PENDING" ? (
                            <div>Judging...</div>
                        ) : submissionResult.results ? (
                            (() => {
                                const results = submissionResult.results;
                                const result = results[selectedRunCase] || results[0];
                                const runtimeValues = results.map((item) => item.runtime).filter((value) => Number.isFinite(value));
                                const totalRuntime = runtimeValues.length > 0 ? Math.max(...runtimeValues) : null;
                                const successful = submissionResult.status === "Accepted";
                                const copyBox = (label, field, value) => (
                                    <div style={{ marginTop: "16px" }}>
                                        <div style={{ fontSize: "12px", color: "#bbb", marginBottom: "6px" }}>{label}</div>
                                        <div style={{ position: "relative", backgroundColor: "#111", border: "1px solid #444", borderRadius: "5px", padding: "12px 42px 12px 12px", minHeight: "44px", boxSizing: "border-box" }}>
                                            <pre style={{ margin: 0, whiteSpace: "pre-wrap", overflowWrap: "break-word", fontFamily: "monospace", fontSize: "13px", lineHeight: "1.45" }}>{value ?? ""}</pre>
                                            <button type="button" onClick={() => copyOutput(field, value)} title={`Copy ${label.toLowerCase()}`} style={{ position: "absolute", top: "8px", right: "8px", background: "transparent", color: "#bbb", border: "none", cursor: "pointer", padding: "2px" }}>
                                                {copiedField === field ? <Check size={15} /> : <Copy size={15} />}
                                            </button>
                                        </div>
                                    </div>
                                );

                                return (
                                    <div style={{ border: "1px solid #444", borderRadius: "6px", padding: "18px", boxSizing: "border-box" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #444", paddingBottom: "10px", marginBottom: "18px" }}>
                                            <strong style={{ fontSize: "18px" }}>Run Result</strong>
                                            <span style={{ border: "1px solid #555", borderRadius: "4px", padding: "5px 8px", color: "#bbb", fontSize: "11px" }}>
                                                Runtime: {totalRuntime === null ? "-" : `${totalRuntime} ms`}
                                            </span>
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: successful ? "#76d275" : "#f08080", fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>
                                            {successful ? <CheckCircle2 size={20} /> : <CircleX size={20} />}
                                            {submissionResult.status}
                                        </div>

                                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
                                            {results.map((item, index) => {
                                                const itemSuccessful = item.status === "Accepted";
                                                return (
                                                    <button key={item.testCaseId} type="button" onClick={() => setSelectedRunCase(index)} style={{ display: "flex", alignItems: "center", gap: "5px", backgroundColor: selectedRunCase === index ? "#222" : "black", color: itemSuccessful ? "#76d275" : "#f08080", border: selectedRunCase === index ? "1px solid white" : "1px solid #444", borderRadius: "4px", padding: "6px 9px", cursor: "pointer", fontSize: "11px" }}>
                                                        {itemSuccessful ? <CheckCircle2 size={14} /> : <CircleX size={14} />}
                                                        Case {item.testCase}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {copyBox("Input", `input-${result.testCaseId}`, result.input)}
                                        {copyBox("Expected Output", `expected-${result.testCaseId}`, result.expectedOutput)}
                                        {copyBox("Your Output", `actual-${result.testCaseId}`, result.actualOutput)}

                                        <div style={{ marginTop: "16px", fontSize: "12px", color: "#bbb" }}>
                                            <div>Status: {result.status}</div>
                                            <div style={{ marginTop: "5px" }}>Runtime: {result.runtime === null ? "-" : `${result.runtime} ms`}</div>
                                            {result.stderr && <pre style={{ color: "#f08080", whiteSpace: "pre-wrap", marginTop: "10px" }}>{result.stderr}</pre>}
                                        </div>
                                    </div>
                                );
                            })()
                        ) : (
                            <div>
                                <strong>{submissionResult.status}</strong>
                                {Number.isFinite(submissionResult.passedTestCases) && Number.isFinite(submissionResult.totalTestCases) && (
                                    <div style={{ marginTop: "10px" }}>
                                        {submissionResult.passedTestCases} / {submissionResult.totalTestCases} Test Cases Passed
                                    </div>
                                )}
                                <div style={{ marginTop: "10px" }}>
                                    Runtime: {Number.isFinite(submissionResult.runtime) ? `${submissionResult.runtime} ms` : "--"}
                                </div>
                                <div style={{ marginTop: "5px" }}>
                                    Memory: {Number.isFinite(submissionResult.memory) ? `${submissionResult.memory} MB` : "--"}
                                </div>
                                {submissionResult.message && <p>{submissionResult.message}</p>}
                            </div>
                        )
                    ) : (
                        <div>
                            <div style={{ fontSize: "13px", color: "#bbb", marginBottom: "12px" }}>
                                Testcase <span style={{ color: "white" }}>&gt;</span> Test Result
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                                {(problem.examples || []).map((example, index) => (
                                    <button
                                        key={example.title || index}
                                        type="button"
                                        onClick={() => setSelectedRunCase(index)}
                                        style={{ backgroundColor: selectedRunCase === index ? "#222" : "black", color: "white", border: selectedRunCase === index ? "1px solid white" : "1px solid #444", borderRadius: "4px", padding: "6px 10px", cursor: "pointer", fontSize: "11px" }}
                                    >
                                        Case {index + 1}
                                    </button>
                                ))}
                            </div>

                            {selectedExample && (
                                <div>
                                    <div style={{ fontSize: "12px", color: "#bbb", marginBottom: "6px" }}>Input</div>
                                    <pre style={{ margin: 0, backgroundColor: "#111", border: "1px solid #444", borderRadius: "5px", padding: "12px", whiteSpace: "pre-wrap", overflowWrap: "break-word", fontFamily: "monospace", fontSize: "13px", lineHeight: "1.45" }}>
                                        {selectedExample.input}
                                    </pre>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            
            </div>
        </main>
    </div>
}