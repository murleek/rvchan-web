import Cookies from 'universal-cookie'
import { v4 as uuidv4 } from 'uuid'
import Head from 'next/head'
import {useRouter} from 'next/router'
import Error from '../_error'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import Card from '../../components/Card/Card'
import dynamic from "next/dynamic";
import Navigation from "../../components/Navigation/Navigation";
import TrackerCardContent from "../../controllers/TrackerCardContent/TrackerCardContent";
import BoardsCardContent from "../../controllers/BoardsCardContent/BoardsCardContent";
const FastLinks = dynamic(() => import('../../components/FastLinks/FastLinks'), {ssr: false});

export default function Feedback() {
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
    const items = [
        {
            id: 'stats',
            name: "статистика",
            content: ( <Card>
                Я ХАЧУ ПИТСЫ!!!!!!!!!!!!!!!!!!
            </Card> )
        },
        {
            id: 'boards',
            name: "доски",
            content: ( <Card>
                ПИТСЫ ХАЧУ!!!!!!!!!!!!!!!!!!!!!
            </Card> )
        },
        {
            id: 'files',
            name: "файлы",
            content: ( <Card>
                ДАБ ДАБ ДАБ АУ АУ УУУУУУУУУУУУУУУУУ А
            </Card> )
        },
        {
            id: 'moderators',
            name: "модераторы",
            content: ( <Card>
                SSSSSSSSSSSSSSS creeee
            </Card> )
        },
        {
            id: 'notifications',
            name: <>уведомления<br/>dada</>,
            content: ( <Card>
                ДАДА ОЧИНЬ ВАЖНА ЛАДНА
            </Card> )
        }
    ];

    return (
        <div className="container homePage">
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <link rel="preload" href="/fonts/SFUIDisplay/font-face.css" as="style" />

                <title>rvchan » правила</title>
                <meta name="title" content="» rvchan" />
                <meta name="description" content="правила" />
                <meta name="keywords" content="rvchan, рвчан, рвач, имиджборд, imageboard, rvach, ravecat, двач, 4chan, форчан"/>

                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://ch.rave.cat" />
                <meta property="og:title" content="» rvchan" />
                <meta property="og:description" content="правила" />
                {/*<meta property="og:image" content="https://ch.rave.cat/android-chrome-192x192.png" />*/}

                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content="https://ch.rave.cat" />
                <meta property="twitter:title" content="» rvchan" />
                <meta property="twitter:description" content="правила" />
                {/*<meta property="twitter:image" content="https://ch.rave.cat/android-chrome-192x192.png" />*/}
            </Head>

            <header>
                <FastLinks />
                <Header description="система"/>
            </header>

            <Navigation items={items}/>

            <footer>
                <Footer session={session} privToken={privToken}/>
            </footer>
        </div>
    )
}