import Head from 'next/head'
import Link from 'next/link'

function Error({ statusCode }) {
    return (
        <>
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
            body {text-align: center;margin:12px 0;line-height:1.5}
            span.description {line-height:1.2}
            a {background:#faf;color:#000;text-decoration:none;padding:8px 12px;display:inline-block;border-radius:6px;font-weight:600;font-size:16px;box-shadow:0 2px 4px 0 #0002}
            `}</style>
            {statusCode ?
                <span className="description">
                    <h1>{statusCode}</h1>
                    An error occurred on server
                </span>
                :
                <>
                    <span className="description">
                        An error occurred on client
                    </span>
                </>
            }
            <hr/>
            <footer>
                <Link href="/">
                    To home page
                </Link><br/>
                rave.cat projects
            </footer>
        </>
    )
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
    return { statusCode }
};

export default Error
