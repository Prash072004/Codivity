import { useEffect, useState } from "react";
import api from "../services/api";

export function SubmissionActivity() {
    const [range, setRange] = useState("year");
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchActivity = async () => {
            const days = range === "month" ? 30 : range === "week" ? 7 : 365;
            const from = new Date();
            from.setHours(0, 0, 0, 0);
            from.setDate(from.getDate() - (days - 1));

            setLoading(true);
            setError("");

            try {
                const response = await api.get(
                    `/submissions/my?from=${encodeURIComponent(from.toISOString())}`
                );
                setSubmissions(response.data.submissions || []);
            } catch (requestError) {
                setError(
                    requestError.response?.data?.message ||
                    "Failed to load submission activity."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [range]);

    const days = range === "month" ? 30 : range === "week" ? 7 : 365;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activityDays = Array.from({ length: days }, (_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (days - index - 1));
        return date;
    });

    const getDateKey = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const counts = submissions.reduce((result, submission) => {
        const key = getDateKey(new Date(submission.createdAt));
        result[key] = (result[key] || 0) + 1;
        return result;
    }, {});

    const getActivityColor = (count) => {
        if (count === 0) return "black";
        if (count === 1) return "#333";
        if (count === 2) return "#666";
        if (count === 3) return "#999";
        return "white";
    };

    const activeDays = Object.keys(counts).length;

    return (
        <div
            style={{
                border: "1px solid white",
                padding: "10px",
                boxSizing: "border-box",
                marginTop: "10px"
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
                <div>
                    <div
                        style={{
                            fontSize: "12px",
                            fontWeight: "600"
                        }}
                    >
                        Submission Activity
                    </div>

                    <div
                        style={{
                            fontSize: "9px",
                            marginTop: "2px"
                        }}
                    >
                        Actual submission activity
                    </div>
                </div>

                {/* Statistics */}
                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        fontSize: "9px",
                        alignItems: "center",
                        flexWrap: "wrap",
                        justifyContent: "flex-end"
                    }}
                >
                    <div>
                        {submissions.length}
                        <div>Total submissions</div>
                    </div>

                    <div>
                        {activeDays}
                        <div>Total active days</div>
                    </div>

                    <select
                        value={range}
                        onChange={(event) => setRange(event.target.value)}
                        style={{
                            backgroundColor: "black",
                            color: "white",
                            border: "1px solid white",
                            fontSize: "9px"
                        }}
                    >
                        <option value="year">Past year</option>
                        <option value="month">Past month</option>
                        <option value="week">Past week</option>
                    </select>
                </div>
            </div>

            {loading && <div style={{ fontSize: "11px" }}>Loading submission activity...</div>}

            {!loading && error && <div style={{ fontSize: "11px" }}>{error}</div>}

            {!loading && !error && <div
                style={{
                    overflowX: "auto",
                    paddingBottom: "5px"
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateRows: "repeat(7, 10px)",
                        gridAutoFlow: "column",
                        gridAutoColumns: "10px",
                        gap: "3px",
                        width: "max-content"
                    }}
                >
                    {activityDays.map((date) => {
                        const count = counts[getDateKey(date)] || 0;

                        return (
                        <div
                            key={getDateKey(date)}
                            title={`${count} submissions`}
                            style={{
                                width: "10px",
                                height: "10px",
                                backgroundColor:
                                    getActivityColor(count),
                                border: "1px solid #444",
                                boxSizing: "border-box"
                            }}
                        />
                        );
                    })}
                </div>
            </div>}

            {/* Footer */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "8px",
                    fontSize: "8px"
                }}
            >
                <span>Each square represents a day.</span>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "3px"
                    }}
                >
                    <span>Less</span>

                    {[0, 1, 2, 3, 4].map((level) => (
                        <div
                            key={level}
                            style={{
                                width: "9px",
                                height: "9px",
                                backgroundColor:
                                    getActivityColor(level),
                                border: "1px solid #444"
                            }}
                        />
                    ))}

                    <span>More</span>
                </div>
            </div>
        </div>
    );
}