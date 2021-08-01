import Link from "next/link";
import style from "./statsCardContent.module.scss"
import {declOfNum} from "/utils/string";

export default function StatsCardContent() {
    const boardsCount = 404;
    const postPerWeek = 404;
    const postCount = 404;
    const uniqCount = 404;
    const lastPost = {
        board: "err",
        thread: 404,
        post: 404,
        date: new Date(14640000)
    };
    return (
        <div className={style.statsWrap}>
            на данный момент открыто <b>{`${boardsCount} ${declOfNum(boardsCount, ["доска", "доски", "досок"])}`}</b><br/>
            за неделю на имиджборде опубликовано <b>{`${postPerWeek} ${declOfNum(postPerWeek, ["пост", "поста", "постов"])}`}</b><br/>
            за всё время существования имиджборды опубликовано <b>{`${postCount} ${declOfNum(postCount, ["пост", "поста", "постов"])}`}</b> постов от <b>{`${uniqCount} уник. ${declOfNum(uniqCount, ["посетителя", "посетителей", "посетителей"])}`}</b><br/>
            последний пост{' '}
            <Link className="-no-decor" href={"/" + lastPost.board + "/" + lastPost.thread + "#" + lastPost.post}>
                {`»${lastPost.board}»${lastPost.thread}›${lastPost.post}`}
            </Link>
            {' '}был опубликован в <b>{lastPost.date.toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/-/g, '.')}</b>
        </div>
    )
}