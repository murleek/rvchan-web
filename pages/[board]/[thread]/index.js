import Cookies from 'universal-cookie'
import Head from 'next/head'
import { v4 as uuidv4 } from 'uuid'

import Header from '../../../components/Header/Header'
import Footer from '../../../components/Footer/Footer'
import dynamic from "next/dynamic";
import Error from '../../_error'
import PostForm from '../../../components/PostForm/PostForm'
import connectDB from "../../../lib/connectDB";
import Boards, {BOARD_NAME_LENGTH} from "../../../models/boards";
import Posts from "../../../models/posts";
import Threads from "../../../models/threads";
import HLine from "../../../components/HLine/HLine";
import BackButton from "../../../components/BackButton/BackButton";
import ThreadController from "../../../controllers/ThreadController/ThreadController";
import {useRouter} from "next/router";

const FastLinks = dynamic(() => import('../../../components/FastLinks/FastLinks'), {ssr: false});

const RVCHAN_DESCRIPTION = "это анонимный (пока не) имиджборд, написанный одним школьником. Форум имеет тематические борды (aka разделы), в которых общение ограниченно темой борды или тредом. Борда “test0f1a” не имеет определенной темы общения, но подчиняется все тем же правилам форума.";

export default function Board({ board, boardName, captchaPublicKey, thread, err, env }) {
    const router = useRouter()
    if (err) {
        if (err.includes("not-found")) {
            return (<Error statusCode={404}/>)
        } else if (err.includes("not-exists") || err.includes("disabled")) {
            return (<Error title={"доска не найдена или отключена"} statusCode={404} description={<>доска <b>{boardName}</b> отключена или не найдена :(</>}/>)
        } else if (err.includes("db-connection-error")) {
            return (<Error statusCode={500} description={<>не удалось подключиться к базе данных либо внутренняя ошибка</>} /> )
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
                <Header devMode={env.NODE_ENV !== 'production'} ukraine={env.UA_RES} title={board.name} description={"няняня люблю кушать"}/>
            </header>

            <BackButton href={`/${boardName}`}>
                назад
            </BackButton>

            <HLine/>

            <main>
                <ThreadController boardName={boardName} threadObj={thread} />
            </main>

            <HLine/>

            <PostForm board={boardName} thread={thread.id} captchaPublicKey={captchaPublicKey} />

            <footer>
                <Footer desc={env.NODE_ENV !== 'production' ? <span style={{fontWeight: "900", color: "#f88"}}>{env.NODE_ENV}</span> : null} session={session} privToken={privToken}/>
            </footer>
        </div>
    )
}
export async function getServerSideProps({req, res, params}) {
    const env = {
        NODE_ENV: process.env.NODE_ENV,
        UA_RES: process.env.UA_RES
    }

    let boardName = new RegExp(`^[a-zA-Z0-9]{1,${BOARD_NAME_LENGTH}}$`).test(params.board)
        ? params.board
        : null;
    let threadNum = new RegExp(`^([0-9]+)$`).test(params.thread)
            ? Number(params.thread)
            : null;
    if (boardName === null || threadNum === null) {
        return {props: {captchaPublicKey: process.env.RECAPTCHA_SITE_KEY, err: ["not-found"]}}
    }
    try {
        return await connectDB(async () => {
            const board = await Boards.findOne({title: boardName}).lean()

            if (!board) {
                return {props: {env, captchaPublicKey: process.env.RECAPTCHA_SITE_KEY, err: ["not-exists"]}}
            } else if (board.disabled) {
                return {props: {env, captchaPublicKey: process.env.RECAPTCHA_SITE_KEY, err: ["disabled"]}}
            }
            board._id = board._id.toString()
            board.creationDate= board.creationDate.toString();
            board.lastUpdateDate= board.lastUpdateDate.toString();

            const thread = await Threads(boardName).findOne({id: threadNum}).lean()
            if (thread == null) {
                return {props: {env, captchaPublicKey: process.env.RECAPTCHA_SITE_KEY, err: ["not-found"]}}
            }
            delete thread._id;

            thread.post = await Posts(boardName).findOne({id: threadNum}).lean();
            delete thread.post._id;
            thread.post.date = thread.post.date.toString();

            thread.postCount = await Posts(boardName).find({thread: threadNum}).count();
            thread.posts = await Posts(boardName).find({thread: threadNum}).sort({id:-1}).lean();
            thread.posts.reverse().map(async (post) => {
                delete post._id;
                post.date = post.date.toString();
                return post;
            })

            return {props: {env, captchaPublicKey: process.env.RECAPTCHA_SITE_KEY, board, boardName, thread}}
        })(req, res);
    } catch (e) {
        console.error(e);
        return {props: {env, captchaPublicKey: process.env.RECAPTCHA_SITE_KEY, err: ["db-connection-error"]}}
    }
}