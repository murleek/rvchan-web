import Link from "next/link";
import style from "./linksCardContent.module.scss"

export default function LinksCardContent() {
    return (
        <div className={style.linksWrap}>
            <div>
                <li className={style.boardSubject}>
                    доски
                </li>
                <li><Link href="/b/">/b/ред</Link></li>
                <li><Link href="/a/">/a/ниме</Link></li>
            </div>
            <div>
                <li className={style.boardSubject}>
                    разное:
                </li>
                <li><Link href="/rules/">правила</Link></li>
                <li><Link href="/docs/">документація</Link></li>
                <li><Link href="/feedback/">жалобы и пожелания</Link></li>
                <li><Link href="//t.me/ravechan">канал в телеграме</Link></li>
                <li><Link href="mailto:r4v3c4t@pm.me">почта</Link></li>
            </div>
        </div>
    )
}