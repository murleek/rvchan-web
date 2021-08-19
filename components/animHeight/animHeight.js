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
        height: `${contentHeight}px`
    });

    useEffect(() => {
        setContentHeight(height);
        window.addEventListener("resize", setContentHeight(height));
        return window.removeEventListener("resize", setContentHeight(height));
    }, [height]);

    return (
        <animated.div style={{...expand, overflow: "hidden"}}>
            <div ref={ref}>
                {props.children}
            </div>
        </animated.div>
    );
}
