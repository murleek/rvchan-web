import Cookies from 'universal-cookie'
import Head from 'next/head'
import { v4 as uuidv4 } from 'uuid'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import dynamic from "next/dynamic";
import Error from '../_error'
const FastLinks = dynamic(() => import('../../components/FastLinks/FastLinks'), {ssr: false});
import Post from '../../components/Post/Post'
import PostForm from '../../components/PostForm/PostForm'
import connectDB from "../../lib/connectDB";
import Boards, {BOARD_NAME_LENGTH} from "../../models/boards";
import Posts from "../../models/posts";

const RVCHAN_DESCRIPTION = "это анонимный (пока не) имиджборд, написанный одним школьником. Форум имеет тематические борды (aka разделы), в которых общение ограниченно темой борды или тредом. Борда “test0f1a” не имеет определенной темы общения, но подчиняется все тем же правилам форума.";

export default function Board({ board, boardName, threads, err }) {
    if (err) {
        if (err.includes("not-found")) {
            return (<Error statusCode={404}/>)
        } else if (err.includes("not-exists") || err.includes("disabled")) {
            return (<Error title={"доска не найдена или отключена"} statusCode={404} description={<>доска <b>{boardName}</b> отключена или не найдена :(</>}/>)
        } else if (err.includes("db-connection-error")) {
            return (<Error statusCode={500} description={<>не удалось подключиться к базе данных</>} /> )
        }
    }
    console.log(threads);
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
        <div className="container homePage">
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
                <Header title={board.name} description={"постинг пока отсутствует..."}/>
            </header>

            <main>
                <Post />
                <Post post={{
                    date: new Date(1628074108543),
                    id: 2,
                    mail: null,
                    name: "мурлик",
                    number: 2,
                    content: {
                        text: <>
                            к слову, дизайн окончен и я скоро начну заниматься фичами рабочими :)
                        </>,
                    },
                    thread: 1
                }} />
                <Post post={{
                    date: new Date(1628851516791),
                    id: 3,
                    mail: null,
                    name: "мурлик",
                    number: 3,
                    content: {
                        text: <>
                            как вы могли заметить, форма отправки присутствует, однако пока нельзя что-либо отправлять. это временно!!!!!
                        </>,
                    },
                    thread: 1
                }} />
                <PostForm />
            </main>

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
        return {props: {err: ["not-found"]}}
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

            const threads = await Posts(boardName).find().lean()
            return {props: {board, boardName, threads}}
        })(req, res);
    } catch (e) {
        return {props: {err: ["db-connection-error"]}}
    }
}