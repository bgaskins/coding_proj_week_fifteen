import React from 'react';
import House from './components/House';
import './App.css';


/* 
Coding Steps:

1. Using the Houses API, or any open API of your choice you can find online, 
create a single page that allows for all 4 CRUD operations to be performed on a 
resource from the API.

2. Create a React component (or more, if needed) to represent the resource.

3. Make all forms and other necessary UI pieces their own components as reasonable. 
*/


// API endpoint for the Houses API
const HOUSES_ENDPOINT = 'https://ancient-taiga-31359.herokuapp.com/api/houses';

// Helper function for updating a house
function updateHouse(house) {
  // Make a PUT request to update the house data
  return fetch(`${HOUSES_ENDPOINT}/${house._id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(house),
  })
    .then(response => {
      // Check if the network response is successful or not
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Parse and return the JSON response
      return response.json();
    })
    .catch(error => console.error('Error updating house:', error)); // Handle errors during the update process
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
  // Initialize the component state with an empty houses array
    this.state = { houses: [] };
  // Bind methods to make `this` work in the callback
    this.createRoom = this.createRoom.bind(this);
    this.updateRoom = this.updateRoom.bind(this);
    this.deleteRoom = this.deleteRoom.bind(this);
  }

  componentDidMount() {
  // Fetch houses data from the API when the component mounts
    fetch(HOUSES_ENDPOINT) 
      .then(res => res.json())
      .then(data => {
      // Set the fetched houses data to the component state
        this.setState({ houses: data });
      })
      .catch(error => console.error('Error fetching data:', error)); // Handle errors during the fetch process
  }

  // Create a room in a house
  createRoom(e, house, room) {
    e.preventDefault(); // Prevent the default form submission
    house.rooms.push(room); // Add the new room to the house
    updateHouse(house)
      .then(() => {
        this.setState(state => {
          // Update the state with the modified house data
          const updatedHouses = state.houses.map(h => {
            if (h._id === house._id) {
              return { ...h, rooms: house.rooms };
            }
            return h;
          });
          return { houses: updatedHouses };
        });
      })
      .catch(error => console.error('Error creating room:', error)); // Handle errors during the room creation process
  }

  // Update a room in a house
  updateRoom(e, house, updatedRoom) {
    e.preventDefault();
    const updatedRooms = house.rooms.map(room => {
      // Find and update the room with the matching _id
      if (room._id === updatedRoom._id) {
        return updatedRoom;
      }
      return room;
    });

    const updatedHouse = { ...house, rooms: updatedRooms };

    return new Promise((resolve, reject) => {
      // Use the updateHouse function to send the modified house data to the API
      updateHouse(updatedHouse)
        .then(updatedHouseData => {
          // Update the state with the modified house data
          this.setState(prevState => ({
            houses: prevState.houses.map(h =>
              h._id === updatedHouse._id ? updatedHouseData : h
            ),
          }));
          // Resolve the promise with the updated house data
          resolve(updatedHouseData);
        })
        .catch(error => {
          console.error('Error updating room:', error);
          // Reject the promise with an error if there's an issue during the update process
          reject(error);
        });
    });
  }

  // Delete a room from a house
  deleteRoom(e, house, roomToDelete) {
    e.preventDefault();

    // Create a new array of rooms without the room to be deleted
    const updatedRooms = house.rooms.filter(room => room._id !== roomToDelete._id);

    // Create a new house object with the updated rooms
    const updatedHouse = { ...house, rooms: updatedRooms };

    return new Promise((resolve, reject) => {
      // Use the updateHouse function to send the modified house data to the API
      updateHouse(updatedHouse)
        .then(updatedHouseData => {
          // Update the state with the modified house data
          this.setState(prevState => ({
            houses: prevState.houses.map(h =>
              h._id === updatedHouse._id ? updatedHouseData : h
            ),
          }));
          // Resolve the promise with the updated house data
          resolve(updatedHouseData);
        })
        .catch(error => {
          console.error('Error deleting room:', error);
          // Reject the promise with an error if there's an issue during the delete process
          reject(error);
        });
    });
  }

  render() {
    // Limit the number of houses to display
    const maxHousesToShow = 4;
    const displayedHouses = this.state.houses.slice(0, maxHousesToShow);

    // Render House components
    const houses = displayedHouses.map((house, index) => (
      <House
        key={house._id} // Use a unique id for the key
        data={house}
        createRoom={this.createRoom}
        updateRoom={this.updateRoom}
        deleteRoom={this.deleteRoom}
      />
    ));

    return <div className="house-list">{houses}</div>;
  }
}
