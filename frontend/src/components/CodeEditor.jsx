import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { RotateCcw } from 'lucide-react';

export function CodeEditor({ problemId, examples, onResult }) {
    const [languages, setLanguages] = useState([]);
    const [languageId, setLanguageId] = useState("");
    const pollTimerRef = useRef(null);
    const isMountedRef = useRef(true);

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const response = await api.get("/languages");

                setLanguages(response.data.languages);

                if (response.data.languages.length > 0) {
                    setLanguageId(response.data.languages[0]._id);
                }

            } catch (error) {
                console.error("Failed to fetch languages:", error);
            }
        };

        fetchLanguages();
    }, []);

    useEffect(() => {
        isMountedRef.current = true;

        return () => {
            isMountedRef.current = false;

            if (pollTimerRef.current) {
                clearTimeout(pollTimerRef.current);
                pollTimerRef.current = null;
            }
        };
    }, []);


    const [code, setCode] = useState(
        `class Solution {
        public:
            vector<int> twoSum(vector<int>& nums, int target) {
                
            }
        };`
    );

    const handleReset = () => {
        setCode(
        `class Solution {
        public:
            vector<int> twoSum(vector<int>& nums, int target) {
                
            }
        };`
        );
    };

    const pollSubmission = async (submissionId) => {
        if (!isMountedRef.current) {
            return;
        }

        try {
            const response = await api.get(`/submissions/${submissionId}`);

            const submission = response.data.submission;

            if (!isMountedRef.current) {
                return;
            }

            onResult(submission);

            if (submission.status === "PENDING") {
                pollTimerRef.current = setTimeout(() => {
                    pollSubmission(submissionId);
                }, 1000);
            }

        } catch (error) {
            console.error(
                "Failed to fetch submission status:",
                error.response?.data || error.message
            );

            if (!isMountedRef.current) {
                return;
            }

            if (pollTimerRef.current) {
                clearTimeout(pollTimerRef.current);
                pollTimerRef.current = null;
            }

            onResult({
                status: "Submission Status Error",
                message: "Failed to retrieve submission status."
            });
        }
    };

    const handleRun = async () => {
        try {
            onResult(null);

            console.log("Code:", code);
            console.log("Language ID:", languageId);
            console.log("Examples:", examples);

            // Actual code execution will be added later.
            onResult({
                status: "Ready to Run",
                message: "Code execution engine is not connected yet."
            });

        } catch (error) {
            console.error("Run failed:", error);

            onResult({
                status: "Run Failed"
            });
        }
    };

    const handleSubmit = async () => {
        try {
            onResult(null);

            // Stop any existing polling loop
            if (pollTimerRef.current) {
                clearTimeout(pollTimerRef.current);
                pollTimerRef.current = null;
            }

            const response = await api.post("/submissions", {
                problemId,
                languageId,
                code
            });

            const submission = response.data.submission;

            // Immediately show PENDING
            onResult(submission);

            // Start polling
            pollSubmission(submission._id);

        } catch (error) {
            console.error(
                "Submission failed:",
                error.response?.data || error.message
            );

            onResult({
                status: "Submission Failed"
            });
        }
    };

    return <div style={{ height: "100%", display: "flex", flexDirection: "column", boxSizing: "border-box", border: "1px solid white", color: "white" }}>

        {/* Editor Header */}
        <div style={{ height: "45px", display: "flex", alignItems: "center", padding: "0 10px", borderBottom: "1px solid white", boxSizing: "border-box" }}>
            
            {/* Language */}
            <select
                value={languageId}
                onChange={(event) =>
                    setLanguageId(event.target.value)
                }
                style={{ backgroundColor: "black", color: "white", border: "1px solid white", padding: "6px 10px", borderRadius: "5px" }}
                >
                
                {languages.map((language) => (
                    <option
                        key={language._id}
                        value={language._id}
                    >
                        {language.name}
                    </option>
                ))}

            </select>

            {/* Reset */}
            <button
                onClick={handleReset}
                style={{ marginLeft: "auto", backgroundColor: "black", color: "white", border: "none", cursor: "pointer", fontSize: "18px"}}
                title="Reset Code"
            >
                <RotateCcw size="20" />
            </button>
        </div>

        {/* Code */}
        <textarea
            value={code}
            onChange={(event) =>
                setCode(event.target.value)
            }
            spellCheck={false}
            style={{ flex: 1, width: "100%", boxSizing: "border-box", resize: "none", backgroundColor: "#111", color: "white", border: "none", outline: "none", padding: "15px", fontFamily: "monospace", fontSize: "14px", lineHeight: "1.5" }}
        />

        {/* Buttons */}
        <div style={{ height: "50px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", padding: "0 10px", borderTop: "1px solid white", boxSizing: "border-box"}}>
            
            <button
                onClick={handleRun}
                style={{ padding: "7px 25px", borderRadius: "15px", border: "none", cursor: "pointer"}}
            >
                Run
            </button>

            <button
                onClick={handleSubmit}
                style={{ padding: "7px 25px", borderRadius: "15px", border: "none", cursor: "pointer", backgroundColor: "#2196f3", color: "white" }}
            >
                Submit
            </button>
        </div>
    </div>
}