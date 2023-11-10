import React, { Component } from 'react';
import RoomForm from './RoomForm';

export default class House extends Component {
  constructor(props) {
    super(props);
  // Initialize the component state with flags and room data
    this.state = {
      isUpdating: false, // Track whether room update is in progress
      updatedRoom: {}, // Store the updated room data
    };
  }

  // Handle opening the update form
  handleUpdateClick = room => {
    this.setState({ isUpdating: true, updatedRoom: { ...room } });
  };

  // Handle canceling the update
  handleCancelUpdate = () => {
    this.setState({ isUpdating: false, updatedRoom: {} });
  };

  // Handle submitting the updated room
  handleUpdateRoom = e => {
    e.preventDefault();
    this.props.updateRoom(e, this.props.data, this.state.updatedRoom)
      .then(() => {
      // Reset the state after successful room update
        this.setState({ isUpdating: false, updatedRoom: {} });
      })
      .catch(error => {
        console.error('Error updating room:', error);
        // Handle the error as needed
      });
  };

  // Render the room data with edit functionality... User can input new name and area
  renderRoom(room) {
    if (this.state.isUpdating && this.state.updatedRoom._id === room._id) {
      return (
        <form onSubmit={this.handleUpdateRoom}>
          <input
            type="text"
            placeholder="Name"
            value={this.state.updatedRoom.name}
            onChange={e => this.setState({ updatedRoom: { ...this.state.updatedRoom, name: e.target.value } })}
          />
          <input
            type="text"
            placeholder="Area"
            value={this.state.updatedRoom.area}
            onChange={e => this.setState({ updatedRoom: { ...this.state.updatedRoom, area: e.target.value } })}
          />
          <button type="submit">Update</button> 
          <button onClick={this.handleCancelUpdate}>Cancel</button>
        </form>
      );
    }

    return (
      <div>
        {room.name} Area: {room.area}
        <button onClick={() => this.handleUpdateClick(room)}>Update</button>
        <button onClick={e => this.props.deleteRoom(e, this.props.data, room)}>Delete</button>
      </div>
    );
  }

  render() {
    const { data } = this.props;
    const { rooms } = data;

    // Displays each house 
    return (
      <div className="house">
        <h2>{data.name}</h2>
        {rooms && rooms.length > 0 ? rooms.map((room) => <li key={room._id}>{this.renderRoom(room)}</li>) : <li>No rooms available</li>}
        <RoomForm createRoom={this.props.createRoom} data={data} />
      </div>
    );
  }
}
