import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { RotateCcw } from 'lucide-react';

const languageKeywords = {
    cpp: new Set("alignas alignof and asm auto bool break case catch char class const constexpr continue default delete do double else enum explicit export extern false float for friend if inline int long namespace new noexcept not nullptr operator private protected public register reinterpret_cast return short signed sizeof static struct switch template this throw true try typedef typename union unsigned using virtual void volatile wchar_t while".split(" ")),
    python: new Set("and as assert async await break case class continue def del elif else except False finally for from global if import in is lambda match None nonlocal not or pass raise return True try while with yield".split(" ")),
    javascript: new Set("as async await break case catch class const continue debugger default delete do else export extends false finally for from function get if implements import in instanceof interface let new null of package private protected public return set static super switch this throw true try typeof undefined var void while with yield".split(" "))
};

const languageTypes = {
    cpp: new Set("array bitset deque list map pair queue set string unordered_map unordered_set vector".split(" ")),
    python: new Set("bool bytes dict float frozenset int list object set str tuple".split(" ")),
    javascript: new Set("Array Boolean Date Error Function Map Math Number Object Promise RegExp Set String Symbol JSON console".split(" "))
};

function getLanguageKey(languageName) {
    const name = String(languageName || "").toLowerCase();

    if (name === "c++" || name === "cpp") return "cpp";
    if (name === "python") return "python";
    if (name === "javascript" || name === "js") return "javascript";
    return "cpp";
}

function highlightCode(source, languageName) {
    const language = getLanguageKey(languageName);
    const keywords = languageKeywords[language];
    const types = languageTypes[language];
    const tokenPattern = /(#\s*include\s*[<"].*?[>"]|\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b|===|!==|==|!=|<=|>=|&&|\|\||\+\+|--|->|=>|[+\-*/%=<>!&|^~?:])/g;
    const tokens = [];
    let lastIndex = 0;
    let match;

    while ((match = tokenPattern.exec(source)) !== null) {
        if (match.index > lastIndex) {
            tokens.push({ text: source.slice(lastIndex, match.index) });
        }

        const text = match[0];
        let type = "plain";

        if (text.startsWith("//") || text.startsWith("/*") || (text.startsWith("#") && !text.startsWith("#include"))) {
            type = "comment";
        } else if (text.startsWith("#include")) {
            type = "preprocessor";
        } else if (/^["'`]/.test(text)) {
            type = "string";
        } else if (/^\d/.test(text)) {
            type = "number";
        } else if (keywords.has(text)) {
            type = "keyword";
        } else if (types.has(text)) {
            type = "type";
        } else if (/^[A-Za-z_$]/.test(text) && /^\s*\(/.test(source.slice(match.index + text.length))) {
            type = "function";
        } else if (text === "true" || text === "false" || text === "True" || text === "False" || text === "None" || text === "null" || text === "undefined") {
            type = "constant";
        } else if (/^[+\-*/%=<>!&|^~?:]/.test(text)) {
            type = "operator";
        }

        tokens.push({ text, type });
        lastIndex = tokenPattern.lastIndex;
    }

    if (lastIndex < source.length) {
        tokens.push({ text: source.slice(lastIndex) });
    }

    return tokens.map((token, index) => (
        <span key={`${index}-${token.text}`} style={{ color: {
            plain: "#d4d4d4",
            comment: "#6a9955",
            preprocessor: "#c586c0",
            string: "#ce9178",
            number: "#b5cea8",
            keyword: "#569cd6",
            type: "#4ec9b0",
            function: "#dcdcaa",
            constant: "#569cd6",
            operator: "#d4d4d4"
        }[token.type] || "#d4d4d4" }}>{token.text}</span>
    ));
}

export function CodeEditor({ problemId, examples, onResult }) {
    const [languages, setLanguages] = useState([]);
    const [languageId, setLanguageId] = useState("");
    const codeScrollRef = useRef(null);
    const highlightedCodeRef = useRef(null);
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

    const defaultCode = `#include <iostream>
using namespace std;

int main() {
    // Write your solution here

    return 0;
}`;

    const [code, setCode] = useState(defaultCode);

    const handleReset = () => {
        setCode(defaultCode);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Tab") {
            event.preventDefault();

            const textarea = event.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            const newCode =
                code.substring(0, start) +
                "    " +
                code.substring(end);

            setCode(newCode);

            setTimeout(() => {
                textarea.selectionStart = start + 4;
                textarea.selectionEnd = start + 4;
            }, 0);
        }
    };

    const selectedLanguage = languages.find((language) => language._id === languageId);

    const handleCodeScroll = (event) => {
        if (highlightedCodeRef.current) {
            highlightedCodeRef.current.scrollTop = event.currentTarget.scrollTop;
            highlightedCodeRef.current.scrollLeft = event.currentTarget.scrollLeft;
        }
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

            const response = await api.post("/run", {
                problemId,
                languageId,
                code
            });

            onResult(response.data);

        } catch (error) {
            console.error(
                "Run failed:",
                error.response?.data || error.message
            );

            onResult({
                status: "Run Failed",
                message:
                    error.response?.data?.message ||
                    "Failed to execute code."
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
        <div style={{ position: "relative", flex: 1, minHeight: 0, backgroundColor: "#111", overflow: "hidden" }}>
            <pre
                ref={highlightedCodeRef}
                aria-hidden="true"
                style={{ position: "absolute", inset: 0, margin: 0, padding: "15px", boxSizing: "border-box", overflow: "hidden", whiteSpace: "pre-wrap", overflowWrap: "break-word", fontFamily: "monospace", fontSize: "14px", lineHeight: "1.5", pointerEvents: "none" }}
            >
                <code>{highlightCode(code, selectedLanguage?.name)}</code>
            </pre>
            <textarea
                ref={codeScrollRef}
                value={code}
                onChange={(event) => setCode(event.target.value)}
                onScroll={handleCodeScroll}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                style={{ position: "relative", zIndex: 1, flex: 1, width: "100%", height: "100%", boxSizing: "border-box", resize: "none", backgroundColor: "transparent", color: "transparent", caretColor: "white", border: "none", outline: "none", padding: "15px", fontFamily: "monospace", fontSize: "14px", lineHeight: "1.5", overflow: "auto", whiteSpace: "pre-wrap", overflowWrap: "break-word", WebkitTextFillColor: "transparent" }}
            />
        </div>

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