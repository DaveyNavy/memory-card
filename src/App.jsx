import { useState } from "react";
import { useEffect } from "react";
import Card from "./components/card";
import "./App.css"


export default function App() {

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [seen, setSeen] = useState([]);


  function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
  }



  const [urls, setUrls] = useState([]);
  const [pokemon, setPokemon] = useState([])

  function fetchUrls(ignore) {
    const randInt = getRandomInt(0, 1000);
    let data = [];
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=24&offset=${randInt}`)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      data = Array.from(result.results);
      if (!ignore) {
        setUrls(data);
      }
    })
  }

  useEffect(() => {
    let ignore = false;

    const randInt = getRandomInt(0, 1000);
    let data = [];
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=24&offset=${randInt}`)
    .then((response) => {
      return response.json();
    })
    .then((result) => {
      data = Array.from(result.results);
      if (!ignore) {
        setUrls(data);
      }
    })
        
    return () => { ignore = true; }
  }, [])

  useEffect(() => {
    if (urls.length === 0) return;
    const promises = urls.map(item => {
      return fetch(item.url)
      .then((response) => {
        return response.json();
      })
    })
    
    Promise.all(promises).then((results) => {
      const pokemonList = results.map((e, i) => {
        return {name: e.name, image: e.sprites.front_default, id: i};
      })
      setPokemon(pokemonList);
    })

  }, [urls])


  function shuffle(array) {
    return array
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
  }

  
  function handleOnClick(id) {
    if (!seen.includes(id)) {
      setScore(score+1);
      if (score+1 > bestScore) {
        setBestScore(score+1);
      }
      setSeen([...seen, id]);
    } else {
      setScore(0);
      setSeen([]);
    }

    const shuffled = shuffle(pokemon);
    setPokemon(shuffled);
  }

  return (
    <div className="container">
      <div className="header">
        <div className="description">
          <h1>Pokemon Memory Game</h1>
          <p>Click on as many Pokemon as you can, but don&apos;t click the same one twice!</p>
          <button onClick={() => fetchUrls(false)}>New Pokemon</button>
        </div>
        <div className="score">
          <h2>Score: {score}</h2>
          <h2>Best Score: {bestScore}</h2>
        </div>
      </div>

      <div className="content">
        {pokemon.map((e) => {
          return <Card image={e.image} name={e.name} key={e.id} handleOnClick={() => handleOnClick(e.id)}></Card>
        })}
      </div>
    </div>
  )
  
}