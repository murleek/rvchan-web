import style from "./devToolsButton.module.scss"
import {globalThisPolyfill} from "../../../utils/polyfill";
import Window from "../../Window/Window"
import { newNotification, selectNotifications } from "../../../controllers/Notifications/notificationsSlice";
import { useAppDispatch } from "../../../app/hooks";

export default function DevToolsButton(props) {
    const dispatch = useAppDispatch()

    globalThisPolyfill();
    globalThis.rvDevTools = false;
    return (<>
        <div className={style.devToolsButton + " " + (globalThis.devTools ? "" : style.disabled)} onClick={()=>{
                console.log(globalThis.windowList?.["devTools"]);
                if (globalThis.windowList?.["devTools"]) globalThis.windowList?.["devTools"].summonWindow();
                else {
                    console.error(`function "globalThis.windowList["devTools"]" is ${globalThis.windowList?.["devTools"]}`)
                    globalThis.notifications?.error('не удалось вызвать окно "devTools"')
                }
            }}>
            devtools
        </div>
        <Window title={"меню разработчика"} name={"devTools"}>
            <div className={style.menu}>
                <div className={style.toastSection}>
                    тест тостов: 
                    {' '}
                    <a style={{background:"#000", fontWeight:"800", borderRadius:".3125em", padding:"4px 8px", color:"#fff"}} 
                        onClick={()=>{dispatch(newNotification({
                            text: "тест инфо",
                            type: "log",
                            milliseconds: 3000
                        }))}}>инфо</a>
                    {' '}
                    <a style={{background:"#c32", fontWeight:"800", borderRadius:".3125em", padding:"4px 8px", color:"#fff"}} 
                        onClick={()=>{globalThis.notifications?.error("тест ошибка")}}>ошибка</a>

                </div>
            </div>
        </Window>
    </>)
}
