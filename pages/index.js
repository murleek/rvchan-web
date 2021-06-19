import Cookies from 'cookies'
import Head from 'next/head'
import Card from '../components/card/card'
import TabbedCard from '../components/tabbedCard/tabbedCard'
import Header from '../components/header/header'
import Footer from '../components/footer/footer'
import LinksCardContent from '../components/card/linksCardContent/linksCardContent'
import StatsCardContent from '../components/card/statsCardContent/statsCardContent'
import BoardsCardContent from '../components/card/boardsCardContent/boardsCardContent'
import TrackerCardContent from '../components/card/trackerCardContent/trackerCardContent'
import { v4 as uuidv4 } from 'uuid';

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
    },
];

export default function Home({ session, privToken }) {
    return (
<div className="container homePage">
    <Head>
        <link rel="icon" href="/favicon.ico" />

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
        <Header />
    </header>

    <main>
        <Card>
            <b>» rvchan</b> - это анонимный <i>пока не</i> имиджборд, написанный одним школьником. Форум имеет тематические борды (aka разделы), в которых общение ограниченно темой борды или тредом. Доска “test0f1a” не имеет определенной темы общения, но подчиняется все тем же правилам форума. Всё, что не запрещено правилами отдельно взятого форума и относится к его тематике, на этом форуме разрешено
        </Card>
        <Card title={"ссылки"}>
            <LinksCardContent />
        </Card>
        <Card title={"статистика"}>
            <StatsCardContent />
        </Card>
        <TabbedCard items={items} />
    </main>

    <footer>
        <Footer session={session} privToken={privToken}/>
    </footer>
</div>
    )
}

Home.getInitialProps = (ctx) => {
    const cookies = new Cookies(ctx.req, ctx.res);
    let session = cookies.get("rv-session-pubtoken");
    let privToken = cookies.get("rv-session-privtoken");
    if (!session) {
        session = uuidv4();
        cookies.set("rv-session-pubtoken", session, {maxAge: 365*24*60*60*1000});
    }
    if (!privToken) {
        privToken = uuidv4();
        cookies.set("rv-session-privtoken", privToken, {maxAge: 15*60*1000});
    }
    return { session, privToken };
};