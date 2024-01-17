import style from "./window.module.scss"
import { useState } from "react";
import { globalThisPolyfill } from "../../utils/polyfill";
import { useSpring, a } from "react-spring";
import Close from "../../public/Close.svg";

export default function Window({name, title, children, isSummoned}) {
    const [summoned, setSummoned] = useState(isSummoned);

    globalThisPolyfill();
    globalThis.windowList = globalThis.windowList || {}
    globalThis.windowList[name] = {
        killWindow: () => {
            setSummoned(false)
        },
        summonWindow: () => {
            setSummoned(true)
        },
        isSummoned: () => summoned
    }

    const summonBgAnim = useSpring({
        onProps: function (result, spring) {
            spring.set({zIndex: -45})
        },
        onChange: function (result, spring) {
            spring.set({zIndex: 45})
            if (result.value.opacity === 0) {
                spring.set({zIndex: -45})
            }
        },
        from: {
            zIndex: 45
        },  
        config: {
            mass: 0.8
        },
        to: {
            opacity: !summoned ? 0 : 1
        },
        onRest: function (result, spring) {
            if (result.finished) spring.set({zIndex: !summoned ? -45 : 45})
        }
    });
    const summonFgAnim = useSpring({
        config: {
            mass: 0.3
        },
        to: {
            scale: !summoned ? "1.1" : "1",
            filter: !summoned ? "blur(16px)" : "blur(0px)"
        }
    });
    return (
        <a.div style={summonBgAnim} onClick={globalThis.windowList[name].killWindow} className={style.windowWrap}>
            <a.div style={summonFgAnim} className={style.window} onClick={(event) => {
                event.stopPropagation();
            }}>
                <div className={style.windowTooltip}>
                    <span className={style.title}>
                        {title}
                    </span>
                    <span onClick={globalThis.windowList[name].killWindow} className={style.close}>
                        <Close className={style.closeIcon} />
                    </span>
                </div>
                <div className={style.windowContent}>
                    {children}
                </div>
            </a.div>
        </a.div>
    )
}
