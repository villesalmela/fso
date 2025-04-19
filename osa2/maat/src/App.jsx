import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'
import restcountries from "./services/restcountries"
import weatherservice from "./services/weather"

function Input({ handleChange, value }) {
  return (
    <input onChange={handleChange} value={value} />
  )
}

function Display({selected, filter, updateFunc, country}) {

  function modUpdateFunc(updateFunc, countryName) {
    return () => {
      updateFunc(countryName)
      
    }
  }

  if (filter.length === 0) {
    return
  }
  if (selected.length > 10) {
    return (<p>Too many matches</p>)
  }
  if (selected.length === 1) {
    return (
      <div>
      <h2>{country.name}</h2>
      <p><strong>Capital: </strong>{country.capital}</p>
      <p><strong>Languages:</strong></p>
      <ul>
        {country.languages.map((lang) => <li key={lang}>{lang}</li>)}
      </ul>
      <div><img src={country.flag_url}/></div>
      </div>
    )
  }
  return (
    <ul>
    {selected.map(country => <li key={country.name}>{country.name}<button onClick={modUpdateFunc(updateFunc, country.name)}>show</button></li>)}
    </ul>
  )
}

function DisplayWeather({weather}) {
  if (weather == null)
    return
  
  return (
    <>
    <h3>Weather</h3>
    <p><strong>{weather.desc}</strong></p>
    <div><img src={weather.icon_url}/></div>
    <p><strong>Temperature: </strong>{weather.temp} C</p>
    <p><strong>Wind: </strong>{weather.wind} m/s</p>
    </>
  )
}


function App() {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [selected, setSelected] = useState([])
  const [country, setCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  function getRestData() {
    restcountries.getAll().then((response) => {setCountries(response)})
  }

  function getWeatherData(country) {
    if (country == null) {
      setWeather(null)
    } else weatherservice.get(country.lat, country.lng).then((weather) => setWeather(weather))
  }
  
  useEffect(() => getRestData, [])

  function update(filterValue) {
    setFilter(filterValue)
    const countries_temp = countries.filter(country => country.name.toLowerCase().includes(filterValue.toLowerCase()))
    setSelected(countries_temp)
    let country
    if (countries_temp.length === 1) {
      country = countries_temp[0]
    } else {
      country = null
    }
    setCountry(country)
    getWeatherData(country)
  }

  const handleFilterChange = (event) => {
    update(event.target.value)
  }

  return (
  <>
  <p>find countries</p>
  <div>
    <Input handleChange={handleFilterChange} value={filter} />
  </div>
    <div>
      <Display selected={selected} filter={filter} updateFunc={update} country={country} />
      <DisplayWeather weather={weather} />
    </div>
  </>
  )

}

export default App
