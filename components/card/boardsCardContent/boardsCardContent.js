import style from "./boardsCardContent.module.scss"

const imgs = [
    "https://srbu.ru/images/stroitelnye-materialy/vidy-dosok-iz-dereva/vidy-dosok-iz-dereva.jpg",
    "https://upload.wikimedia.org/wikipedia/ru/0/00/%D0%9E%D0%B1%D1%80%D0%B5%D0%B7%D0%BD%D0%B0%D1%8F_%D0%B4%D0%BE%D1%81%D0%BA%D0%B0.jpg",
    "https://alfastroy.kharkov.ua/images/items/pilomaterialy-300x366-8c8.jpg"
];

export default function BoardsCardContent() {
    return (
        <div>
            <h2 align="center">ДОСКИ ТРЕД ОБЪЯВЛЯЮ ОТКРЫТЫМ!!!!!</h2>
            <div className={style.doskaSDoskami}>
            {imgs.map((i) =>
                <img className={style.doska} alt="доска" src={i}/>
            )}
            </div>
        </div>
    )
}