import style from "./header.module.scss"
import classNames from 'classnames';
import AnimText from "../animText/animText";

function Header(props) {
    return (
        <div className={style.header}>
            <AnimText className={classNames({
                [style.title]: true,
                [style.withLogo]: !props.title
            })}>
                {props.title || "rvchan"}
            </AnimText>
            <AnimText className={style.description}>
                {props.description || "выскажи что-угодно анонимно"}
            </AnimText>
        </div>
    )
}

export default Header