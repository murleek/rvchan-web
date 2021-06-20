import Link from "next/link";
import classNames from 'classnames';
import style from "./trackerCardContent.module.scss"

export default function TrackerCardContent() {
    const posts = [
        {
            id: 1,
            board: "pussy",
            title: "СУПЕРКЛАССНЫЙ ТРЕД!!!!!!!!!!!!!!!",
            content: {
                files: [],
                caption: "СУПЕРКЛАССНЫЙ ТРЕД!!!!!!!!!!!!!!!\n\nСоснешь?"
            },
            date: new Date(0)
        },
        {
            id: 2,
            board: "pussy",
            thread: 1,
            title: "ДА!!!", 
            content: {
                files: [],
                caption: "ДА!!!"
            },
            date: new Date(15000)
        }
    ];

    return (
        <div className={style.trackerWrap}>
            <ul>
                {
                    posts.reverse().slice(0,50).map((p) => (
                        <li>
                            <code className={classNames({
                                [style.typeThread]: !p.thread,
                                [style.typePost]: !!p.thread
                            })}>
                                {'['}
                                {!p.thread ? "Т" : "П"}
                                {']'}
                            </code>
                            {' '}
                            <span className={style.board}>
                                /{p.board}/
                            </span>
                            {' - '}
                            <Link href={`/${p.board}/${p.id}`}>{p.title || p.content.caption}</Link>
                            {' '}
                            <span className={style.date}>
                                {'['}
                                {
                                    p.date
                                        .toISOString()
                                        .replace(/T/, ' ')
                                        .replace(/\..+/, '')
                                        .replace(/-/g, '.')
                                }
                                {']'}
                            </span>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}