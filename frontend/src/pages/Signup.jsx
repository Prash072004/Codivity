import { Navbar } from "../components/Navbar";

export function Signup() {
    return <div style={{minHeight: "100vh", backgroundColor: "black", color: "white", padding: "12px", boxSizing: "border-box"}}>
        {/* Navbar */}
        <Navbar showAuth={false} />

        {/* Sign Up Form */}
        <div style={{display: "flex", justifyContent: "center", marginTop: "28px"}}>
            <div style={{width: "380px", minHeight: "530px", border: "1px solid white", borderRadius: "35px", padding: "30px", boxSizing: "border-box",}}>
                {/* Logo */}
                <div style={{textAlign: "center", marginTop: "30px", marginBottom: "30px", fontSize: "20px", fontWeight: "600"}}>
                    Codivity
                </div>

                {/* Form */}
                <form>
                    <input
                        type="text"
                        placeholder="Username"
                        style={{width: "100%", boxSizing: "border-box", padding: "12px", marginBottom: "15px", backgroundColor: "black", color: "white", border: "1px solid white", borderRadius: "6px", fontSize: "14px"}}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        style={{width: "100%", boxSizing: "border-box", padding: "12px", marginBottom: "15px", backgroundColor: "black", color: "white", border: "1px solid white", borderRadius: "6px", fontSize: "14px"}}

                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        style={{width: "100%", boxSizing: "border-box", padding: "12px", marginBottom: "15px", backgroundColor: "black", color: "white", border: "1px solid white", borderRadius: "6px", fontSize: "14px"}}

                    />

                    <input
                        type="email"
                        placeholder="Email"
                        style={{width: "100%", boxSizing: "border-box", padding: "12px", marginBottom: "15px", backgroundColor: "black", color: "white", border: "1px solid white", borderRadius: "6px", fontSize: "14px"}}
                    />

                    <button
                        type="submit"
                        style={{width: "100%", padding: "12px", marginTop: "2px", backgroundColor: "white", color: "black", border: "1px solid white", borderRadius: "6px", cursor: "pointer", fontSize: "16px", fontWeight: "520"}}
                    >
                        Sign Up
                    </button>
                </form>

                {/* Sign In option */}
                <div style={{textAlign: "center", marginTop: "35px", fontSize: "16px"}}>
                    Have an account?{" "}
                    <Link to="/signin" style={{color: "white"}}>
                        Login
                    </Link>
                </div>
            </div>
        </div>
    </div>
}