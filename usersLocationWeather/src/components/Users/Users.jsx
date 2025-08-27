import { useState, useEffect } from 'react';
import '../../App.css';

function Users() {
  const [users, setUsers] = useState([]);
  const [savedUsersIds, setSavedUsersIds] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('users')) || [];
    return saved.map(u => u.login?.uuid).filter(Boolean);
  });
  const [weatherByUserId, setWeatherByUserId] = useState({});
  const [showModalUserId, setShowModalUserId] = useState(null);

  // Додати нового користувача
  function addRandomUser() {
    fetch('https://randomuser.me/api/')
      .then(res => res.json())
      .then(data => {
        const newUser = data.results[0];
        // перевіряємо наявність login і picture
        if (!newUser?.login?.uuid || !newUser?.picture?.large) return;
        setUsers(prev => [...prev, newUser]);
      });
  }

  // Зберегти користувача
  function saveUser(user) {
    if (!user?.login?.uuid) return;
    const savedUsers = JSON.parse(localStorage.getItem('users')) || [];
    if (!savedUsers.find(u => u.login?.uuid === user.login.uuid)) {
      savedUsers.push(user);
      localStorage.setItem('users', JSON.stringify(savedUsers));
      setSavedUsersIds(prev => [...prev, user.login.uuid]);
    }
  }

  // Завантажити погоду
  function fetchWeather(user) {
    if (!user?.login?.uuid || !user.location?.coordinates) return;
    const lat = parseFloat(user.location.coordinates.latitude);
    const lon = parseFloat(user.location.coordinates.longitude);

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
      .then(res => res.json())
      .then(data => {
        setWeatherByUserId(prev => ({
          ...prev,
          [user.login.uuid]: data.current_weather
        }));
        setShowModalUserId(user.login.uuid);
      });
  }

  // Додати першого користувача при першому рендері
  useEffect(() => {
    addRandomUser();
  }, []);

  return (
    <div className="App">
      {users.map((user, index) => (
        user?.login?.uuid && user?.picture?.large && (
          <div key={user.login.uuid} className="ml-[14px] mt-[20px] border p-4 rounded shadow-md">
            <img src={user.picture.large} width={100} alt="avatar" />
            <h3>Name: {user.name.first} {user.name.last}</h3>
            <p>Gender: {user.gender}</p>
            <p>Location: {user.location?.country}</p>
            <p>Email: {user.email}</p>

            <button
              className={`py-1 px-2 rounded mt-2 mr-2 ${savedUsersIds.includes(user.login.uuid) ? 'bg-gray-500' : 'bg-yellow-500'} text-white font-bold`}
              onClick={() => saveUser(user)}
              disabled={savedUsersIds.includes(user.login.uuid)}
            >
              {savedUsersIds.includes(user.login.uuid) ? 'Збережено' : 'Зберегти користувача'}
            </button>

            <button
              className="bg-green-500 text-white font-bold py-1 px-2 rounded mt-2"
              onClick={() => fetchWeather(user)}
            >
              Показати погоду
            </button>

            {showModalUserId === user.login.uuid && weatherByUserId[user.login.uuid] && (
              <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 flex items-center justify-center">
                <div className="bg-white p-6 rounded shadow-lg w-[400px] relative">
                  <button
                    className="absolute top-2 right-2 text-black font-bold"
                    onClick={() => setShowModalUserId(null)}
                  >
                    X
                  </button>
                  <h1 className="font-bold text-lg mb-2">Weather</h1>
                  <p>Time: {weatherByUserId[user.login.uuid].time}</p>
                  <p>Temperature: {weatherByUserId[user.login.uuid].temperature} °C</p>
                  <p>Wind Speed: {weatherByUserId[user.login.uuid].windspeed} km/h</p>
                  <p>Wind Direction: {weatherByUserId[user.login.uuid].winddirection}°</p>
                </div>
              </div>
            )}

            {index === users.length - 1 && (
              <div className="mt-4">
                <button
                  className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
                  onClick={addRandomUser}
                >
                  Додати користувача
                </button>
              </div>
            )}
          </div>
        )
      ))}
    </div>
  );
}

export default Users;
