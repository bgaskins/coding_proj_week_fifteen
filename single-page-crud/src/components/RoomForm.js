import React from "react";

export default class RoomForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nameValue: '',
            areaValue: ''
        };

        // Bind methods
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleAreaChange = this.handleAreaChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleNameChange(e) {
        this.setState({ nameValue: e.target.value });
    }

    handleAreaChange(e) {
        this.setState({ areaValue: e.target.value });
    }

    handleClick(e) {
        const newRoom = { name: this.state.nameValue, area: this.state.areaValue };
        if (newRoom.name && newRoom.area) {
            this.props.createRoom(e, this.props.data, newRoom);
            this.setState({ nameValue: '', areaValue: '' }); // Reset form values
        } else {
            alert('Please enter both name and area for the room.'); // Alert if validation fails
        }
    }

    render() {
        return (
            <form>
                <input
                    type="text"
                    placeholder="Name"
                    onChange={this.handleNameChange}
                    value={this.state.nameValue}
                />
                <input
                    type="text"
                    placeholder="Area"
                    onChange={this.handleAreaChange}
                    value={this.state.areaValue}
                />
                <button onClick={this.handleClick}>Add Room</button>
            </form>
        );
    }
}
