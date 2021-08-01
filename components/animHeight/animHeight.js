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
        //Sets initial height
        setContentHeight(height);
      
        //Adds resize event listener
        window.addEventListener("resize", setContentHeight(height));
      
        // Clean-up
        return window.removeEventListener("resize", setContentHeight(height));
    }, [height]);

    return (
        <animated.div style={expand}>
            <div ref={ref}>
                {props.children}
            </div>
        </animated.div>
    );
}
