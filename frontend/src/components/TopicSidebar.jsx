import { useEffect, useLayoutEffect, useRef, useState } from "react";

export function TopicSidebar({ topics, selected, onSelect }) {
    const listRef = useRef(null);
    const pillRef = useRef(null);
    const rowRefs = useRef(new Map());
    const [animate, setAnimate] = useState(false);

    // Position before paint; transitions are enabled only after the first placement.
    useLayoutEffect(() => {
        const row = rowRefs.current.get(selected);
        const pill = pillRef.current;
        if (!row || !pill) return;
        pill.style.transform = `translateY(${row.offsetTop}px)`;
        pill.style.height = `${row.offsetHeight}px`;
        pill.style.opacity = "1";
    }, [selected, topics]);

    useEffect(() => {
        const id = requestAnimationFrame(() => setAnimate(true));
        return () => cancelAnimationFrame(id);
    }, []);

    return (
        <aside
            aria-label="Topics"
            className="flex max-h-[calc(100vh-2rem)] w-60 shrink-0 flex-col self-start rounded-2xl border border-sky-300/15 bg-[rgba(8,12,20,0.7)] p-3 font-sans text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md md:sticky md:top-4 max-md:max-h-64 max-md:w-full"
        >
            <h2 className="m-0 mb-2 px-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400">Topics</h2>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <ul ref={listRef} className="relative m-0 flex list-none flex-col gap-0.5 p-0">
                    <span
                        ref={pillRef}
                        aria-hidden="true"
                        style={{ opacity: 0 }}
                        className={`pointer-events-none absolute inset-x-0 top-0 z-0 rounded-lg border border-sky-400/25 bg-sky-500/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_0_12px_rgba(56,189,248,0.12)] before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-full before:bg-cyan-400 ${
                            animate ? "transition-transform duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none" : ""
                        }`}
                    />
                    {topics.map((topic) => {
                        const active = topic.key === selected;
                        return (
                            <li key={topic.key}>
                                <button
                                    type="button"
                                    ref={(el) => {
                                        if (el) rowRefs.current.set(topic.key, el);
                                        else rowRefs.current.delete(topic.key);
                                    }}
                                    aria-pressed={active}
                                    onClick={() => onSelect(topic.key)}
                                    className={`relative z-10 flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border-0 bg-transparent px-3 text-left text-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 motion-reduce:transition-none ${
                                        active ? "text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
                                    }`}
                                >
                                    <span className="truncate">{topic.name}</span>
                                    <span className={`shrink-0 text-xs tabular-nums ${active ? "text-sky-200" : "text-slate-500"}`}>{topic.count}</span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </aside>
    );
}
