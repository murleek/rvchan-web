import style from "./notifications.module.scss"
import Lottie from "react-lottie";
import * as infoAnimation from "../../public/anims/infoAnimation.json";
import * as errorAnimation from "../../public/anims/errorWhite.json";
import { v4 as uuidv4 } from 'uuid'
import { useState, useMemo, useEffect } from 'react'
import {globalThisPolyfill} from "../../utils/polyfill";
import { useTransition, a } from '@react-spring/web'

import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { selectNotifications } from './notificationsSlice'

/** for errors
 * <Lottie style={{height:36, width:36, position:"absolute", top: 3, left:2}} loop={false} autoPlay={true} animationData={errorAnimation} />
 */
/** for info
 * <Lottie style={{height:28, width:28, position:"absolute", top: 7, left:6}} loop={false} autoPlay={true} animationData={infoAnimation} />
 */
let id = 0

export default function Notifications(props) {
    const notificationsSel = useAppSelector(selectNotifications)
    console.log(notificationsSel)

    const notifHelper = {
        info: (text, milliseconds = 3000) => navigator.vibrate([50,25,50]) && this.append("info", text, milliseconds),
        error: (text, milliseconds = 8000) => navigator.vibrate([125,25,125]) && globalThis.notifications.append("error", text, milliseconds),
        append: (logType, text, milliseconds, clickable = true) => {
            let uuid = uuidv4();
            setNotifications(state => [...state, {
                type: logType,
                clickable: clickable,
                timeout: milliseconds,
                text: text,
                id: uuid,
                key: id++
            }])
            return uuid;
        },
        destroy: (id) => { 
            let notifCache = notifications;
            let newNotif = notifCache.filter((a)=>a.id != id);
            console.log(newNotif)
            setNotifications(newNotif)
        },
        getToasts: () => notifications
    };

    globalThisPolyfill();
    const [notifications, setNotifications] = useState([{
        type: "info",
        clickable: false,
        timeout: 14880,
        text: "zalooopa",
        id: "1488+",
        key: id++
    }]);
    const config = { tension: 125, friction: 20, precision: 0.5 };


    const refMap = useMemo(() => new WeakMap(), [])
    const cancelMap = useMemo(() => new WeakMap(), [])

    const transitions = useTransition(notifications, {
        from: { opacity: 0, height: 0, marginTop: 0, life: '100%' },
        keys: item => item.key,
        enter: item => async (next, cancel) => {
            cancelMap.set(item, cancel)
            await next({ opacity: 1, height: refMap.get(item).offsetHeight+4 })
            await next({ life: '0%' })
        },
        leave: [{ opacity: 0 }, { height: 0 }, { marginTop: 0 }], 
        onRest: (result, ctrl, item) => {
            setNotifications(state =>
              state.filter(i => {
                return i.key !== item.key
              })
            )
        },
        config: (item, index, phase) => key => phase === 'enter' && key === 'life' ? { duration: item.timeout } : config,
    })

    return (<div className={style.notificationWrap}>
        {transitions((s, item) => (
            <a.div style={s} onClick={()=>{
                if (cancelMap.has(item)) cancelMap.get(item)()
            }}>
                <div className={style.notification + (item.type == 'error' ? " " + style.error : '')} ref={(ref) => ref && refMap.set(item, ref)}>
                    <div>
                        {item.type == 'error' 
                            ? <Lottie style={{height:36, width:36, position:"absolute", top: 3, left:2}} options={{
                                loop: false,
                                autoplay: true, 
                                animationData: errorAnimation,
                                rendererSettings: {
                                    preserveAspectRatio: 'xMidYMid slice',
                                }
                            }} />
                            : <Lottie style={{height:28, width:28, position:"absolute", top: 7, left:6}} options={{
                                loop: false,
                                autoplay: true, 
                                animationData: infoAnimation,
                                rendererSettings: {
                                    preserveAspectRatio: 'xMidYMid slice',
                                }
                            }} />
                        }
                        <span className={style.text}>{item.text}</span>
                    </div>
                </div>
            </a.div>
        ))}
    </div>);
}