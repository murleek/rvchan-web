import Link from "next/link";
import style from "./linksCardContent.module.scss"

export default function LinksCardContent() {
    return (
        <div className={style.linksWrap}>
            <ul>
                <li className={style.boardSubject}>контакты</li>
                <li><Link href="//t.me/lumus_maximus">марья</Link></li>
                <li><Link href="//t.me/troit5ky">степендия</Link></li>
                <li><Link href="mailto:r4v3c4t@pm.me">админ</Link></li>

                <li className={style.boardSubject}>разное</li>
                <li><Link href="/test0f1a/">/test0f1a/</Link></li>
                <li><Link href="//t.me/ravechan">канал в телеграме</Link></li>

                <li className={style.boardSubject}>тематичексие</li>
                <li><Link href="/a/">/a/</Link></li>

                <li className={style.boardSubject}>в будущем:</li>
                <li><Link href="/rules/">правила</Link></li>
                <li><Link href="/docs/">документація</Link></li>
                <li><Link href="/feedback/">жалобы и пожелания</Link></li>
            </ul>
        </div>
    )
}