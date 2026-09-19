import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../services/api";

export function RecentActivity() {
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const response = await api.get("/submissions/my?limit=5");
                setSubmissions(response.data.submissions || []);
            } catch (requestError) {
                setError(
                    requestError.response?.data?.message ||
                    "Failed to load recent activity."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

    return (
        <div
            style={{
                border: "1px solid white",
                padding: "12px",
                marginTop: "10px",
                boxSizing: "border-box"
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px"
                }}
            >
                <div
                    style={{
                        fontSize: "14px",
                        fontWeight: "600"
                    }}
                >
                    Recent Activity
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/submissions")}
                    style={{
                        backgroundColor: "black",
                        color: "white",
                        border: "1px solid white",
                        borderRadius: "4px",
                        padding: "4px 8px",
                        fontSize: "10px",
                        cursor: "pointer"
                    }}
                >
                    View All →
                </button>
            </div>

            {loading && (
                <div style={{ fontSize: "11px" }}>
                    Loading recent activity...
                </div>
            )}

            {!loading && error && (
                <div style={{ fontSize: "11px" }}>
                    {error}
                </div>
            )}

            {!loading && !error && submissions.length === 0 && (
                <div style={{ fontSize: "11px" }}>
                    No submissions yet.
                </div>
            )}

            {!loading && !error && submissions.length > 0 && (
                <div style={{ overflowX: "auto" }}>
                    {/* Table Header */}
                    <div
                        style={{
                            display: "flex",
                            minWidth: "420px",
                            paddingBottom: "5px",
                            color: "#888",
                            fontSize: "9px"
                        }}
                    >
                        <div style={{ flex: 1 }}>Problem</div>
                        <div style={{ width: "92px" }}>Result</div>
                        <div style={{ width: "62px" }}>Language</div>
                        <div
                            style={{
                                width: "48px",
                                textAlign: "right"
                            }}
                        >
                            Time
                        </div>
                        <div
                            style={{
                                width: "72px",
                                textAlign: "right"
                            }}
                        >
                            Date
                        </div>
                    </div>

                    {/* Scrollable Activity List */}
                    <div
                        style={{
                            maxHeight: "190px",
                            overflowY: "auto",
                            overflowX: "hidden",
                            minWidth: "420px",
                            paddingRight: "4px",
                            boxSizing: "border-box"
                        }}
                    >
                        {submissions.map((submission, index) => (
                            <div
                                key={submission._id || index}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    padding: "9px 0",
                                    borderTop:
                                        index !== 0
                                            ? "1px solid #333"
                                            : "none"
                                }}
                            >
                                {/* Problem */}
                                <div
                                    style={{
                                        flex: 1,
                                        fontSize: "12px",
                                        fontWeight: "500"
                                    }}
                                >
                                    {submission.problemId?.title ||
                                        "Unknown problem"}
                                </div>

                                {/* Result */}
                                <div
                                    style={{
                                        width: "92px",
                                        fontSize: "10px"
                                    }}
                                >
                                    {submission.status}
                                </div>

                                {/* Language */}
                                <div
                                    style={{
                                        width: "62px",
                                        fontSize: "10px",
                                        color: "#bbb"
                                    }}
                                >
                                    {submission.languageId?.name || "-"}
                                </div>

                                {/* Runtime */}
                                <div
                                    style={{
                                        width: "48px",
                                        textAlign: "right",
                                        fontSize: "10px",
                                        color: "#aaa"
                                    }}
                                >
                                    {Number.isFinite(submission.runtime)
                                        ? `${submission.runtime}ms`
                                        : "-"}
                                </div>

                                {/* Date */}
                                <div
                                    style={{
                                        width: "72px",
                                        textAlign: "right",
                                        fontSize: "10px",
                                        color: "#aaa"
                                    }}
                                >
                                    {formatDate(submission.createdAt)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}