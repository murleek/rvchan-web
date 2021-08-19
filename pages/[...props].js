import Cookies from 'universal-cookie'
import Head from 'next/head'
import { v4 as uuidv4 } from 'uuid'
import Card from '../components/card/card'
import TabbedCard from '../components/tabbedCard/tabbedCard'
import Header from '../components/header/header'
import Footer from '../components/footer/footer'
import LinksCardContent from '../components/card/linksCardContent/linksCardContent'
import StatsCardContent from '../components/card/statsCardContent/statsCardContent'
import Splitted from '../components/card/splitted/splitted'
import BoardsCardContent from '../components/card/boardsCardContent/boardsCardContent'
import TrackerCardContent from '../components/card/trackerCardContent/trackerCardContent'
import dynamic from "next/dynamic";
import Error from './_error'
const FastLinks = dynamic(() => import('../components/fastLinks/fastLinks'), {ssr: false});
import { useRouter } from 'next/router'
import Post from '../components/post/post'
import PostForm from '../components/postform/postform'

const RVCHAN_DESCRIPTION = "это анонимный (пока не) имиджборд, написанный одним школьником. Форум имеет тематические борды (aka разделы), в которых общение ограниченно темой борды или тредом. Борда “test0f1a” не имеет определенной темы общения, но подчиняется все тем же правилам форума.";

const items = [
    {
        id: 'tracker',
        name: "трекер",
        content: ( <TrackerCardContent /> )
    },
    {
        id: 'boards',
        name: "доски",
        content: ( <BoardsCardContent /> )
    }
];
const boards = [
    {
        name: "b",
        title: "/b/ред"
    },
    {
        name: "a",
        title: "/a/ниме"
    }
]

export default function Thread({ session, privToken }) {
    const router = useRouter();
    const { props } = router.query;
    var board = boards.find(x => x.name == props[0]);
    console.log(board);
    if (props.length > 2) {
        return (<Error statusCode={404} />)
    } else if (!board) {
        return (<Error statusCode={404} description={<>доска <b>{props[0]}</b> не найдена :(</>} />)
    }
    const cookies = new Cookies();
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
            <Header title={board.title} description={"постинг пока отсутствует..."}/>
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
            <Footer session={session} privToken={privToken}/>
        </footer>
    </div>
    )
}

Thread.getInitialProps = (ctx) => {
    var cookies = new Cookies();
    if (ctx.req != null) {
        cookies = new Cookies(ctx.req.headers.cookie);
    }
    let session = cookies.get("rv-session-pubtoken");
    let privToken = cookies.get("rv-session-privtoken");
    console.log(session, privToken);
    return { session, privToken };
};
