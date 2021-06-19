import stc from "string-to-color";

export default function SessionBall(props) {
    const borderSize = props.borderSize || 1;
    const privToken = stc(props.privToken) || "#000000";
    const session = stc(props.session) || "#000000";
    const width = props.width || 20;
    const height = props.height || 20;
    const radius = props.borderRadius || 50;
    const clip = !!props.clip;
    const solid = !!props.solid;
    const reverse = !!props.reverse;
    const outercolor = !solid ? "linear-gradient(45deg," + privToken + ',' + session + ')' : session;
    const color = !solid ? "linear-gradient(45deg," + session + ',' + privToken + ')' : privToken;
    return (
        <div style={
            {
                ...props.outerStyle,
                borderRadius: radius+'%',
                display: "table",
                alignItems: "center",
                background: reverse ? color : outercolor,
                padding: borderSize
            }} className="sessionBall">
            <div style={
                {
                    ...props.style,
                    borderRadius: radius+'%',
                    width: (width) - (clip ? borderSize * 2 : 0),
                    height: (height) - (clip ? borderSize * 2 : 0),
                    background: reverse ? outercolor : color
                }} className="innerSessionBall" />
        </div>
    )
}