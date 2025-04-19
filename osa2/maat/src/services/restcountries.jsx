import axios from "axios"

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api"

function mangle(data) {
    const countries = []
    for (let item of data) {
      try {
        let country = {}
        country.name = item.name.common
        country.capital = item.capital[0]
        country.languages = Object.values(item.languages)
        country.flag_url = item.flags.png
        country.lat = item.capitalInfo.latlng[0]
        country.lng = item.capitalInfo.latlng[1]
        countries.push(country)  
      } catch (error) {
        console.log(`failed to parse ${item.name.common}`)
      }
      
    }
    return countries
  }

const getAll = () => {
    return axios.get(`${baseUrl}/all`).then((response) => mangle(response.data))
}

export default { getAll }