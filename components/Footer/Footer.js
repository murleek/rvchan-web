import SessionBall from "../SessionBall/SessionBall";
import style from "./footer.module.scss";
import { nullish } from "../../utils/polyfill"

function Footer(props) {
    return (
        <div className={style.footer}>
            <div className={style.left}><small>{nullish(props.desc, 'rave.cat projects. 2022')}</small></div>
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