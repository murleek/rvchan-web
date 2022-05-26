import Link from "next/link";
import style from "./splitted.module.scss"

export default function Splitted(props) {
    return (
        <div className={style.splittedWrap}>
            {props.children}
        </div>
    )
}