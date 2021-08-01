import { useState } from "react";
import Card from "../card/card";
import style from "./tabbedCard.module.scss";
import AnimHeight from "../animHeight/animHeight";
import { useSpring, a } from "react-spring";
import { useDrag } from '@use-gesture/react'

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
                <AnimHeight>
                    {items[active].content}
                </AnimHeight>
            </Card>
        </>
    );
}
