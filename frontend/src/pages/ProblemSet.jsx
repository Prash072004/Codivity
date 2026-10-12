import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../services/api";
import { Navbar } from "../components/Navbar";
import { TopicSidebar } from "../components/TopicSidebar";
import { ProblemTable, ProgressSummary } from "../components/ProblemList";

export function ProblemSet() {
    const { slug } = useParams();

    const [problem, setProblem] = useState(null);
    const [problems, setProblems] = useState([]);
    const [userProgress, setUserProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedTopic, setSelectedTopic] = useState("all");
    const [search, setSearch] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("title");
    const [progressLoaded, setProgressLoaded] = useState(false);

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
                        setProgressLoaded(true);
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
                <div className="px-3 pt-3"><Navbar /></div>
                <div style={{ padding: "30px", color: "white" }}>
                    Loading problems...
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <div className="px-3 pt-3"><Navbar /></div>
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
        const DIFFICULTY_ORDER = { Easy: 0, Medium: 1, Hard: 2 };
        const allRows = problems.map((item) => ({
            ...item,
            topicName: item.primaryTopic?.name || "Uncategorized",
            status: progressByProblem.get(item._id) || "Unattempted"
        }));

        const topicCounts = allRows.reduce((counts, row) => counts.set(row.topicName, (counts.get(row.topicName) || 0) + 1), new Map());
        const topicOptions = [
            { key: "all", name: "All", count: allRows.length },
            ...[...topicCounts.keys()].sort((a, b) => a.localeCompare(b)).map((name) => ({ key: name, name, count: topicCounts.get(name) }))
        ];
        const activeTopic = topicOptions.some((option) => option.key === selectedTopic) ? selectedTopic : "all";

        const query = search.trim().toLowerCase();
        const rows = allRows
            .filter((row) => activeTopic === "all" || row.topicName === activeTopic)
            .filter((row) => difficultyFilter === "all" || row.difficulty === difficultyFilter)
            .filter((row) => statusFilter === "all" || row.status === statusFilter)
            .filter((row) => !query || row.title.toLowerCase().includes(query) || row.topicName.toLowerCase().includes(query))
            .sort((a, b) => {
                if (sortBy === "difficulty-asc") return DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty] || a.title.localeCompare(b.title);
                if (sortBy === "difficulty-desc") return DIFFICULTY_ORDER[b.difficulty] - DIFFICULTY_ORDER[a.difficulty] || a.title.localeCompare(b.title);
                return a.title.localeCompare(b.title);
            });

        const solvedCount = allRows.filter((row) => row.status === "Solved").length;
        const controlClass = "h-9 rounded-lg border border-slate-400/15 bg-white/[0.03] px-3 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400/60";

        return (
            <div className="min-h-screen bg-[#05070d] font-sans text-white">
                <div className="px-3 pt-3"><Navbar /></div>
                <div className="w-full px-4 py-6 md:px-6 xl:px-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="m-0 text-2xl font-semibold">Problem Set</h1>
                            <p className="m-0 mt-1 text-sm text-slate-400">Find the right problem. Build consistency.</p>
                        </div>
                        <ProgressSummary solved={solvedCount} total={allRows.length} signedIn={progressLoaded} />
                    </div>

                    <div className="mt-6 grid items-start gap-6 md:grid-cols-[15rem_minmax(0,1fr)]">
                        <TopicSidebar topics={topicOptions} selected={activeTopic} onSelect={setSelectedTopic} />

                        <section className="min-w-0">
                            <div className="mb-3 flex flex-wrap gap-2">
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search by title or topic"
                                    aria-label="Search problems"
                                    className={`${controlClass} min-w-48 flex-1 placeholder:text-slate-500`}
                                />
                                <select aria-label="Topic" value={activeTopic} onChange={(event) => setSelectedTopic(event.target.value)} className={controlClass}>
                                    {topicOptions.map((option) => (
                                        <option key={option.key} value={option.key} className="bg-slate-900">{option.key === "all" ? "All topics" : option.name}</option>
                                    ))}
                                </select>
                                <select aria-label="Difficulty" value={difficultyFilter} onChange={(event) => setDifficultyFilter(event.target.value)} className={controlClass}>
                                    <option value="all" className="bg-slate-900">All difficulties</option>
                                    <option value="Easy" className="bg-slate-900">Easy</option>
                                    <option value="Medium" className="bg-slate-900">Medium</option>
                                    <option value="Hard" className="bg-slate-900">Hard</option>
                                </select>
                                <select aria-label="Status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className={controlClass}>
                                    <option value="all" className="bg-slate-900">All statuses</option>
                                    <option value="Solved" className="bg-slate-900">Solved</option>
                                    <option value="Attempted" className="bg-slate-900">Attempted</option>
                                    <option value="Unattempted" className="bg-slate-900">Unattempted</option>
                                </select>
                                <select aria-label="Sort" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className={controlClass}>
                                    <option value="title" className="bg-slate-900">Title A–Z</option>
                                    <option value="difficulty-asc" className="bg-slate-900">Easiest first</option>
                                    <option value="difficulty-desc" className="bg-slate-900">Hardest first</option>
                                </select>
                            </div>

                            {allRows.length === 0 ? (
                                <p className="text-sm text-slate-400">No problems available.</p>
                            ) : (
                                <ProblemTable rows={rows} />
                            )}
                        </section>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div>
            <div className="px-3 pt-3"><Navbar /></div>

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