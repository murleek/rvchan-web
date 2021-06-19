import Link from "next/link";
import style from "./statsCardContent.module.scss"
import {declOfNum} from "/utils/string";

export default function StatsCardContent() {
    const boardsCount = 0;
    const postPerWeek = 0;
    const postCount = 0;
    const uniqCount = 0;
    const lastPost = {
        board: undefined,
        thread: 0,
        post: 0,
        date: new Date(0)
    };
    return (
        <div className={style.statsWrap}>
            на данный момент открыто <b>{boardsCount} {declOfNum(boardsCount, ["доска", "доски", "досок"])}</b><br/>
            за неделю на имиджборде опубликовано <b>{postPerWeek} {declOfNum(postPerWeek, ["пост", "поста", "постов"])}</b><br/>
            за всё время существования имиджборды опубликовано <b>{postCount} {declOfNum(postCount, ["пост", "поста", "постов"])}</b> постов от <b>{uniqCount} уник. {declOfNum(uniqCount, ["посетителя", "посетителей", "посетителей"])}</b><br/>
            последний пост{' '}
            <a className="-no-decor" href={"/" + lastPost.board + "/" + lastPost.thread + "#" + lastPost.post}>
                »{lastPost.board}»{lastPost.thread}›{lastPost.post}
            </a>
            {' '}был опубликован в <b>{lastPost.date.toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/-/g, '.')}</b>
        </div>
    )
}