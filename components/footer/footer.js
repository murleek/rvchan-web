import SessionBall from "../sessionball/sessionball";
import style from "./footer.module.scss";

function Footer(props) {
    return (
        <div className={style.footer}>
            <div className={style.left}><small>rave.cat projects. 2021</small></div>
            <div className={style.right}>
                {props.session != null && props.privToken != null 
                    ? <SessionBall session={props.session} privToken={props.privToken} width={16} height={16} borderSize={6} borderRadius={25}/>
                : <></>
                }
            </div>
        </div>
    )
}

export default Footer