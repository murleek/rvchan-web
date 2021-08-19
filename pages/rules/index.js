import Cookies from 'universal-cookie'
import { v4 as uuidv4 } from 'uuid'
import Head from 'next/head'
import {useRouter} from 'next/router'
import Error from '../_error'
import Header from '../../components/header/header'
import Footer from '../../components/footer/footer'
import Card from '../../components/card/card'
import dynamic from "next/dynamic";
const FastLinks = dynamic(() => import('../../components/fastLinks/fastLinks'), {ssr: false});

export default function Thread({ session, privToken, referrer }) {
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
            <Header description="правила сайта"/>
        </header>

        <main>
            <Card>
                скоро тут появятся правила...
            </Card>
        </main>

        <footer>
            <Footer session={session} privToken={privToken}/>
        </footer>
    </div>
    )
}

Thread.getInitialProps = (ctx) => {
    var cookies = new Cookies();
    var referrer = "";
    if (ctx.req != null) {
        referrer = ctx.req.headers.referer;
        cookies = new Cookies(ctx.req.headers.cookie);
    } else {
        referrer = document.referrer;
    }
    let session = cookies.get("rv-session-pubtoken");
    let privToken = cookies.get("rv-session-privtoken");
    console.log(session, privToken);
    return { session, privToken, referrer };
};
