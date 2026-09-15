import { BrowserRouter, Routes, Route } from "react-router";
import { Home } from "./pages/Home";
import { ProblemSet } from "./pages/ProblemSet";
import { CustomContest } from "./pages/CustomContest";
import { Leaderboard } from "./pages/Leaderboard";
import { Discuss } from "./pages/Discuss";
import { About } from "./pages/About";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { CreateSheet } from "./pages/CreateSheet";
import { Profile } from "./pages/Profile";
import { Problem } from "./pages/Problem";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problem-set" element={<ProblemSet />} />
        <Route path="/problem-set/:slug" element={<Problem />} />
        <Route path="/custom-contest" element={<CustomContest />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/discuss" element={<Discuss />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create-sheet" element={<CreateSheet/>} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/problem/:slug" element={<Problem />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
