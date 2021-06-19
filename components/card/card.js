import style from './card.module.scss'

function Card(props) {
    return (
        <div className={style.cardWrap}>
            <div style={{...props.style}} className={style.card}>
                { !props.title ? null : <div className={style.cardTitle}>{props.title}</div> }
                <div className={style.cardContent}>{ props.children }</div>
            </div>
        </div>
    )
}

export default Card