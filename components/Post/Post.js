import Card from "../Card/Card";
import style from "./post.module.scss"
import { nullish } from "../../utils/polyfill";
import ReactDOMServer from 'react-dom/server';
import Link from 'next/link';

export default function Post(props) {
    function save(obj) {
        return nullish(obj, {});
    }
    Date.prototype.addMinutes = function(m) {
        this.setTime(this.getTime() + (m*60*1000));
        return this;
    }
    let rawPost = nullish(props.post, {
        content: {}
    });
    let post = {
            date: rawPost.date,
            id: nullish(rawPost.id, 1),
            mail: rawPost.mail,
            name: nullish(rawPost.name, "аноним"),
            number: nullish(rawPost.number, 1),
            content: {
                text: nullish(save(rawPost.content).text, <>
                    <span className={style.quote}>{'>'} че это такое и где норм рвачик?</span><br/>
                    это новый рвачик, с новым дизайном, производительнее бывшего, но без всех функций. ждите новостей!
                </>),
            },
            boardName: nullish(rawPost.boardName, undefined),
            thread: nullish(rawPost.thread, 0)
        };
    return (
    <div className={style.postWrap + (!post.thread ? ` ${style.postOp}` : '')} style={{...props.wrapStyle}}>
        <div className={style.post + (!post.thread ? ` ${style.postOp}` : '')}>
            <Card style={{padding:0}} wrapStyle={{margin: 0, width: (!post.thread ? "100%" : "fit-content")}}>
                <div style={{display:'flex',flexDirection:'row'}}>
                    <div style={{flex:1,padding: !post.thread && !!props.showToThread ? "2px 0 4px 8px" : "2px 8px 4px"}}>
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
                                    post.mail
                                        ? <a href={post.mail.startsWith("mailto:") ? post.mail : "mailto:" + post.mail}>
                                            {nullish(post.name, "аноним")}
                                        </a>
                                        : (nullish(post.name, "аноним"))
                                }
                            </span>
                            {
                                !post.date
                                    ? ''
                                    : <span className={style.postDate}>
                                        {
                                            (nullish(post.date, new Date())).addMinutes(-new Date().getTimezoneOffset())
                                                .toISOString().replace(/T/, ' ').replace(/\..+/, '').replace(/-/g, '.')
                                        }
                                    </span>
                            }
                            {
                                !post.id
                                    ? ''
                                    : <a href={`#${post.id}`} className={style.postId}>
                                        №{nullish(post.id, 0)}
                                    </a>
                            }
                        </div>
                        <blockquote dangerouslySetInnerHTML={{__html: ReactDOMServer.renderToStaticMarkup(post.content.text)}} className={style.postContent}>

                        </blockquote>

                        {props.children}
                    </div>
                    {
                        !post.thread && !!props.showToThread && <Link href={`/${post.boardName}/${post.id}`}>
                            <div className={style.toThreadButton}>
                                в тред
                            </div>
                        </Link>
                    }
                </div>
            </Card>
        </div>
    </div>
    )
}
