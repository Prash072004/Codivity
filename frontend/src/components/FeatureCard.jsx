import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

export function FeatureCard({ icon: Icon, title, description, action, link }) {
    return <Link
        to={link}
        className="group flex items-center gap-4 rounded-[18px] border border-slate-400/15 bg-linear-to-b from-white/[0.045] to-white/[0.015] bg-[rgba(10,12,16,0.7)] p-4 font-sans no-underline shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] transition-[border-color,background-color] duration-200 hover:border-slate-300/30 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 max-sm:p-4"
    >
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-slate-400/15 bg-white/[0.04] text-sky-400">
            <Icon size={22} strokeWidth={1.6} />
        </span>

        <span className="min-w-0 flex-1">
            <span className="block text-lg font-semibold text-white">{title}</span>
            <span className="mt-1 block text-[15px] leading-relaxed text-slate-400">{description}</span>
            <span className="mt-2 block text-sm font-medium text-sky-400">{action} →</span>
        </span>

        <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-slate-400/20 text-slate-300 transition-[transform,border-color] duration-200 group-hover:translate-x-0.5 group-hover:border-slate-300/40 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
            <ArrowRight size={18} strokeWidth={1.6} />
        </span>
    </Link>
}