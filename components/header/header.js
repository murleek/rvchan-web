import style from "./header.module.scss"

function Header(props) {
    return (
        <div className={style.header}>
            <span className={style.title}>
                <img src="/rvchan.svg" alt="rvchan" height={10} />
                {props.header || "rvchan"}
            </span>
        </div>
    )
}

export default Header