import Link from "next/link";
import Image from "next/image";
import classNames from 'classnames';
import style from "./postFormButton.module.scss"
import { a } from "react-spring"
import { nullish } from "../../../utils/polyfill";

export default function PostFormButton(props) {
    return (
        <a.button
            onFocus={(e) => { setTimeout(() => e.target.blur(), 100); }}
            type={props.submit ? "submit" : "button"}
            className={style.button + (props.showText ? ` ${style.withText}` : '') + (props.className ? ` ${props.className}` : '')}
            style={
                {
                    ...props.animation,
                    color: props.disabled ? "#000" : props.fg,
                    fill: props.disabled ? "#000" : props.fg,
                    background: props.disabled ? "#fff" : nullish(props.bg, null)
                }
            }
            disabled={props.disabled}
            onClick={!props.disabled ? props.onClick : null}>

            <props.icon className={style.icon}/>
	        {props.showText ?
		        <div className={style.text}>{props.children}</div>
		        : ''
	        }
        </a.button>
    )
}
