import Link from "next/link";
import Image from "next/image";
import classNames from 'classnames';
import style from "./postformbutton.module.scss"
import { a } from "react-spring"

export default function PostFormButton(props) {
    return (
        <a.button onFocus={(e) => { setTimeout(() => e.target.blur(), 200); }} type="button" style={{...props.animation, background: props.bg, fill: props.fg, color: props.fg}} className={style.button + (props.showText ? ` ${style.withText}` : '')} onClick={props.onClick}>
            <props.icon className={style.icon}/>{props.showText ? <div className={style.text}>{props.children}</div> : ''}
        </a.button>
    )
}
