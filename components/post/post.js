import Card from "../card/card";
import style from "./post.module.scss"
import { Nullish } from "../../utils/polyfill";
import ReactDOMServer from 'react-dom/server';

export default function Post(props) {
    function save(obj) {
        return Nullish(obj, {});
    }
    Date.prototype.addMinutes = function(m) {
        this.setTime(this.getTime() + (m*60*1000));
        return this;
    }
    let rawPost = Nullish(props.post, {
        content: {}
    });
    let post = {
            date: rawPost.date,
            id: Nullish(rawPost.id, 1),
            mail: rawPost.mail,
            name: Nullish(rawPost.name, "системный пост"),
            number: Nullish(rawPost.number, 1),
            content: {
                text: Nullish(save(rawPost.content).text, <>
                    <span className={style.quote}>{'>'} че это такое и где норм рвачик?</span><br/>
                    это новый рвачик, с новым дизайном, производительнее бывшего, но без всех функций. ждите новостей!
                </>),
            },
            thread: Nullish(rawPost.thread, 0)
        };
    return (
    <div className={style.postWrap}>
        <div className={style.post + (post.thread == 0 ? ` ${style.postOp}` : '')}>
            <Card style={{padding: "2px 8px 4px"}} wrapStyle={{width: (post.thread == 0 ? "100%" : "fit-content")}}>
                <div className={style.postInfo}>
                    {
                        !post.number 
                            ? '' 
                            : <span className={style.postNum}>
                                {post.number}.
                            </span>
                    }
                    <span className={style.postName}>
                        {
                            post.mail != null 
                                ? <a href={post.mail}>
                                    {Nullish(post.name, "аноним")}
                                </a>
                                : (Nullish(post.name, "аноним"))
                        }
                    </span>
                    {
                        !post.date 
                            ? '' 
                            : <span className={style.postDate}>
                                {
                                    (Nullish(post.date, new Date())).addMinutes(-new Date().getTimezoneOffset())
                                        .toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/-/g, '.')
                                }
                            </span>
                    }
                    {
                        !post.id 
                            ? ''
                            : <a href={`#${post.id}`} className={style.postId}>
                                №{Nullish(post.id, 0)}
                            </a>
                    }
                </div>
                <blockquote dangerouslySetInnerHTML={{__html: ReactDOMServer.renderToStaticMarkup(post.content.text)}} className={style.postContent}>
                    
                </blockquote>
            </Card>
        </div>
    </div>
    )
}
