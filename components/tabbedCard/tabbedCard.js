import {useState} from "react";
import Card from "../card/card";
import style from "./tabbedCard.module.scss";
import AnimHeight from "../animHeight/animHeight";

export default function TabbedCard({ items }) {
    const [ active, setActive ] = useState(0);

    const openTab = e => setActive(+e.target.dataset.index);

    return (
        <>
            <Card style={{padding: 4+'px', background:"#0001"}}>
                <div className={style.activeTab + (active === 1 ? ` ${style.last}` : '')}/>
                <div className={style.tab}>
                    {items.map((n, i) => (
                        <button
                            className={i === active ? style.active : ''}
                            onClick={openTab}
                            data-index={i}
                        >
                            {n.name}
                        </button>
                    ))}
                </div>
            </Card>
            <Card>
                <AnimHeight
                    duration={500}
                    height="auto"
                >
                    {items[active].content}
                </AnimHeight>
            </Card>
        </>
    );
}
