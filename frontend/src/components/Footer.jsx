import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";

const GITHUB_URL = "https://github.com/Prash072004";
const LINKEDIN_URL = "https://www.linkedin.com/in/prashant-r-33991a2a8";

const PRODUCT_LINKS = [
    { to: "/problem-set", label: "Problem Set" },
    { to: "/custom-contest", label: "Custom Contest" },
    { to: "/leaderboard", label: "Leaderboard" },
    { to: "/discuss", label: "Discuss" },
];

const linkClass =
    "w-fit rounded text-[15px] text-slate-400 no-underline transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 motion-reduce:transition-none";

function GithubIcon() {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.02 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.27 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
        </svg>
    );
}

function LinkedinIcon() {
    return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
        </svg>
    );
}

function ProfileCard({ href, icon, title, description }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 rounded-xl border border-slate-400/15 bg-white/[0.03] p-3 no-underline transition-colors duration-200 hover:border-cyan-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 motion-reduce:transition-none"
        >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-400/20 bg-black/50 text-slate-200 transition-colors duration-200 group-hover:text-cyan-300">
                {icon}
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium text-white">{title}</span>
                <span className="block text-[13px] text-slate-400">{description}</span>
            </span>
            <ArrowUpRight size={16} strokeWidth={1.6} className="shrink-0 text-slate-400 transition-colors duration-200 group-hover:text-cyan-300" aria-hidden="true" />
        </a>
    );
}

function ColumnHeading({ children }) {
    return <h3 className="m-0 mb-3 text-xs font-medium uppercase tracking-[0.16em] text-slate-300">{children}</h3>;
}

export function Footer() {
    return (
        <footer className="w-full px-4 pb-6 font-sans md:px-6 xl:px-8">
            <div className="rounded-[18px] border border-slate-400/15 bg-[rgba(8,9,12,0.9)] px-6 pt-8 pb-5 max-sm:px-5">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
                    <div>
                        <Link to="/" aria-label="Codivity home" className="inline-block rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60">
                            <img src="/codivity-logo.png" alt="Codivity" className="h-12 w-auto object-contain" />
                        </Link>
                        <p className="mt-3 mb-0 text-[15px] leading-relaxed text-slate-300">Practice. Compete. Track. Improve.</p>
                        <p className="mt-1 mb-0 text-[15px] leading-relaxed text-slate-400">A focused platform for problem solvers.</p>
                    </div>

                    <nav aria-label="Product">
                        <ColumnHeading>Product</ColumnHeading>
                        <ul className="m-0 flex list-none flex-col gap-2 p-0">
                            {PRODUCT_LINKS.map(({ to, label }) => (
                                <li key={to}><Link to={to} className={linkClass}>{label}</Link></li>
                            ))}
                        </ul>
                    </nav>

                    <nav aria-label="Explore">
                        <ColumnHeading>Explore</ColumnHeading>
                        <ul className="m-0 flex list-none flex-col gap-2 p-0">
                            <li><Link to="/create-sheet" className={linkClass}>DSA Sheets</Link></li>
                            <li><a href="#take-a-break" className={linkClass}>Take a Break</a></li>
                            <li><Link to="/about" className={linkClass}>About Codivity</Link></li>
                        </ul>
                    </nav>

                    <div>
                        <ColumnHeading>Connect</ColumnHeading>
                        <div className="flex flex-col gap-2">
                            <ProfileCard href={GITHUB_URL} icon={<GithubIcon />} title="GitHub" description="Projects & source code" />
                            <ProfileCard href={LINKEDIN_URL} icon={<LinkedinIcon />} title="LinkedIn" description="Professional profile" />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex flex-col gap-1 border-t border-slate-400/15 pt-4 text-[13px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                    <p className="m-0">© {new Date().getFullYear()} Codivity. All rights reserved.</p>
                    <p className="m-0">
                        Built with <span className="text-cyan-400" aria-label="love">♥</span> by Prashant for problem solvers.
                    </p>
                </div>
            </div>
        </footer>
    );
}
