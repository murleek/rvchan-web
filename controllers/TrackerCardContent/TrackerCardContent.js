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

    return (
        <div className={style.trackerWrap}>
            <ul className={"-no-decor"}>
                {
                    posts.map((p) => (
                        <li key={p.id}>
                            <code className={classNames({
                                [style.typeThread]: !p.thread,
                                [style.typePost]: !!p.thread
                            })}>
                                {'['}
                                {!p.thread ? "Т" : "П"}
                                {']'}
                            </code>
                            {' '}
                            <Link href={`/${p.board}${p.thread != null && p.thread != 0 ? `/${p.thread}${p.id != null ? `#${p.id}` : ''}` : `/${p.id}`}`} className={style.board}>
                                {`»${p.board}${p.thread != null && p.thread != 0 ? `»${p.thread}${p.id != null ? `›${p.id}` : ''}` : `»${p.id}`}`}
                            </Link>
                            {' - '}
                            <span>{p.title || ((p.content.length > cut) ? p.content.substr(0, cut-1).trim() + '…' : p.content)}</span>
                            {' '}
                            <span className={style.date}>
                                {'['}
                                {
                                    new Date(p.date.getTime() - new Date().getTimezoneOffset()*60000)
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