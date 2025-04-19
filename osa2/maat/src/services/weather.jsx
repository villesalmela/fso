import axios from "axios"
const api_key = import.meta.env.VITE_API_KEY


const baseUrl = "https://api.openweathermap.org/data/2.5/weather"

function mangle(data) {
    return {
        desc: data.weather[0].description,
        icon_url: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        temp: data.main.temp,
        wind: data.wind.speed
    }
}

function get(lat, lon) {
    const params = `?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`
    return axios.get(baseUrl + params).then((request) => mangle(request.data))
}

export default { get }