import Post from "../../components/Post/Post";
import PostOptions from "../../components/Post/PostOptions/PostOptions";
import {declOfNum} from "../../utils/string";
import Button from "../../components/Button/Button"
import style from "./ThreadController.module.scss"
import { useSpring, a } from "react-spring";
import {useState} from "react";
import AnimHeight from "../../components/AnimHeight/AnimHeight";
import {globalThisPolyfill} from "../../utils/polyfill";
import Card from "../../components/Card/Card";
 
export default function ThreadController({threadObj, boardName, isBoardList}) {
    const [opOptions, setOpOptions] = useState(false);
    const [thread, setThread] = useState(threadObj);
    const [loading, setLoading] = useState(false);
    console.log(thread);

    globalThisPolyfill();
    console.log(globalThis.threadControllers)
    if (!globalThis.threadControllers || !globalThis.threadControllers.controller) globalThis.threadControllers = { controller: [] }
    if (!isBoardList) globalThis.threadControllers = { controller: [] } 
    globalThis.threadControllers.controller[thread.id] = {
        update: async () => {
            let newThreadObj = await (await fetch(`/api/boards/${boardName}/threads/${thread.id}`)).json();
            if (newThreadObj.success) {
                newThreadObj = newThreadObj.thread
                setThread(newThreadObj)
            }
        },
        append: (post) => {
            console.log("check part")
            if (post.state === "posting") {
                let th = thread;
                th.posts.push({
                    content: post.content.text,
                    date: "NaN",
                    id: 0,
                    mail: post.mail,
                    thread: thread.id,
                    state: "posting"
                })
                setThread(th);
            }
        }
    }
    const optionsAnim = useSpring({
        config: {
            mass: 0.8
        },
        to: {
            opacity: !opOptions ? "0" : "1"
        }
    });
    return (<>
        <Post
            post={{
                date: new Date(thread.post.date),
                id: thread.id,
                mail: thread.post.mail ?? undefined,
                name: thread.post.name ?? "аноним",
                number: thread.post.num,
                boardName: boardName,
                content: {
                    text: thread.post.content,
                }
            }}
            showToThread={!!isBoardList}>
            <PostOptions>
                <span>
                    {thread.postCount < 1
                        ? <>
                            постов пока что нет
                        </>
                        : <>
                            {thread.postCount} {declOfNum(thread.postCount, ['пост', 'поста', 'постов'])}
                        </>}
                </span>
                <a style={{
                    cursor: "pointer",
                    userSelect: "none"
                }} onClick={(e)=>{
                    e.preventDefault()
                    setOpOptions(!opOptions)
                }}>опции</a>
            </PostOptions>
        </Post>
        <AnimHeight zeroHeight={!opOptions}>
            <a.div className={style.options} style={optionsAnim}>
                    {isBoardList &&
                        <Button href={`/${boardName}/${thread.id}`}>
                            перейти в тред
                        </Button>
                    }
                    <Button style={{
                        background: "#ffc6c3",
                        color: "#000",
                        textDecorationColor: "#ffaaff"
                    }} className={style.reportButton} href={`/${boardName}/${thread.id}/report`}>
                        пожаловаться
                    </Button>
            </a.div>
        </AnimHeight>
        {thread.posts.length < thread.postCount 
            && <div onClick={async () => {
                setLoading(true)
                await globalThis.threadControllers.controller[thread.id].update();
                setLoading(false)
            }}>
                <Card wrapStyle={{margin: "0px 0px 4px 16px", width: 'calc(100% - 16px)'}} style={{padding: "8px", cursor:'pointer'}}>
                    <span className={style.skippedPosts}>
                        {
                            loading
                                ? 'загрузка...'
                                : declOfNum(thread.postCount - thread.posts.length, ['пропущен', 'пропущены', 'пропущены'])
                                    + ' '
                                    + (thread.postCount - thread.posts.length)
                                    + ' '
                                    + declOfNum(thread.postCount - thread.posts.length, ['пост', 'поста', 'постов'])
                                    + ', показать их?'
                        }
                    </span>
                </Card>
            </div>}
            {thread.posts.map((post) =>
            <Post post={{
                date: new Date(post.date),
                id: post.id,
                mail: post.mail,
                name: post.name ?? "аноним",
                number: post.num,
                content: {
                    text: post.content,
                },
                thread: thread.id
            }}/>
        )}
    </>)
}

