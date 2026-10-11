import { Navbar } from "../components/Navbar";
import { FeatureCard } from "../components/FeatureCard";
import { FileCode, Trophy, ChartColumn, Library } from "lucide-react";

export function Home() {
    return <div style={{minHeight: "100vh", backgroundColor: "black", color: "white", padding: "12px", boxSizing: "border-box"}}>
        <Navbar />
        
        <section className="w-full px-4 pt-8 pb-8 font-sans md:px-6 xl:px-8 max-sm:pt-6">
            <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                <span className="h-px w-8 bg-sky-400" aria-hidden="true" />
                Why Codivity
            </div>

            <div className="mt-3 grid items-center gap-5 md:grid-cols-[1.4fr_1fr] md:gap-10">
                <h2 className="m-0 text-[1.75rem] font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-[2.5rem] lg:text-[3rem]">
                    Everything you need to
                    <span className="block text-slate-400">grow as a problem solver.</span>
                </h2>
                <p className="m-0 text-base leading-relaxed text-slate-400 md:border-l md:border-slate-400/20 md:pl-8">
                    A focused set of tools to help you practice, compete and track your progress — all in one place.
                </p>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2">
                <FeatureCard
                    icon={FileCode}
                    title="Problem Set"
                    description="Practice DSA problems organized by topic and difficulty."
                    action="Explore Problems"
                    link="/problem-set"
                />
                <FeatureCard
                    icon={Trophy}
                    title="Custom Contests"
                    description="Create focused practice sessions with your own problems and rules."
                    action="Create Contest"
                    link="/custom-contest"
                />
                <FeatureCard
                    icon={ChartColumn}
                    title="Track Progress"
                    description="Review your solving activity and find what to improve."
                    action="View Progress"
                    link="/profile"
                />
                <FeatureCard
                    icon={Library}
                    title="DSA Sheets"
                    description="Organize structured problem sets for every stage of your preparation."
                    action="Explore Sheets"
                    link="/create-sheet"
                />
            </div>
        </section>
    </div>
}