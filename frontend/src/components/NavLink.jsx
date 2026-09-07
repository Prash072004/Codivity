import { Link } from "react-router";

export function NavLink(props) {
    return <Link to={props.to} style={{color: "white", textDecoration: "none", padding: "10px 15px", border: "1px solid white", borderRadius: "6px"}}>
        {props.children}
    </Link>
}