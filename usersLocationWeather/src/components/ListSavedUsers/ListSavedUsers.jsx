import { useState, useEffect } from 'react';
import '../../App.css';

function ListSavedUsers() {
  const [savedUsers, setSavedUsers] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    setSavedUsers(users);
  }, []);

  if (savedUsers.length === 0) {
    return <h1 className="ml-[14px] mt-[15px] font-bold text-lg">Немає збережених користувачів</h1>;
  }

  return (
    <div className="ml-[14px] mt-[15px]">
      <h1 className="font-bold text-xl mb-4">Збережені користувачі</h1>
      {savedUsers.map(user => (
        user?.login?.uuid && user?.picture?.large && (
          <div key={user.login.uuid} className="border p-4 m-2 rounded shadow-md">
            <img src={user.picture.large} width={100} alt="avatar" className="mb-2"/>
            <h3 className="font-bold text-lg">Name: {user.name.first} {user.name.last}</h3>
            <p className="font-medium">Gender: {user.gender}</p>
            <p className="font-medium">Location: {user.location?.country}</p>
            <p className="font-medium">Email: {user.email}</p>
          </div>
        )
      ))}
    </div>
  );
}

export default ListSavedUsers;
