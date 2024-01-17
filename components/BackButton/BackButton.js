import style from "./backButton.module.scss"
import {useRouter} from "next/router";
import { useRef, useEffect, useState } from "react";
import { useTransition, a, useSpringRef } from '@react-spring/web'
import Refresh from "../../public/Refresh.svg";

export default function BackButton(props) {
    const router = useRouter()
    const backButtonRef = useRef(null);
    const [toTop, setToTop] = useState(backButtonRef.current?.getBoundingClientRect().top <= 2)

    useEffect(() => {
        const onScroll = () => {
            setToTop(backButtonRef.current.getBoundingClientRect().top <= 2)
        };
        // clean up code
        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const transRef = useSpringRef()
    const transitions = useTransition(toTop, {
      ref: transRef,
      keys: null,
      from: { opacity: 0, transform: 'translate3d(0,-200%,0)' },
      enter: { opacity: 1, transform: 'translate3d(0%,0,0)' },
      leave: { opacity: 0, transform: 'translate3d(0,-200%,0)' },
    })
    useEffect(() => {
      transRef.start()
    }, [toTop])
    const texts = [
        ({style}) => <a.span style={style}>{props.children}</a.span>,
        ({style}) => <a.span style={style}>наверх</a.span>
    ]
    return (
        <div className={style.stickyPanel}>
            <div className={style.backButton} ref={backButtonRef} onClick={async (e) => {
                if (toTop) return window.scroll({top: 0, behavior: 'smooth' })
                await router.push(props.href)
            }}>
            {transitions((style, i) => {
                const Text = texts[+i]
                return <Text style={style} />
            })}
            </div>
            <div className={style.updateButton} onClick={async (e) => {
                console.log('test')
            }}>
                <Refresh />
            </div>
        </div>
    )
}
