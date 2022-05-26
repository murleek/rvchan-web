import style from "./button.module.scss"
import Link from "next/link"

export default function Button(props) {
    return (
        <Link href={props.href}>
            <div className={style.button + (!props.className ? '' : ' ' + props.className)} style={props.style}>
                {props.children}
            </div>
        </Link>
    )
}
