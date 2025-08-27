import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : [];
  });
  const [weather, setWeather] = useState(() => {
    const saved = localStorage.getItem('weather');
    return saved ? JSON.parse(saved) : null;
  });
  const [showModal, setShowModal] = useState(false);

  function fetchOneRandomUser() {
    const results = Math.floor(Math.random() * 90) + 1;
    fetch(`https://randomuser.me/api/?results=${results}`)
      .then(res => res.json())
      .then(data => {
        const user = data.results[Math.floor(Math.random() * data.results.length)];
        setUsers([user]);
        localStorage.setItem('users', JSON.stringify([user])); 

        if (user?.location?.coordinates) {
          const lat = parseFloat(user.location.coordinates.latitude);
          const lon = parseFloat(user.location.coordinates.longitude);
          fetchWeatherByCurrentLocation(lat, lon);
        }
      })
      .catch(err => console.error('Error fetching user:', err));
  }

  function fetchWeatherByCurrentLocation(lat, lon) {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m`) 
      .then(res => res.json())
      .then(data => {
        setWeather(data);
        localStorage.setItem('weather', JSON.stringify(data));
      })
      .catch(err => console.error('Error fetching weather:', err));
  }

  return (
    <>
    <div className="App">
      <div className="ml-[110px] mt-[15px]">
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
          onClick={fetchOneRandomUser}
        >
          Завантажити нового користувача та погоду
        </button>
      </div>
    </div>
      <div>
        {users.map(user => (
          <div key={user.login.uuid}>
            <img src={user.picture.large} width={100} alt="avatar" className='ml-[14px] w-[250px] mt-[20px]'/>
            <h3 className='ml-[14px] font-Lato font-bold text-[18px] text-balck leading-[22px]'>Name: {user.name.first} {user.name.last}</h3>
            <p className='ml-[14px] font-Lato font-bold text-[18px] text-balck leading-[22px]'>Gender: {user.gender}</p>
            <p className='ml-[14px] font-Lato font-bold text-[18px] text-balck leading-[22px]'>Location: {user.location.country}</p>
            <p className='ml-[14px] font-Lato font-bold text-[18px] text-balck leading-[22px]'>Email: {user.email}</p>
          </div>
        ))}
      </div>

      <div>
        <button
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4 ml-[14px] mt-[5px]"
          onClick={() => setShowModal(true)}
        >
          Показати погоду
        </button>

        {showModal && weather && (
          <div className="fixed top-0 left-0 w-full h-full bg-black opacity-75 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg w-[400px] relative">
              <button
                className="absolute top-2 right-2 text-black font-bold"
                onClick={() => setShowModal(false)}
              >
                X
              </button>

              <h1 className="font-bold text-lg mb-2">Weather</h1>
              <h3>Time: {weather.current_weather.time}</h3>
              <p>Temperature: {weather.current_weather.temperature} {weather.current_weather_units.temperature}</p>
              <p>Wind Speed: {weather.current_weather.windspeed} {weather.current_weather_units.windspeed}</p>
              <p>Wind Direction: {weather.current_weather.winddirection} {weather.current_weather_units.winddirection}</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App;
