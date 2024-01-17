import style from "./boardsCardContent.module.scss"
import { useState, useRef, useEffect } from "react";
import {nullish} from "../../utils/polyfill";
import Link from "next/link"

export default function BoardsCardContent({boards}) {
    const [left, setLeft] = useState(0);
    const scrollRef = useRef();
    useEffect(() => {
        const el = scrollRef.current;
        if (el) {
            if (left < 0) setLeft(0);
            else if (left > el.scrollWidth - el.clientWidth) setLeft(el.scrollWidth - el.clientWidth);
            const onWheel = e => {
                if (e.deltaY === 0 || e.deltaX !== 0) return;
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
                        return (
	                        <Link href={`/${nullish(n.title, 404)}/`}>
		                        <tr key={i} className={style.tr}>
	                                <td className={style.boardTitle}>/{nullish(n.title, "-")}/</td>
		                            <td className={style.boardName}>{nullish(n.name, '-')}</td>
		                            <td className={style.boardSpeed}>{nullish(n.speed, '-')}</td>
		                            <td className={style.boardUIP}>{nullish(n.uip, '-')}</td>
		                            <td className={style.boardDesc}>{nullish(n.desc, '-')}</td>
		                            <td className={style.boardTags}>{nullish(n.tags, ['-']).join(", ")}</td>
		                            <td className={style.boardPosts}>{nullish(n.posts, '-')}</td>
		                        </tr>
	                        </Link>)
                    })}
                </tbody>
            </table>
        </div>
    )
}