import style from './card.module.scss'

function Card(props) {
    return (
        <div style={props.wrapStyle} className={style.cardWrap}>
            <div ref={props.ref} style={{color: props.fg, background: props.bg, ...props.style}} className={style.card}>
                { !props.title ? null : <div className={style.cardTitle}>{props.title}</div> }
                <div className={style.cardContent}>{ props.children }</div>
            </div>
        </div>
    )
}

export default Card