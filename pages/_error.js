import Head from 'next/head'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import dynamic from "next/dynamic";
import LinksCardContent from '../controllers/LinksCardContent/LinksCardContent';
import Card from '../components/Card/Card';
import {nullish} from "../utils/polyfill";
const FastLinks = dynamic(() => import('../components/FastLinks/FastLinks'), {ssr: false});

function Error({ statusCode, description, title }) {
	const errName = (code) => {
		if (code) {
			switch (code) {
				case 404:
					return 'страница не найдена'
				default:
					break;
			}
			switch (Math.floor(code / 100)) {
				case 1:
					return 'информационный'
				case 2:
					return 'успешно (странно)'
				case 3:
					return 'перенаправление'
				case 4:
					return 'ошибка клиента'
				case 5:
					return 'ошибка сервера'
				default:
					return 'неизвестная ошибка'
			}
		}
		return `ошибка клиента`;
	}
	return (
		<div className="container homePage">
			<Head>
				<link rel="preconnect" href="https://fonts.gstatic.com"/>
				<link href="/fonts/SFUIDisplay/font-face.css" rel="stylesheet"/>
				<title>
					{ title ?? errName(statusCode) + ": " + statusCode }
				</title>
			</Head>
			<style>{`
			a.button {background:#faf;color:#000;text-decoration:none;padding:8px 12px;display:inline-block;border-radius:6px;font-weight:600;font-size:16px;box-shadow:0 2px 4px 0 #0002}
			`}</style>
			<header>
				<FastLinks />
				{statusCode
					? <Header title={statusCode}
						description={nullish(description, errName(statusCode))}
					/>
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
	return { statusCode, description }
};

export default Error
