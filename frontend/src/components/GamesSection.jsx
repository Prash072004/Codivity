import { ArrowRight, ArrowUpRight, Crown, Grid3x3, Hash, RotateCcw, Worm, Zap } from "lucide-react";

// Snake, Sudoku and Tic-Tac-Toe have no routes yet; leave `href` unset until they exist.
const GAMES = [
    {
        title: "Snake",
        description: "Classic arcade game. Eat, grow and avoid collisions.",
        meta: ["Arcade", "2–5 min", "All levels"],
        icon: Worm,
        action: "Play Now",
        border: "from-emerald-400/55 to-cyan-400/35 hover:from-emerald-400/85 hover:to-cyan-400/60",
        glow: "shadow-[0_0_10px_-2px_rgba(52,211,153,0.3)] hover:shadow-[0_0_14px_-2px_rgba(52,211,153,0.45)]",
        tile: "border-emerald-400/40 text-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.18)]",
        accent: "text-emerald-300",
        pill: "border-emerald-400/20",
    },
    {
        title: "Sudoku",
        description: "Train your logic with classic number puzzles.",
        meta: ["Logic", "5–10 min", "Easy–Hard"],
        icon: Grid3x3,
        action: "Play Now",
        border: "from-blue-400/60 to-violet-400/35 hover:from-blue-400/90 hover:to-violet-400/60",
        glow: "shadow-[0_0_10px_-2px_rgba(96,165,250,0.3)] hover:shadow-[0_0_14px_-2px_rgba(96,165,250,0.45)]",
        tile: "border-blue-400/40 text-blue-300 shadow-[0_0_8px_rgba(96,165,250,0.18)]",
        accent: "text-blue-300",
        pill: "border-blue-400/20",
    },
    {
        title: "Tic-Tac-Toe",
        description: "Play a quick game against a friend or AI.",
        meta: ["Strategy", "1–3 min", "AI / 2 Players"],
        icon: Hash,
        action: "Play Now",
        border: "from-violet-400/60 to-blue-400/35 hover:from-violet-400/90 hover:to-blue-400/60",
        glow: "shadow-[0_0_10px_-2px_rgba(167,139,250,0.3)] hover:shadow-[0_0_14px_-2px_rgba(167,139,250,0.45)]",
        tile: "border-violet-400/40 text-violet-300 shadow-[0_0_8px_rgba(167,139,250,0.18)]",
        accent: "text-violet-300",
        pill: "border-violet-400/20",
    },
    {
        title: "Chess",
        description: "Play on Chess.com and challenge players worldwide.",
        meta: ["External Link", "Play Online"],
        icon: Crown,
        action: "Play Chess",
        href: "https://www.chess.com/",
        external: true,
        border: "from-cyan-400/40 to-amber-400/60 hover:from-cyan-400/65 hover:to-amber-400/90",
        glow: "shadow-[0_0_10px_-2px_rgba(251,191,36,0.28)] hover:shadow-[0_0_14px_-2px_rgba(251,191,36,0.42)]",
        tile: "border-amber-400/40 text-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.18)]",
        accent: "text-amber-300",
        pill: "border-amber-400/20",
    },
];

const HIGHLIGHTS = [
    { icon: Zap, label: "Quick to play" },
    { icon: RotateCcw, label: "Back to DSA anytime" },
];

function GameCard({ game }) {
    const { title, description, meta, icon: Icon, action, href, external, border, glow, tile, accent, pill } = game;
    const enabled = Boolean(href);
    const ArrowIcon = external ? ArrowUpRight : ArrowRight;

    const body = (
        <div className="flex h-full flex-col rounded-[19px] bg-[rgba(8,9,12,0.94)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="flex items-start justify-between">
                <span className={`flex size-10 items-center justify-center rounded-xl border bg-black/60 ${tile}`}>
                    <Icon size={20} strokeWidth={1.6} />
                </span>
                <span className="flex size-9 items-center justify-center rounded-full border border-slate-400/20 text-slate-300 transition-[transform,border-color] duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
                    <ArrowIcon size={16} strokeWidth={1.6} />
                </span>
            </div>

            <h3 className="mt-2 mb-0 text-[17px] font-semibold leading-snug text-white">{title}</h3>
            <p className="mt-0.5 mb-0 text-[13px] leading-snug text-slate-400">{description}</p>

            <div className="mt-2 flex flex-wrap gap-1">
                {meta.map((item) => (
                    <span key={item} className={`rounded-full border bg-white/[0.03] px-2 py-px text-[11px] text-slate-300 ${pill}`}>
                        {item}
                    </span>
                ))}
            </div>

            <span className={`mt-2 ${enabled ? `text-sm font-medium ${accent}` : "text-xs text-slate-500"}`}>
                {enabled ? `${action} ${external ? "↗" : "→"}` : "Coming soon"}
            </span>
        </div>
    );

    const base = `group block rounded-[20px] bg-linear-to-br p-px no-underline transition-[box-shadow,background-image] duration-200 motion-reduce:transition-none ${border} ${glow}`;

    if (!enabled) {
        return <div aria-disabled="true" className={`${base} cursor-default opacity-80`}>{body}</div>;
    }

    return (
        <a
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={`${base} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60`}
        >
            {body}
        </a>
    );
}

export function GamesSection() {
    return (
        <section className="w-full px-4 pt-8 pb-10 font-sans md:px-6 xl:px-8">
            <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                <span className="h-px w-8 bg-sky-400" aria-hidden="true" />
                Take a break
            </div>

            <h2 className="mt-3 mb-0 text-[1.625rem] font-bold leading-tight tracking-tight text-white sm:text-[1.75rem] md:text-[1.875rem] lg:text-[2rem]">
                Take a break.
                <span className="block text-slate-400">Play something fun.</span>
            </h2>
            <p className="mt-3 mb-0 max-w-xl text-base leading-relaxed text-slate-400">
                Short games to refresh your mind, improve focus and come back stronger to problem solving.
            </p>

            <ul className="mt-4 mb-0 flex list-none flex-wrap gap-2 p-0">
                {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-2 rounded-full border border-slate-400/15 bg-white/[0.03] px-3 py-1.5 text-sm text-slate-300">
                        <Icon size={14} strokeWidth={1.8} className="text-sky-400" />
                        {label}
                    </li>
                ))}
            </ul>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {GAMES.map((game) => (
                    <GameCard key={game.title} game={game} />
                ))}
            </div>
        </section>
    );
}
