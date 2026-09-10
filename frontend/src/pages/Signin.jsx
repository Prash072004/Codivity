import { Navbar } from "../components/Navbar";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import api from "../services/api";

export function Signin() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ usernameOrEmail: "", password: "" });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        try {
            setLoading(true);

            const value = formData.usernameOrEmail.trim();

            const isEmail = value.includes("@");

            const response = await api.post("/auth/signin", {
                ...(isEmail
                    ? { email: value }
                    : { username: value }),
                password: formData.password
            });

            console.log(response.data);

            // Store JWT
            localStorage.setItem("token", response.data.token);

            const profileResponse = await api.get("/profile");

            console.log(profileResponse.data);

            navigate("/");

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    }

    return <div style={{minHeight: "100vh", backgroundColor: "black", color: "white", padding: "12px", boxSizing: "border-box"}}>
            {/* Navbar */}
            <Navbar showAuth={false} />

            {/* Sign In Form */}
            <div style={{display: "flex", justifyContent: "center", marginTop: "28px",}}>
                <div style={{width: "380px", minHeight: "530px", border: "1px solid white", borderRadius: "35px", padding: "30px", boxSizing: "border-box"}}>
                    {/* Logo */}
                    <div style={{textAlign: "center", marginTop: "30px", marginBottom: "100px", fontSize: "20px", fontWeight: "600"}}>
                        Codivity
                    </div>

                    {/* Error */}
                    {error && (
                        <p
                            style={{
                                textAlign: "center",
                                fontSize: "14px",
                                marginBottom: "15px"
                            }}
                        >
                            {error}
                        </p>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Username or Email"
                            style={{width: "100%", boxSizing: "border-box", padding: "12px", marginBottom: "15px", backgroundColor: "black", color: "white", border: "1px solid white", borderRadius: "6px", fontSize: "14px"}}
                            name="usernameOrEmail"
                            value={formData.usernameOrEmail}
                            onChange={handleChange}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            style={{width: "100%", boxSizing: "border-box", padding: "12px", marginBottom: "15px", backgroundColor: "black", color: "white", border: "1px solid white", borderRadius: "6px", fontSize: "14px"}}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <button
                            type="submit"
                            style={{width: "100%", padding: "12px", marginTop: "2px", backgroundColor: "white", color: "black", border: "1px solid white", borderRadius: "6px", cursor: "pointer", fontSize: "16px", fontWeight: "520"}}
                            disabled={loading}
                        >
                            {loading ? "Signin In..." : "Sign In"}
                        </button>
                    </form>

                    {/* Sign Up option */}
                    <div
                        style={{
                            textAlign: "center",
                            marginTop: "35px",
                            fontSize: "16px",
                        }}
                    >
                        Don't have an account?{" "}
                        <Link to="/signup" style={{color: "white"}}>
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
}