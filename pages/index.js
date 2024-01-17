import Cookies from 'universal-cookie'
import Head from 'next/head'
import { v4 as uuidv4 } from 'uuid'
import Card from '../components/Card/Card'
import TabbedCard from '../components/Card/TabbedCard/TabbedCard'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import LinksCardContent from '../controllers/LinksCardContent/LinksCardContent'
import StatsCardContent from '../controllers/StatsCardContent/StatsCardContent'
import Splitted from '../components/Card/Splitted/Splitted'
import BoardsCardContent from '../controllers/BoardsCardContent/BoardsCardContent'
import TrackerCardContent from '../controllers/TrackerCardContent/TrackerCardContent'
import dynamic from "next/dynamic";
import process from 'process'
import connectDB from "../lib/connectDB";
import Boards from "../models/boards";
import Posts from "../models/posts";
const FastLinks = dynamic(() => import('../components/FastLinks/FastLinks'), {ssr: false});
import {globalThisPolyfill} from "../utils/polyfill";

const RVCHAN_DESCRIPTION = "это анонимный (пока не) имиджборд, написанный одним школьником. Форум имеет тематические борды (aka разделы), в которых общение ограниченно темой борды или тредом. Борда “test0f1a” не имеет определенной темы общения, но подчиняется все тем же правилам форума.";

const name = "rvchan";

export default function Home({ boards, tracker, err, desc, env }) {
    globalThisPolyfill()
    const items = [
        {
            id: 'tracker',
            name: "трекер",
            cardStyle: {
                padding: '0'
            },
            content: ( err != null
                ? <div className={"error"}>
		            <span className={"name"}>
			            не удалось подключиться к базе данных
		            </span>
                    <span className={"description"}>
			            возможно вам требуется подождать, пока владелец проведет технические работы
		            </span>
                </div>
                : tracker.length > 0
                    ? <TrackerCardContent posts={tracker} />
                    : <>
                        <div style={{fontSize: '36px', textAlign: "center", fontWeight: "900", color: "#666"}}>¯\_(ツ)_/¯</div>
                        <div style={{fontSize: '18px', textAlign: "center", fontWeight: "700", color: "#666", paddingBottom: "12px"}}>пусто, выросла капуста</div>
                    </>)
        },
        {
            id: 'boards',
            name: "доски",
            content: ( err != null
	            ? <div className={"error"}>
		            <span className={"name"}>
			            не удалось подключиться к базе данных
		            </span>
		            <span className={"description"}>
			            возможно вам требуется подождать, пока владелец проведет технические работы
		            </span>
	            </div>
	            : tracker.length > 0
                    ? <BoardsCardContent boards={boards} />
                    : <>
                        <div style={{fontSize: '36px', textAlign: "center", fontWeight: "900", color: "#666"}}>¯\_(ツ)_/¯</div>
                        <div style={{fontSize: '18px', textAlign: "center", fontWeight: "700", color: "#666", paddingBottom: "12px"}}>пусто, выросла капуста</div>
                    </>)
        }
    ];

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
            <FastLinks closed />
            <Header devMode={env.NODE_ENV !== 'production'} ukraine={env.UA_RES} />
        </header>

        <main>
            {/*<Card style={{display:"flex",justifyContent:"center",padding:"4px"}}>*/}
            {/*    <img src={"/rafovi.jpg"} height={200}/>*/}
            {/*</Card>*/}
            <Card>
                <b>» rvchan</b> - это анонимный <i>пока не</i> имиджборд, написанный одним школьником. Форум имеет тематические борды (aka разделы), в которых общение ограниченно темой борды или тредом. Доска “b” не имеет определенной темы общения, но подчиняется все тем же правилам форума. Всё, что не запрещено правилами отдельно взятого форума и относится к его тематике, на этом форуме разрешено
            </Card>
            {
                env.NODE_ENV !== 'production' &&
                <Card bg="#c32" fg="#fff">
                    <p align="center"> <>
                        <h3>сервер запущен в режиме отладки</h3>
                        сайт может тормозить и работать некорректно
                    </></p>
                </Card>
            }
            {
                err != null
                && <Card bg="#c32" fg="#fff">
                    <p align="center"> <>
                        <h3>не удалось подключиться к бд</h3>
	                    {
		                    env.NODE_ENV !== 'production'
			                    ? desc
			                    : "возможно вам требуется подождать, пока владелец проведет технические работы"
	                    }
                    </></p>
                </Card>
            }
            <Splitted>
                <div>
                    <Card title={"ссылки"}>
                        <LinksCardContent />
                    </Card>
                    <Card title={"статистика"}>
                        <StatsCardContent />
                    </Card>
                </div>
                <div>
                    <TabbedCard items={items} />
                </div>
            </Splitted>
        </main>

        <footer>
            <Footer desc={env.NODE_ENV !== 'production' ? <span style={{fontWeight: "900", color: "#f88"}}>{process.env.NODE_ENV}</span> : null} session={session} privToken={privToken}/>
        </footer>
    </div>
    )
}

export async function getServerSideProps({req, res}) {
    const env = {
        NODE_ENV: process.env.NODE_ENV,
        UA_RES: process.env.UA_RES
    }
	try {
	    return await connectDB(async (req, res, mongoose) => {
            const boards = await Promise.all((await Boards.find().lean() ?? []).map(async (e) => {
                var weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                e.speed = (await Posts(e.title).find().lean() ?? []).filter((a) => new Date(a.date) > weekAgo).length;
	        	e._id=e._id.toString();
	        	e.creationDate=e.creationDate.toString();
	        	e.lastUpdateDate=e.lastUpdateDate.toString();
	        	return e;
	        }))

            let tracker = [];
            await Promise.all(
                boards.map(async (board) => {
                    const post = await Posts(board.title).find().sort({id: -1}).limit(50).lean();
                    post.map((p)=>{
                        p.board = board.title;
                        return p;
                    })
                    tracker = post.concat(tracker);
                })
            );
            tracker.sort((a,b) => (b.date-a.date)).slice(-50);
            tracker.map((post) => {
                delete post._id;
                post.date = post.date.toString();
                return post;
            })

	        return { props: { env, boards, tracker } }
	    })(req, res);
	} catch (e) {
		console.trace(e);
		return {props: { env, err: ["db-connection-error"], desc: `${e.name}: ${e.description}` }}
	}
}