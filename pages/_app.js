import '/style/style.scss'
import Notifications from '../controllers/Notifications/Notifications'
import NextNprogress from 'nextjs-progressbar';
import DevToolsButton from '../components/DevTools/DevToolsButton/DevToolsButton';
import { Provider } from 'react-redux'

import store from '../app/store'

export default function RVChan({ Component, pageProps }) {
    return (<Provider store={store}>
        <NextNprogress
            color="#faf"
            stopDelayMs={200}
            height={2}
            options={{ easing: 'ease', speed: 500 }}
            />
        <Notifications />
        <DevToolsButton />
        <Component {...pageProps} />
    </Provider>);
}