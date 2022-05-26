import Link from "next/link";
import style from "./linksCardContent.module.scss"

export default function LinksCardContent() {
    return (
        <div className={style.linksWrap}>
            <div>
                <span className={style.boardSubject}>
                    доски
                </span>
                <span><Link href="/b/">/b/ред</Link></span>
                <span><Link href="/a/">/a/ниме</Link></span>
            </div>
            <div>
                <span className={style.boardSubject}>
                    разное:
                </span>
                <span><Link href="/rules/">правила</Link></span>
                <span><Link href="/docs/">документація</Link></span>
                <span><Link href="/feedback/">жалобы и пожелания</Link></span>
                <span><a href="//t.me/ravechan">канал в телеграме</a></span>
                <span><Link href="mailto:r4v3c4t@pm.me">почта</Link></span>
                <span><Link href="/sys/">рвач-система</Link></span>
            </div>
        </div>
    )
}