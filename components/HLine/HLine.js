import style from "./hLine.module.scss"

export default function HLine(props) {
    return (
        <div className={style.hLine}>
            {props.children}
        </div>
    )
}
