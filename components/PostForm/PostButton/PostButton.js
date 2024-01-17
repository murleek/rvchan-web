import style from "./postButton.module.scss"
import { globalThisPolyfill } from "../../../utils/polyfill";

export default function PostButton() {
    globalThisPolyfill();
    return (
        <div className={style.postButtonWrap}>
            <div className={style.postButton} onClick={()=>{
                console.log(globalThis.windowList["createThread"]);
                if (globalThis.windowList["createThread"]) globalThis.windowList["createThread"].summonWindow();
                else console.error(`function "globalThis.windowList["createThread"]" is ${globalThis.windowList["createThread"]}`)
            }}>
                создать тред
            </div>
        </div>
    )
}