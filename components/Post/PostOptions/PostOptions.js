import style from "./postOptions.module.scss"
import Card from "../../Card/Card";

export default function PostOptions(props) {
    return (
        <div className={style.postOptions}>
            {props.children}
        </div>
    )
}
