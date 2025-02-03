import "../styles/card.css"

export default function Card({ name, image, handleOnClick }) {
    return (
        <div className="card" onClick={handleOnClick}>
            <img src={image} alt="" />
            <h2>{name[0].toUpperCase() + name.slice(1)}</h2>
        </div>
    )
}