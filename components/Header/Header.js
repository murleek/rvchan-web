import style from "./header.module.scss"
import classNames from 'classnames';

function Header(props) {
    return (
        <div className={style.header}>
            <span className={classNames({
                [style.title]: true,
                [style.withLogo]: !props.title,
                [style.red]: !props.title && process.env.NODE_ENV !== 'production'
            })}>
                {props.title || "rvchan"}
            </span>
            <span className={style.description}>
                {props.description || "выскажи что-угодно анонимно"}
            </span>
        </div>
    )
}

export default Header