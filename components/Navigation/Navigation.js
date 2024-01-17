import style from "./navigation.module.scss"
import {useState} from "react";
import {a, useSpring} from "react-spring";

function Navigation({ items }) {
    const [ active, setActive ] = useState(0);
    const [ barSettings, setBarSettings ] = useState({top: 6, height: 24});

    const bg = useSpring({
        config: {
            friction: 22
        },
        y: `${barSettings.top}px`,
        height: `${barSettings.height}px`
    });

    const openTab = e => {
        setActive(+e.target.dataset.index);
        console.log(e);
        setBarSettings({...barSettings, height: e.target.clientHeight-10, top: (+e.target.dataset.index/items.length)*(24*items.length)+(16*e.target.dataset.index+6)})
        console.log(barSettings.height);
    }

    return (
        <div className={style.navigation}>
            <aside>
                <a.div className={style.selectedBar} style={bg} />
                <ul className={style.elements + " -no-decor"}>
                    {items.map((n, i) => (
                        <li key={i}>
                            <button onFocus={(e) => { setTimeout(() => e.target.blur(), 0); }}
                                className={i === active ? style.active : ''}
                                onClick={openTab}
                                data-index={i} >
                                {n.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </aside>

            <main>
                {items[active].content}
            </main>
        </div>
    )
}

export default Navigation