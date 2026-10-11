import { Link, useLocation } from "react-router";
import { NavLink } from "./NavLink";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import api from "../services/api";

const PILL_ANIMATION = "transition-[transform,width,height] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none".split(" ");

// Survives Navbar remounts (each page renders its own Navbar) so the pill can slide from its last spot.
let lastPill = null;

const NAV_ROUTES = [
    "/problem-set",
    "/custom-contest",
    "/leaderboard",
    "/discuss",
    "/about",
    "/signin",
    "/signup",
    "/profile",
];

function getActiveRoute(pathname) {
    if (pathname.startsWith("/problem/")) return "/problem-set";
    return NAV_ROUTES.find((r) => pathname === r || pathname.startsWith(r + "/")) ?? null;
}

export function Navbar({showAuth = true}) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { pathname } = useLocation();
    const activeRoute = getActiveRoute(pathname);
    const containerRef = useRef(null);
    const pillRef = useRef(null);

    useEffect(() => {
        let cancelled = false;

        api.get("/profile")
            .then(() => {
                if (!cancelled) setIsAuthenticated(true);
            })
            .catch(() => {
                if (!cancelled) setIsAuthenticated(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    useLayoutEffect(() => {
        const container = containerRef.current;
        const pill = pillRef.current;
        if (!container || !pill) return;

        const apply = (animate) => {
            const link = activeRoute
                ? container.querySelector(`[data-nav-to="${activeRoute}"]`)
                : null;
            if (!link) {
                pill.style.opacity = "0";
                lastPill = null;
                return;
            }
            const c = container.getBoundingClientRect();
            const l = link.getBoundingClientRect();
            const next = { x: l.left - c.left, y: l.top - c.top, w: l.width, h: l.height };
            const set = (p) => {
                pill.style.transform = `translate(${p.x}px, ${p.y}px)`;
                pill.style.width = `${p.w}px`;
                pill.style.height = `${p.h}px`;
            };

            pill.classList.remove(...PILL_ANIMATION);
            if (animate && lastPill) {
                set(lastPill);
                void pill.offsetWidth; // commit start position before transitioning
                pill.classList.add(...PILL_ANIMATION);
            }
            set(next);
            pill.style.opacity = "1";
            lastPill = next;
        };

        apply(true);
        const ro = new ResizeObserver(() => apply(false));
        ro.observe(container);
        return () => ro.disconnect();
    }, [activeRoute, showAuth, isAuthenticated]);

    return <nav ref={containerRef} className="relative flex flex-wrap items-center gap-x-3 gap-y-2 md:mt-1 rounded-2xl border border-white/12 bg-linear-to-b from-white/6 to-black/60 bg-[rgba(8,8,10,0.8)] px-4 py-2 font-sans text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <span ref={pillRef} className="pointer-events-none absolute left-0 top-0 z-0 rounded-full border border-white/30 bg-linear-to-b from-white/30 via-white/14 to-white/8 will-change-transform shadow-[inset_0_1px_0_rgba(255,255,255,0.5),inset_0_-1px_0_rgba(255,255,255,0.08),0_6px_18px_rgba(0,0,0,0.5)] backdrop-blur-md" style={{opacity: 0}} aria-hidden="true" />

        {/* Logo */}
        <Link to="/" className="relative z-10 flex items-center gap-2">
            <img src="/codivity-logo.png" alt="Codivity"
                className="h-14 w-auto object-contain"
            />
        </Link>

        {/* Navigation Links */}
        <div className="relative z-10 ml-[clamp(0px,6vw,96px)] flex flex-wrap items-center gap-1 max-sm:order-3 max-sm:ml-0 max-sm:w-full">
            {[
                ["/problem-set", "Problem Set"],
                ["/custom-contest", "Custom Contest"],
                ["/leaderboard", "Leaderboard"],
                ["/discuss", "Discuss"],
                ["/about", "About"],
            ].map(([to, label]) => (
                <NavLink key={to} to={to} active={activeRoute === to}>{label}</NavLink>
            ))}
        </div>

        {/* Authentication */}
        {showAuth && !isAuthenticated && (
            <div className="relative z-10 ml-auto flex flex-wrap items-center gap-1">
                <NavLink to="/signin" active={activeRoute === "/signin"}>Login</NavLink>
                <NavLink to="/signup" active={activeRoute === "/signup"}>Sign Up</NavLink>
            </div>
        )}

        {showAuth && isAuthenticated && (
            <div className="relative z-10 ml-auto flex flex-wrap items-center gap-1">
                <NavLink to="/profile" active={activeRoute === "/profile"}>Profile</NavLink>
            </div>
        )}
    </nav>
}