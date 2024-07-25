/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventCard from "../cards/EventCard.jsx";

function UserDashboard() {
  const [userData, setUserData] = useState({
    name: '',
    id: '',
    phone: '',
    email: '',
    branch: ''
  });
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [volunteeringEvents, setVolunteeringEvents] = useState([]);
  const [createdEvents, setCreatedEvents] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/user/get/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data[0]);

        const [registeredResponse, volunteeringResponse, createdResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API}/user/participating/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_API}/user/volunteering/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${process.env.REACT_APP_API}/user/hosting/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        setRegisteredEvents(registeredResponse.data);
        setVolunteeringEvents(volunteeringResponse.data);
        setCreatedEvents(createdResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserData();
  }, [token]);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">User Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Name:</span> {userData.name}</p>
          <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">ID:</span> {userData.id}</p>
          <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Phone:</span> {userData.phone}</p>
          <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Email:</span> {userData.email}</p>
          <p className="text-gray-700 dark:text-gray-300"><span className="font-medium">Branch:</span> {userData.branch}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Registered Events</h2>
        {registeredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {registeredEvents.map((card) => (
              <EventCard key={card.id} card={card} />
            ))}
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">No registered events found.</p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Volunteering Events</h2>
        {volunteeringEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {volunteeringEvents.map((card) => (
              <EventCard key={card.id} card={card} />
            ))}
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">Not volunteering for any events.</p>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Created Events</h2>
        {createdEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {createdEvents.map((card) => (
              <EventCard key={card.id} card={card} />
            ))}
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300">No events created.</p>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
