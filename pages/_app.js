import '/style/style.scss'
import NextNprogress from 'nextjs-progressbar';

export default function RVChan({ Component, pageProps }) {
    return (<>
        <NextNprogress
            color="#faf"
            stopDelayMs={200}
            height={2}
            options={{ easing: 'ease', speed: 500 }}
            />
        <Component {...pageProps} />
    </>);
}