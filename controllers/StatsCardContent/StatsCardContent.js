import Link from "next/link";
import style from "./statsCardContent.module.scss"
import {declOfNum} from "/utils/string";
import {useState} from "react"

export default function StatsCardContent(props) {
    const [unitIndex, setUnitIndex] = useState(2);
    const units = ['h', 'd', 'w', 'm']
    const stats = props.stats ?? {
        counts: {
            board: null,
            post: {
                per: {
                    h: null,
                    d: null,
                    w: null,
                    m: null
                },
                all: null
            },
            uniqIP: {
                per: {
                    h: null,
                    d: null,
                    w: null,
                    m: null
                },
                all: null
            },
        },
        lastPost: {
            board: null,
            thread: null,
            post: null,
            date: new Date(0)
        }
    };
    const unitDictionary = {
        h: "час",
        d: "день",
        w: "неделю",
        m: "месяц"
    }
    return (
        <div className={style.statsWrap}>
            на данный момент открыто <b>{`${stats.counts.board} ${declOfNum(stats.counts.board, ["доска", "доски", "досок"])}`}</b><br/>

            за{' '}
            <span className={style.unitChanger} onClick={() => {
                let newUnit = (unitIndex + 1) % units.length;
                console.log(units[unitIndex], units[newUnit])
                setUnitIndex(newUnit)
            }}>{unitDictionary[units[unitIndex]]}</span><span style={{zIndex:-1, opacity: 0}}>{unitDictionary[units[unitIndex]]}</span>
            {' '}на имиджборде опубликовано{' '}
            <b>{`${stats.counts.post.per[units[unitIndex]]} ${declOfNum(stats.counts.post.per[units[unitIndex]], ["пост", "поста", "постов"])}`}</b><br/>

            за всё время существования имиджборды опубликовано <b>{`${stats.counts.post.all} ${declOfNum(stats.counts.post.all, ["пост", "поста", "постов"])}`}</b> от <b>{`${stats.counts.uniqIP.all} уник. ${declOfNum(stats.counts.uniqIP.all, ["посетителя", "посетителей", "посетителей"])}`}</b><br/>
        </div>
    )
}