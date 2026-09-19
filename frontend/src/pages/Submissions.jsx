import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "../components/Navbar";
import { ProfileSidebar } from "../components/ProfileSidebar";
import api from "../services/api";

export function Submissions() {
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSubmissions = async () => {
            if (!localStorage.getItem("token")) {
                navigate("/signin");
                return;
            }

            setLoading(true);
            setError("");

            try {
                const response = await api.get(
                    `/submissions/my?page=${page}&limit=10`
                );
                setSubmissions(response.data.submissions || []);
                setPagination(response.data.pagination || null);
            } catch (requestError) {
                if (requestError.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/signin");
                    return;
                }

                setError(
                    requestError.response?.data?.message ||
                    "Failed to load submissions."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [navigate, page]);

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

    const getPageNumbers = () => {
        if (!pagination || pagination.totalPages <= 7) {
            return Array.from(
                { length: pagination?.totalPages || 0 },
                (_, index) => index + 1
            );
        }

        if (page <= 3) {
            return [1, 2, 3, "...", pagination.totalPages];
        }

        if (page >= pagination.totalPages - 2) {
            return [1, "...", pagination.totalPages - 2, pagination.totalPages - 1, pagination.totalPages];
        }

        return [1, "...", page, "...", pagination.totalPages];
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "black", color: "white", padding: "12px", boxSizing: "border-box" }}>
            <Navbar showAuth={false} />

            <div style={{ display: "flex", gap: "10px", marginTop: "10px", border: "1px solid white", padding: "10px", boxSizing: "border-box", alignItems: "flex-start", flexWrap: "wrap" }}>
                <ProfileSidebar />

                <main style={{ flex: "1 1 620px", minWidth: 0, border: "1px solid white", padding: "12px", boxSizing: "border-box" }}>
                <h1 style={{ fontSize: "18px", margin: "0 0 14px" }}>
                    Submissions
                </h1>

                {loading && (
                    <div style={{ fontSize: "11px" }}>Loading submissions...</div>
                )}

                {!loading && error && (
                    <div style={{ fontSize: "11px" }}>{error}</div>
                )}

                {!loading && !error && submissions.length === 0 && (
                    <div style={{ fontSize: "11px" }}>No submissions yet.</div>
                )}

                {!loading && !error && submissions.length > 0 && (
                    <div style={{ overflowX: "auto" }}>
                        <div style={{ minWidth: "560px" }}>
                            <div style={{ display: "flex", padding: "0 0 6px", color: "#888", fontSize: "9px" }}>
                                <div style={{ flex: 1 }}>Problem</div>
                                <div style={{ width: "150px" }}>Result</div>
                                <div style={{ width: "100px" }}>Language</div>
                                <div style={{ width: "80px", textAlign: "right" }}>Runtime</div>
                                <div style={{ width: "100px", textAlign: "right" }}>Date</div>
                            </div>

                            {submissions.map((submission, index) => (
                                <div
                                    key={submission._id || index}
                                    style={{ display: "flex", alignItems: "center", padding: "10px 0", borderTop: index !== 0 ? "1px solid #333" : "1px solid white" }}
                                >
                                    <div style={{ flex: 1, fontSize: "12px", fontWeight: "500" }}>
                                        {submission.problemId?.title || "Unknown problem"}
                                    </div>
                                    <div style={{ width: "150px", fontSize: "10px" }}>
                                        {submission.status}
                                    </div>
                                    <div style={{ width: "100px", fontSize: "10px", color: "#bbb" }}>
                                        {submission.languageId?.name || "-"}
                                    </div>
                                    <div style={{ width: "80px", textAlign: "right", fontSize: "10px", color: "#aaa" }}>
                                        {Number.isFinite(submission.runtime) ? `${submission.runtime}ms` : "-"}
                                    </div>
                                    <div style={{ width: "100px", textAlign: "right", fontSize: "10px", color: "#aaa" }}>
                                        {formatDate(submission.createdAt)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!loading && !error && pagination && pagination.totalPages > 1 && (
                    <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", marginTop: "12px", fontSize: "11px" }}>
                        <button
                            type="button"
                            onClick={() => setPage((currentPage) => currentPage - 1)}
                            disabled={page === 1}
                            style={{ backgroundColor: "black", color: "white", border: "1px solid white", padding: "5px 8px", cursor: page === 1 ? "default" : "pointer", opacity: page === 1 ? 0.5 : 1 }}
                        >
                            Previous
                        </button>
                        {getPageNumbers().map((pageNumber, index) => (
                            pageNumber === "..." ? (
                                <span key={`ellipsis-${index}`}>...</span>
                            ) : (
                                <button
                                    key={pageNumber}
                                    type="button"
                                    onClick={() => setPage(pageNumber)}
                                    style={{ backgroundColor: pageNumber === page ? "white" : "black", color: pageNumber === page ? "black" : "white", border: "1px solid white", minWidth: "26px", padding: "5px 6px", cursor: "pointer" }}
                                >
                                    {pageNumber}
                                </button>
                            )
                        ))}
                        <button
                            type="button"
                            onClick={() => setPage((currentPage) => currentPage + 1)}
                            disabled={page === pagination.totalPages}
                            style={{ backgroundColor: "black", color: "white", border: "1px solid white", padding: "5px 8px", cursor: page === pagination.totalPages ? "default" : "pointer", opacity: page === pagination.totalPages ? 0.5 : 1 }}
                        >
                            Next
                        </button>
                    </div>
                )}
                </main>
            </div>
        </div>
    );
}
