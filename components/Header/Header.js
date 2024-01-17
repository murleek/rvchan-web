import style from "./header.module.scss"
import classNames from 'classnames';

const splashes = ["раф симонсы хуйня", "рик овенс топ",]; // "выскажи что-угодно анонимно"

function Header(props) {
    return (
        <div className={style.header}>
            <span className={classNames({
                [style.title]: true,
                [style.withLogo]: !props.title,
                [style.prod]: props.production,
                [style.ukraine]: props.ukraine
            })}>
                {props.title || <div style={{position:'relative'}}>
                    <span style={{color: "#f00", position:"absolute", top: '-32px', left: '-8px'}}>р</span>
                    <s style={{textDecorationThickness: '8px', textDecorationColor: "#f00"}}>Д</s>вач
                </div>}
            </span>
            <span className={style.description}>
                {props.description || splashes[Math.floor(Math.random()*splashes.length)]}
            </span>
        </div>
    )
}

export default Header