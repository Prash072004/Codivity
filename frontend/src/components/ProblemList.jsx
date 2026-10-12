import { Link } from "react-router";
import { CheckCircle2, ChevronRight, Circle, CircleDot } from "lucide-react";

const DIFFICULTY_STYLES = {
    Easy: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
    Medium: "border-amber-400/25 bg-amber-400/10 text-amber-300",
    Hard: "border-rose-400/25 bg-rose-400/10 text-rose-300",
};

function StatusIcon({ status }) {
    if (status === "Solved") return <CheckCircle2 size={18} strokeWidth={1.6} className="text-emerald-400" aria-label="Solved" />;
    if (status === "Attempted") return <CircleDot size={18} strokeWidth={1.6} className="text-amber-300/80" aria-label="Attempted" />;
    return <Circle size={18} strokeWidth={1.6} className="text-slate-600" aria-label="Unattempted" />;
}

export function ProblemTable({ rows }) {
    if (rows.length === 0) {
        return <p className="m-0 py-10 text-center text-sm text-slate-400">No problems match your filters.</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
                <thead>
                    <tr className="border-b border-slate-400/15 text-xs uppercase tracking-[0.12em] text-slate-500">
                        <th className="py-2.5 pr-3 font-medium">Problem</th>
                        <th className="hidden px-3 py-2.5 font-medium md:table-cell">Topic</th>
                        <th className="px-3 py-2.5 font-medium">Difficulty</th>
                        <th className="px-3 py-2.5 text-center font-medium">Status</th>
                        <th className="w-8 py-2.5" aria-hidden="true" />
                    </tr>
                </thead>
                <tbody>
                    {rows.map((item) => (
                        <tr key={item._id} className="border-b border-slate-400/10 transition-colors duration-150 hover:bg-white/[0.03] motion-reduce:transition-none">
                            <td className="h-12 py-2 pr-3">
                                <Link
                                    to={`/problem/${item.slug}`}
                                    className="rounded text-[15px] font-medium text-white no-underline hover:text-sky-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
                                >
                                    {item.title}
                                </Link>
                                <span className="block text-xs text-slate-500 md:hidden">{item.topicName}</span>
                            </td>
                            <td className="hidden px-3 text-sm text-slate-400 md:table-cell">{item.topicName}</td>
                            <td className="px-3">
                                <span className={`rounded-full border px-2.5 py-0.5 text-xs ${DIFFICULTY_STYLES[item.difficulty] ?? ""}`}>
                                    {item.difficulty}
                                </span>
                            </td>
                            <td className="px-3 text-center" title={item.status}>
                                <span className="inline-flex"><StatusIcon status={item.status} /></span>
                            </td>
                            <td className="w-8 text-right">
                                <Link
                                    to={`/problem/${item.slug}`}
                                    aria-label={`Open ${item.title}`}
                                    className="inline-flex rounded text-slate-500 hover:text-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
                                >
                                    <ChevronRight size={18} strokeWidth={1.6} />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function ProgressSummary({ solved, total, signedIn }) {
    if (!signedIn || total === 0) {
        return <p className="m-0 text-sm text-slate-400">{total === 0 ? "No problems yet" : "Sign in to track your progress"}</p>;
    }

    const percent = Math.round((solved / total) * 100);
    const radius = 20;
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="flex items-center gap-3">
            <svg width="52" height="52" viewBox="0 0 52 52" role="img" aria-label={`${percent}% complete`}>
                <circle cx="26" cy="26" r={radius} fill="none" strokeWidth="4" className="stroke-slate-400/15" />
                <circle
                    cx="26" cy="26" r={radius} fill="none" strokeWidth="4" strokeLinecap="round"
                    className="stroke-cyan-400"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * (1 - solved / total)}
                    transform="rotate(-90 26 26)"
                />
                <text x="26" y="30" textAnchor="middle" className="fill-white text-[11px] font-medium">{percent}%</text>
            </svg>
            <div>
                <div className="text-lg font-semibold leading-tight text-white">{solved} / {total}</div>
                <div className="text-xs text-slate-400">Solved</div>
            </div>
        </div>
    );
}
