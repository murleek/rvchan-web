import Link from "next/link";
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
            date: new Date(15)
        }
    ];

    return (
        <div className={style.trackerWrap}>
            <ul>
                {
                    posts.map((p) => (
                        <li>
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