import { Link } from "react-router";

export function NavLink({ to, active = false, children }) {
    return (
        <Link
            to={to}
            className="relative whitespace-nowrap rounded-full px-[18px] py-2 text-[15px] font-medium leading-tight tracking-[0.01em] text-white/55 no-underline transition-colors duration-200 hover:bg-white/[0.06] hover:text-white/85 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-400/60 aria-[current=page]:bg-transparent aria-[current=page]:text-white aria-[current=page]:hover:bg-transparent"
            data-nav-to={to}
            aria-current={active ? "page" : undefined}
        >
            {children}
        </Link>
    );
}