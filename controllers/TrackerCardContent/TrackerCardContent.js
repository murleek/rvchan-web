import Link from "next/link";
import classNames from 'classnames';
import style from "./trackerCardContent.module.scss"

const cut = 64;

export default function TrackerCardContent(props) {
    const posts = (props.posts ?? []).map((p) => {
        if (typeof p.date === "string") {
            p.date = new Date(p.date);
        }
        return p;
    });
    let date = (p) => new Date(p.date.getTime() - new Date().getTimezoneOffset()*60000)
            .toISOString()
            .replace(/T/, ' ')
            .replace(/\..+/, '')
            .replace(/-/g, '.')

    return (
        <div className={style.trackerWrap}>
            <ul className={"-no-decor"}>
                {
                    posts.map((p) => (
                        <Link key={p.id} href={`/${p.board}${p.thread != null && p.thread ? `/${p.thread}${p.id != null ? `#${p.id}` : ''}` : `/${p.id}`}`} className={style.board}>
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
                                {`»${p.board}${p.thread != null && p.thread ? `»${p.thread}${p.id != null ? `›${p.id}` : ''}` : `»${p.id}`}`}
                                {' - '}
                                <span>{p.title || ((p.content.length > cut) ? p.content.substr(0, cut-1).trim() + '…' : p.content)}</span>
                                {' '}
                                <span className={style.dateWrap}>
                                    <span className={style.date}>
                                        {date(p)}
                                    </span>
                                    <span className={style.dateInner}>
                                        <span className={style.date}>
                                            {date(p)}
                                        </span>
                                    </span>
                                </span>
                            </li>
                        </Link>
                    ))
                }
            </ul>
        </div>
    )
}