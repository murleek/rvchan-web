import Head from 'next/head'
import Link from 'next/link'
import Header from '../components/header/header'
import Footer from '../components/footer/footer'
import dynamic from "next/dynamic";
import LinksCardContent from '../components/card/linksCardContent/linksCardContent';
import Card from '../components/card/card';
const FastLinks = dynamic(() => import('../components/fastLinks/fastLinks'), {ssr: false});

function Error({ statusCode, description }) {
    return (
        <div className="container homePage">
            <Head>
                <link rel="preconnect" href="https://fonts.gstatic.com"/>
                <link href="/fonts/SFUIDisplay/font-face.css" rel="stylesheet"/>
                <title>
                    {statusCode
                        ? `Server error ${statusCode}`
                        : 'Client error'}
                </title>
            </Head>
            <style>{`
            a.button {background:#faf;color:#000;text-decoration:none;padding:8px 12px;display:inline-block;border-radius:6px;font-weight:600;font-size:16px;box-shadow:0 2px 4px 0 #0002}
            `}</style>
            <header>
                <FastLinks />
                {statusCode
                    ? <Header title={statusCode} description={
                        description !== null && obj !== void 0
                            ? description
                            : "серверная ошибка"
                        } />
                    : <Header title={"ошибка клиента"} description={null} />
                }
            </header>
            <main>
                <Card title={"ссылки"}>
                    <LinksCardContent />
                </Card>
            </main>
            <footer>
                <Footer />
            </footer>
        </div>
    )
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    const description = res.description;
    return { statusCode }
};

export default Error
