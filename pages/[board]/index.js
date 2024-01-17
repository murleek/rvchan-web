import Cookies from 'universal-cookie'
import Head from 'next/head'
import { v4 as uuidv4 } from 'uuid'
import dynamic from "next/dynamic";
import Error from '../_error'

const FastLinks = dynamic(() => import('../../components/FastLinks/FastLinks'), {ssr: false});
import Footer from '../../components/Footer/Footer'
import Header from '../../components/Header/Header'
import HLine from "../../components/HLine/HLine";
import Link from "next/link";
import Post from '../../components/Post/Post'
import PostOptions from '../../components/Post/PostOptions/PostOptions'
import PostForm from '../../components/PostForm/PostForm'
import Button from "../../components/Button/Button";

import connectDB from "../../lib/connectDB";
import Boards, {BOARD_NAME_LENGTH} from "../../models/boards";
import Threads from "../../models/threads";
import Posts from "../../models/posts";
import {declOfNum} from "../../utils/string";
import ThreadController from "../../controllers/ThreadController/ThreadController";
import PostButton from "../../components/PostForm/PostButton/PostButton";
import BackButton from "../../components/BackButton/BackButton";

const RVCHAN_DESCRIPTION = "это анонимный (пока не) имиджборд, написанный одним школьником. Форум имеет тематические борды (aka разделы), в которых общение ограниченно темой борды или тредом. Борда “test0f1a” не имеет определенной темы общения, но подчиняется все тем же правилам форума.";

export default function Board({ board, boardName, threads, captchaPublicKey, err }) {
    if (err) {
        if (err.includes("not-found")) {
            return (<Error statusCode={404}/>)
        } else if (err.includes("not-exists") || err.includes("disabled")) {
            return (<Error title={"доска не найдена или отключена"} statusCode={404} description={<>доска <b>{boardName}</b> отключена или не найдена :(</>}/>)
        } else if (err.includes("db-connection-error")) {
            return (<Error statusCode={500} description={<>не удалось подключиться к базе данных</>} /> )
        }
    }
    const cookies = new Cookies();
    let session = cookies.get("rv-session-pubtoken");
    let privToken = cookies.get("rv-session-privtoken");
    if (!session) {
        session = uuidv4();
        cookies.set("rv-session-pubtoken", session, {maxAge: 365*24*60*60});
    }
    if (!privToken) {
        privToken = uuidv4();
        cookies.set("rv-session-privtoken", privToken, {maxAge: 15*60});
    }
    //console.log(threads);
    threads = threads.map((thread) => {
        thread.post.date = new Date(thread.post.date);
        thread.posts.map((post) => {
            post.date = new Date(post.date);
            return post;
        })
        return thread;
    })
    return (
        <div className="container withPostForm homePage">
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="preload" href="/fonts/SFUIDisplay/font-face.css" as="style" />

                <title>rvchan</title>
                <meta name="title" content="» rvchan" />
                <meta name="description" content={RVCHAN_DESCRIPTION} />
                <meta name="keywords" content="rvchan, рвчан, рвач, имиджборд, imageboard, rvach, ravecat, двач, 4chan, форчан"/>

                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://ch.rave.cat" />
                <meta property="og:title" content="» rvchan" />
                <meta property="og:description" content={RVCHAN_DESCRIPTION} />
                {/*<meta property="og:image" content="https://ch.rave.cat/android-chrome-192x192.png" />*/}

                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://ch.rave.cat" />
                <meta property="twitter:title" content="» rvchan" />
                <meta property="twitter:description" content={RVCHAN_DESCRIPTION} />
                {/*<meta property="twitter:image" content="https://ch.rave.cat/android-chrome-192x192.png" />*/}
            </Head>

            <header>
                <FastLinks />
                <Header title={board.name} description={"няняня люблю кушать"}/>
            </header>

            <BackButton href={`/`}>
                на главную
            </BackButton>

            <HLine/>

            <main>
                {threads != null && threads.length > 0 ?
                    threads.map((thread, n) =>
                        <>
                            <ThreadController isBoardList boardName={boardName} threadObj={thread} />
                            {threads.length > n+1 && <HLine/>}
                        </>
                    ) : <>
                        <div style={{margin: '36px 0 42px'}}>
                            <div style={{fontSize: '36px', textAlign: "center", fontWeight: "900", color: "#666"}}>¯\_(ツ)_/¯</div>
                            <div style={{fontSize: '18px', textAlign: "center", fontWeight: "700", color: "#666"}}>пусто, выросла капуста</div>
                            <div style={{fontSize: '14px', textAlign: "center", fontWeight: "500", color: "#666"}}>можете создать новый тред на этой доске!!!</div>
                        </div>
                    </>
                }
            </main>

            <HLine/>

            <PostButton />
            <PostForm board={boardName} captchaPublicKey={captchaPublicKey} alwaysOpened fullscreen onlySummon />

            <footer>
                <Footer desc={process.env.NODE_ENV !== 'production' ? <span style={{fontWeight: "900", color: "#f88"}}>{process.env.NODE_ENV}</span> : null} session={session} privToken={privToken}/>
            </footer>
        </div>
    )
}
export async function getServerSideProps({req, res, params}) {
    let boardName = params.board != null
        && new RegExp(`^[a-zA-Z0-9]{1,${BOARD_NAME_LENGTH}}$`).test(params.board)
            ? params.board
            : null;
    if (boardName === null) {
        return {props: {captchaPublicKey: process.env.RECAPTCHA_SITE_KEY, err: ["not-found"]}}
    }
    try {
        return await connectDB(async () => {
            const board = await Boards.findOne({title: boardName}).lean()

            if (!board) {
                return {props: {err: ["not-exists"]}}
            } else if (board.disabled) {
                return {props: {err: ["disabled"]}}
            }
            board._id = board._id.toString()
            board.creationDate= board.creationDate.toString();
            board.lastUpdateDate= board.lastUpdateDate.toString();

            const threads = await Threads(boardName).find().lean()

            await Promise.all(
                threads.map(async (th) => {
                    th.postCount = await Posts(boardName).find({thread: th.id}).count();
                    th.posts = await Posts(boardName).find({thread: th.id}).sort({id:-1}).limit(3).lean();
                    th.post = await Posts(boardName).findOne({id: th.id}).lean();
                    if (th.posts && th.posts.length) {
                        let tempPosts = (await Posts(boardName).find({thread: th.id}).sort({id:-1}).limit(5).lean()).filter(x => x.mail !== 'sage')
                        if (tempPosts.length) th.lastPostDate = tempPosts[0].date;
                        else th.lastPostDate = th.post?.date;
                    } else if (th.post) {
                        th.lastPostDate = th.post?.date;
                    }
                    return th;
                })
            );

            threads.sort((a, b) => {
                if (a.lastPostDate.getTime() < b.lastPostDate.getTime()) {
                    return 1;
                }
                else if (a.lastPostDate.getTime() > b.lastPostDate.getTime()) {
                    return -1;
                }
                else {
                    return 0;
                }
            }).map((th) => {
                delete th._id;

                delete th.post._id;
                th.post.date = th.post.date.toString();
                th.lastPostDate = th.lastPostDate.toString();
                th.posts.reverse().map(async (post) => {
                    delete post._id;
                    post.date = post.date.toString();
                    return post;
                })

                return th;
            })

            return {props: {captchaPublicKey: process.env.RECAPTCHA_SITE_KEY, board, boardName, threads}}
        })(req, res);
    } catch (e) {
        console.error(e);
        return {props: {captchaPublicKey: process.env.RECAPTCHA_SITE_KEY, err: ["db-connection-error"]}}
    }
}