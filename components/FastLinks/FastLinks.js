import Link from "next/link";
import style from "./fastLinks.module.scss"
import { useSpring, a } from "react-spring";
import { globalThisPolyfill } from "../../utils/polyfill";

export default function FastLinks(props) {
    const closed = !!props.closed;
    const animOpen = useSpring({
        from: {
            marginTop: '-26px',
            top: '-26px'
        },
        to: {
            marginTop: '0px',
            top: '0px'
        },
        onRest: () => isClosed(closed)
    });
    const animClose = useSpring({
        from: {
            marginTop: '0px',
            top: '0px'
        },
        to: {
            marginTop: '-26px',
            top: '-26px'
        },
        onRest: () => isClosed(closed)
    });
    const links = {
        start: [
            {
                name: "главная",
                link: "/"
            }
        ],
        boards: [
            {
                name: "/a/",
                title: "/a/ниме",
                link: '/a/'
            },
            {
                name: "/b/",
                title: "/b/ред",
                link: '/b/'
            }
        ],
        end: [
            {
                name: "правила",
                link: '/rules/'
            },
            {
                name: "жалоба",
                link: '/feedback/'
            }
        ]
    };
    return (
        <a.div style={
            (isClosed() != null || isClosed() !== undefined) && closed !== isClosed()
              ? (closed ? animClose: animOpen)
              : (closed ? { marginTop: '-26px', top: '-26px' } : { marginTop: '0px', top: '0px' })
        } className={style.fastLinksWrap}>
            <span className={style.start}>
                {links.start.map((e, n) =>
                    <Link href={e.link} key={n}>{e.name}</Link>
                )}
            </span>
            <span>
                [ {links.boards.map((e, n) =>
                    <><Link href={e.link}>{e.name}</Link>{n < (links.boards.length-1) ? " | " : ''}</>
                )} ]
            </span>
            <span className={style.end}>
                {links.end.map((e, n) =>
                    <Link href={e.link} key={n}>{e.name}</Link>
                )}
            </span>
        </a.div>
    )
}

function isClosed(val) {
    globalThisPolyfill();
    // const storage = globalThis?.sessionStorage;
    // if (!storage) return null;
    // if (val === undefined) {
    //     // Set the previous path as the value of the current path.
    //     return JSON.parse(storage.getItem("fastLinksClosed"));
    // }
    // storage.setItem("fastLinksClosed", val);
    if (val === undefined) {
        return globalThis.fastLinksClosed;
    }
    globalThis.fastLinksClosed = val;
} 