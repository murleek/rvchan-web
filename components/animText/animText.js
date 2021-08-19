import { a, useTransition } from "react-spring";

function AnimText(props) {
    const anim = useTransition(props.children, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 }
    })
    return anim((styles, item, key) => ( <a.div key={key} className={props.className} style={styles}>{item}</a.div> ))
}

export default AnimText