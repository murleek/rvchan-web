import style from "./postForm.module.scss"
import PostFormButton from "./PostFormButton/PostFormButton";
import {useState, useEffect, useRef} from "react";
import { useSpring, a } from "react-spring";
import AnimHeight from "../AnimHeight/AnimHeight";
import ExpandIcon from "../../public/ExpandIcon.svg";
import AttachIcon from "../../public/AttachIcon.svg";
import SendIcon from "../../public/SendIcon.svg";
import { globalThisPolyfill } from "../../utils/polyfill"
import Window from "../Window/Window";
import ReCAPTCHA from 'react-google-recaptcha';
import { useRouter } from 'next/router'

export default function PostForm({board, thread, alwaysOpened, fullscreen, captchaPublicKey}) {
    const router = useRouter()
    const [expand, setExpand] = useState(alwaysOpened ?? false);
    const [sending, setSending] = useState(false);
    let formRef = useRef(null);
    let filesRef = useRef(null);
    let contentRef = useRef(null);
    let recaptchaRef = useRef(null);

    const [files, setFiles] = useState([]);

    const uploadFile = (e) => {
        const files = e.target.files || e.dataTransfer.files;
        if (files.length > 5) {
            alert('You are only allowed to upload a maximum of 2 files at a time');
        }
        if (!files.length) return;
        for (let i = 0; i < Math.min(files.length, 5); i++) {
            let file = files[i];
            if (!file.type.startsWith('image/')){ continue }
            setFiles((arr) => [...arr,
                {
                    image: file,
                    objURL: URL.createObjectURL(file)
                }
            ]);
        }
        console.log(files)
    };
    const removeFile = (e, objURL) => {
        setFiles((arr) => arr.filter((e) => e.objURL !== objURL))
        URL.revokeObjectURL(objURL)
    }

    async function keydownHandler(e) {
        if (e.keyCode === 13 && e.ctrlKey && !sending) await onPost()
    }

    useEffect(() => {
        document.addEventListener('keydown', keydownHandler);
        formRef.current.addEventListener("submit", onPost);

        return function cleanup() {
            document.removeEventListener('keydown', keydownHandler);
        };
    });

    globalThisPolyfill()
    globalThis.постинг = true;
    globalThis.нестабильность = true;

    function onExpandClick() {
        setExpand(!expand);
        console.log((+expand * 180) + "deg");
    }
    async function onPost(event) {
        if (sending) {globalThis.notifications.info("предотвращена попытка запостить еще раз");return}
        const formData = new FormData(formRef.current);
        if (event) event.preventDefault();
        console.log(formData)
        var formObj = Object.fromEntries(new FormData(event.target));
        console.log(formObj)
        if (!formData?.get('c')?.trim()) {
            return console.error("text is empty");
        }

        let result = {};

        try {
            console.log(contentRef);
            contentRef.current.value = '';
            setSending(true);

            const token = await recaptchaRef.current.executeAsync();
            console.log(token);

            if (token) {
                formData.set("g-recaptcha-token", token)
                if (globalThis.windowList && "createThread" in globalThis.windowList) {
                    globalThis.windowList["createThread"].killWindow();
                }
                if (thread) {
                    globalThis.threadControllers.controller[thread].append({
                        content: {
                            text: formData.get('c')
                        },
                        mail: formData.get('m'),
                        state: "posting"
                    });
                } else {
                }
                let response = await fetch(`/api/boards/${board}/threads${!!thread ? '/' + thread : ''}`, {
                    method: 'POST',
                    body: formData
                });
                try {
                    let json = await response.json();
                    if (json.success) {
                        console.log(json);
                        if (json.thread) {
                            result = {
                                type: "forwardThread",
                                threadId: json.thread.id
                            }
                        } else if (json.post) {
                            result = {
                                type: "reloadThread"
                            }
                        }
                    } else {
                        console.error(`error posting:\n${response.status}: ${json.error}`)
                    }
                } catch (e) {
                    console.error(`Internal Server Error`)
                }
            } else {
                console.error("captcha error");
            }
        } catch (e) {
            console.error(e);
        }
        setSending(false);
        recaptchaRef.current.reset();
        if (result.type === "forwardThread") {
            await router.push(`/${board}/${result.threadId}`)
        }
        else if (result.type === "reloadThread") {
            if (!globalThis.threadControllers || !globalThis.threadControllers.controller || !(thread in globalThis.threadControllers.controller)) {
                console.error("cannot update thread controller.");
            }
            globalThis.threadControllers.controller[thread].update();
        }
    }
    function onAddPicture() {
        filesRef.current.click()
    }

    const expandAnim = useSpring({
        config: {
            mass: 0.8
        },
        to: {
            rotate: (+expand * 180) + "deg"
        }
    });

    let form = (<>
        <a.form ref={formRef} onSubmit={onPost} className={`${style.postform}${expand ? ` ${style.opened}` : ''}${fullscreen ? ` ${style.fullscreen}` : ''}`} action="" encType="multipart/form-data">
            <AnimHeight noOverflow>
                {!!files.length && <div className={style.selectedImages}>
                    {files.map((img) => <div onClick={(e) => removeFile(e,img.objURL)} className={style.selectedImage} key={img.objURL}>
                        <div
                            style={{background: `center / cover no-repeat url(${img.objURL})`}}
                            className={style.img}
                        />
                        <span className={style.imageName}>{img.image.name}</span>
                    </div>)}
                </div>}
            </AnimHeight>
            <AnimHeight noOverflow>
                <div className={`${style.expanded}${(!fullscreen && !expand) ? ' ' + style.hidden : '' }`}>
                    {/*<div ref={ref} className={style.recaptcha}>
                            этот сайт защищен капчей reCAPTCHA, и применяются <a href="https://policies.google.com/privacy">политика конфиденциальности</a> и <a href="https://policies.google.com/terms">условия использования</a> google.
                        </div>*/}

                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={captchaPublicKey}
                        size="invisible"
                        badge={"inline"}
                    />

                    <input disabled={sending} name="m" type="text" placeholder="опции" className={style.input + ' ' + style.email} />
                </div>
            </AnimHeight>
            <div className={style.postformMain}>
                {!fullscreen && <PostFormButton animation={expandAnim} onClick={onExpandClick} fg="#888" icon={ExpandIcon} />}
                <input ref={filesRef} name="f" type="file" style={{display:'none'}} multiple onChange={uploadFile} />
                <PostFormButton disabled={sending} className={fullscreen ? style.fullscreenButton : null} showText={fullscreen} onClick={onAddPicture} fg={fullscreen ? "#666" : "#ddd"} icon={AttachIcon}>
                    ПРИКРЕПИТЬ
                </PostFormButton>
                <textarea ref={contentRef} disabled={sending} name="c" className={style.input + " " + style.content} rows="5" placeholder="сообщение..." />
                <PostFormButton submit disabled={sending} className={fullscreen ? style.fullscreenButton : null} showText={fullscreen} bg="#faf" fg="#fff" icon={SendIcon}>
                    ОТПРАВИТЬ
                </PostFormButton>
            </div>
        </a.form>
    </>);

    return (<>
        {fullscreen
            ? <Window title={"создать тред"} name={"createThread"}>
                {form}
            </Window>
            : form}
    </>)
}