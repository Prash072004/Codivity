import { Navbar } from "../components/Navbar";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import api from "../services/api";

export function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        email: ""
    });

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

        if(formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/auth/signup", {
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });

            console.log(response.data);

            navigate("/signin");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return <div style={{minHeight: "100vh", backgroundColor: "black", color: "white", padding: "12px", boxSizing: "border-box"}}>
        {/* Navbar */}
        <Navbar showAuth={false} />

        {error && (
            <p
                style={{
                    color: "white",
                    textAlign: "center",
                    fontSize: "14px",
                    marginBottom: "15px",
                }}
            >
                {error}
            </p>
        )}

        {/* Sign Up Form */}
        <div style={{display: "flex", justifyContent: "center", marginTop: "28px"}}>
            <div style={{width: "380px", minHeight: "530px", border: "1px solid white", borderRadius: "35px", padding: "30px", boxSizing: "border-box",}}>
                {/* Logo */}
                <div style={{textAlign: "center", marginTop: "30px", marginBottom: "30px", fontSize: "20px", fontWeight: "600"}}>
                    Codivity
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        style={{width: "100%", boxSizing: "border-box", padding: "12px", marginBottom: "15px", backgroundColor: "black", color: "white", border: "1px solid white", borderRadius: "6px", fontSize: "14px"}}
                        name="username"
                        value={formData.username}
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

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        style={{width: "100%", boxSizing: "border-box", padding: "12px", marginBottom: "15px", backgroundColor: "black", color: "white", border: "1px solid white", borderRadius: "6px", fontSize: "14px"}}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        style={{width: "100%", boxSizing: "border-box", padding: "12px", marginBottom: "15px", backgroundColor: "black", color: "white", border: "1px solid white", borderRadius: "6px", fontSize: "14px"}}
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={{width: "100%", padding: "12px", marginTop: "2px", backgroundColor: "white", color: "black", border: "1px solid white", borderRadius: "6px", cursor: "pointer", fontSize: "16px", fontWeight: "520"}}
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
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