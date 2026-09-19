import { useEffect, useState } from "react";
import api from "../services/api";

export function DSAProgress() {
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const response = await api.get("/profile/dsa-progress");
                setTopics(response.data.progress || []);
            } catch (requestError) {
                setError(
                    requestError.response?.data?.message ||
                    "Failed to load DSA progress."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProgress();
    }, []);

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

            {loading && (
                <div style={{ fontSize: "11px" }}>Loading DSA progress...</div>
            )}

            {!loading && error && (
                <div style={{ fontSize: "11px" }}>{error}</div>
            )}

            {!loading && !error && topics.length === 0 && (
                <div style={{ fontSize: "11px" }}>No topic progress yet.</div>
            )}

            {!loading && !error && topics.map((topic) => {
                const progress = Math.round(
                    topic.total > 0 ? (topic.solved / topic.total) * 100 : 0
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