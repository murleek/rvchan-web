import style from "./postform.module.scss"
import PostFormButton from "./postformbutton";
import { useState, useRef, useEffect } from "react";
import { useSpring, a } from "react-spring";
import AnimHeight from "../animHeight/animHeight";
import ExpandIcon from "../../public/ExpandIcon.svg";
import AttachIcon from "../../public/AttachIcon.svg";
import SendIcon from "../../public/SendIcon.svg";
import { useMeasure } from 'react-use';

export default function PostForm() {
    const [expand, setExpand] = useState(false);

    function onExpandClick(e) {
        setExpand(!expand);
    }
    function onPost() {
        console.warn("Постинг отсутствует.");
    }
    function onAddPicture() {
        console.warn("Прикрепление изображений отсутствует.");
    }

    var expandAnim = useSpring({
        config: {
            mass: 0.8
        },
        to: {
            rotate: (+expand * 180) + "deg"
        }
    });


    const [captchaHeight, setCaptchaHeight] = useState(0);
    const [ref, cm] = useMeasure();

    useEffect(() => {
        setCaptchaHeight(cm.height);
        window.addEventListener("resize", setCaptchaHeight(cm.height));
        return window.removeEventListener("resize", setCaptchaHeight(cm.height));
    }, [cm.height]);

    var expandSendButtonAnim = useSpring({
        config: {
            mass: 0.8
        },
        to: {
            width: !expand ? "30px" : "96px",
            top: "4px",
            right: "6px",
            position: "absolute",
            borderRadius: expand ? .3125+"rem" : "1.11rem"
        }
    });

    return (
        <a.form className={`${style.postform}${expand ? ` ${style.opened}` : ''}`} action="" encType="multipart/form-data">
            <input type="hidden" name="b" value="test0f1a" />
            <input type="hidden" name="t" value={0} />
            <AnimHeight>
                <div className={`${style.expanded}${!expand ? ' ' + style.hidden : '' }`}>
                    {/*<div ref={ref} className={style.recaptcha}>
                        этот сайт защищен капчей reCAPTCHA, и применяются <a href="https://policies.google.com/privacy">политика конфиденциальности</a> и <a href="https://policies.google.com/terms">условия использования</a> google.
    </div>*/}

                    <input name="m" type="text" id="postform-mail" placeholder="эл. почта (необязательно)" className={style.input + ' ' + style.email} />
                </div>
            </AnimHeight>
            <div className={style.postformMain}>
                <PostFormButton animation={expandAnim} onClick={onExpandClick} bg="#0000" fg="#888" icon={ExpandIcon} />
                <PostFormButton onClick={onAddPicture} bg="#0000" fg="#ddd" icon={AttachIcon} />
                <textarea className={style.input + " " + style.content} rows="5" placeholder="сообщение..." />
                <PostFormButton showText={expand} animation={expandSendButtonAnim} onClick={onPost} bg="#faf" fg="#fff" icon={SendIcon}>
                    ОТПРАВИТЬ
                </PostFormButton>
            </div>
        </a.form>
    )
}