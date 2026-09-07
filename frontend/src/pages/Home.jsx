import { Navbar } from "../components/Navbar";
import { FeatureCard } from "../components/FeatureCard";

export function Home() {
    return <div style={{minHeight: "100vh", backgroundColor: "black", color: "white", padding: "12px", boxSizing: "border-box"}}>
        <Navbar />
        
        <section style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "15px"}}>
            {/* Problem Set */}
            <FeatureCard
                title="Problem Set"
                description="Practice DSA problems organized by topic and difficulty."
                action="Explore Problems"
                link="/problem-set"
            />
            {/* Custom Contest */}
            <FeatureCard
                title="Custom Contests"
                description="Create your own timed contest using problems from the Problem Set."
                action="Create Contest"
                link="/custom-contest"
            />
            {/* Create DSA Sheet */}
            <FeatureCard
                title="Create DSA Sheet"
                description="Create your own personalized collection of problems and track your preparation."
                action="Create Sheet"
                link="/create-sheet"
            />
            {/* Your Progress */}
            <FeatureCard
                title="Your Progress"
                description="Track solved problems and improve your skills."
                action="View Progress"
                link="/profile"
            />
        </section>   
    </div> 
}