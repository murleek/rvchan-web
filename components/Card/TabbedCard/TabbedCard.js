import { useState, useEffect, useRef } from "react";
import Card from "../Card";
import style from "./tabbedCard.module.scss";
import AnimHeight from "../../AnimHeight/AnimHeight";
import { useSpring, useTransition, a, useSpringRef } from "react-spring";
import { useMeasure } from "react-use";

export default function TabbedCard({ items }) {
    const [ active, setActive ] = useState(0);
    const [ left, setLeft ] = useState(0);

    const bg = useSpring({
        config: {
            friction: 22
        },
        left: `${left}%`
    });

    const openTab = e => {
        setActive(+e.target.dataset.index);
        setLeft(+e.target.dataset.index/items.length*100);
    }
    const [heightRef, { height }] = useMeasure();
    const transRef = useSpringRef()
    const transitions = useTransition(active, {
      ref: transRef,
      keys: null,
      from:  { opacity: 0, transform: 'translate3d(0,24px,0)' },
      enter: { opacity: 1, transform: 'translate3d(0,0%,0)' },
      leave: { opacity: 0, transform: 'translate3d(0,24px,0)' },
    })
    useEffect(() => {
      transRef.start()
    }, [active])

    return (
        <>
            <Card bg="#0001" style={{padding: 4+'px'}}>
                <a.div style={{width: `${100/items.length}%`, ...bg}} className={style.activeTab}/>
                <div className={style.tab}>
                    {items.map((n, i) => (
                        <button
                            className={i === active ? style.active : ''}
                            onClick={openTab}
                            data-index={i}
                            key={i}
                            >
                            {n.name}
                        </button>
                    ))}
                </div>
            </Card>
            <Card>
                <AnimHeight wrapStyle={{position: 'relative'}} height={height}>
                    {transitions((style, i) => {
                        const Text = items[i].content
                        return <a.div style={{...style, background:'white', width: '100%', position: 'absolute'}}><div ref={heightRef}>{Text}</div></a.div>
                    })}
                </AnimHeight>
            </Card>
        </>
    );
}
