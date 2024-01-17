import { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import { useMeasure } from "react-use";

export default function AnimHeight(props) {
    const [contentHeight, setContentHeight] = useState(0);
    const [ref, { height }] = useMeasure();
    const expand = useSpring({
        config: {
            mass: 1.1,
            tension: 220
        },
        height: props.zeroHeight ? '0px' : `${contentHeight}px`
    });

    useEffect(() => {
        if (props.height) {
            setContentHeight(props.height);
            return;
        }
        setContentHeight(height);
        window.addEventListener("resize", setContentHeight(height));
        return window.removeEventListener("resize", setContentHeight(height));
    }, [height, props.height]);

    return (
        <animated.div style={{...expand, overflow: props.noOverflow || "hidden"}}>
            <div ref={ref} style={props.wrapStyle}>
                {props.children}
            </div>
        </animated.div>
    );
}
