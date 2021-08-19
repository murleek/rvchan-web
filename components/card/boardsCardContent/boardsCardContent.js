import style from "./boardsCardContent.module.scss"
import { useState, useRef, useEffect } from "react";

export default function BoardsCardContent() {
    const boards = [
        {
            title: "b",
            name: "/b/ред",
            speed: 50,
            uip: 50,
            desc: "доска, где правил нету",
            tags: [
                "бред"
            ],
            posts: 50
        },
        {
            title: "a",
            name: "/a/ниме",
            speed: 50,
            uip: 50,
            desc: "если ты не анимешник, то не заходи сюда",
            tags: [
                "аниме",
                "2d",
                "вайфу"
            ],
            posts: 50
        },
        {
            title: "dev",
            name: "/dev/елоперы",
            speed: 50,
            uip: 50,
            desc: "разработчики тут",
            tags: [
                "разработка",
                "компьютер"
            ],
            posts: 50
        }
    ]

    const [left, setLeft] = useState(0);
    const scrollRef = useRef();
    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            if (left < 0) setLeft(0);
            else if (left > el.scrollWidth - el.clientWidth) setLeft(el.scrollWidth - el.clientWidth);
            const onWheel = e => {
                if (e.deltaY == 0 || e.deltaX != 0) return;
                if (!(el.scrollLeft === 0 && e.deltaY < 0) 
                    && !(el.scrollWidth - el.clientWidth - Math.round(el.scrollLeft) === 0 
                    && e.deltaY > 0)) {
                    e.preventDefault();
                }
                el.scrollTo({
                    left: left + e.deltaY,
                    behavior: "smooth"
                });
                setLeft(left + e.deltaY);
            };
            el.addEventListener("wheel", onWheel);
            return () => el.removeEventListener("wheel", onWheel);
        }
    }, [left]);

    return (
        <div ref={scrollRef} className={style.tableWrap}>
            <table className={style.table}>
                <thead className={style.thead}>
                    <tr>
                        <th className={style.boardTitle}>Доска</th>
                        <th className={style.boardName}>Название</th>
                        <th className={style.boardSpeed}>П/н</th>
                        <th className={style.boardUIP}>Уник IP</th>
                        <th className={style.boardDesc}>Описание</th>
                        <th className={style.boardTags}>Теги</th>
                        <th className={style.boardPosts}>Постов</th>
                    </tr>
                </thead>
                <tbody className={style.tbody}>
                    { boards.map((n, i) => {
                        return (<tr key={i} className={style.tr}>
                            <td className={style.boardTitle}>/{n.title}/</td>
                            <td className={style.boardName}>{n.name}</td>
                            <td className={style.boardSpeed}>{n.speed}</td>
                            <td className={style.boardUIP}>{n.uip}</td>
                            <td className={style.boardDesc}>{n.desc}</td>
                            <td className={style.boardTags}>{n.tags.join(", ")}</td>
                            <td className={style.boardPosts}>{n.posts}</td>
                        </tr>)
                    })}
                </tbody>
            </table>
        </div>
    )
}