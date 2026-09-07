export function FeatureCard(props) {
    return <div style={{border: "1px solid white", borderRadius: "24px", padding: "22px 28px", minHeight: "150px"}}>
        <h3>{props.title}</h3>

        <p>{props.description}</p>
        
        <a href={props.link}>
            [ {props.action} → ]
        </a>
    </div>
}