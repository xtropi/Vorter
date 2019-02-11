import React, {Component} from 'react'
import axios from 'axios'

class SendData extends Component {
    state = {
        dataSended: '',
        dataRecieved: {}
    }

    sendData = async () => {
        let result = await axios.post('http://localhost:80/postServerData', {data: this.state.dataSended})
        this.setState({...this.state, dataRecieved: result.data})
    }

    handleInput = () => {
        this.setState({...this.state, dataSended: event.target.value})
    }

    onSubmit = (event) =>{
        event.preventDefault()
        this.sendData()
      }

    render(){
        return(
            <div>
            <form onSubmit={this.onSubmit}>
            <input type="text" value={this.state.dataSended} onChange={this.handleInput} />
            <button onClick={this.sendData}>Send</button></form>
            <br/>
            {this.state.dataRecieved.msg}<br/>
            {this.state.dataRecieved.data}<br/>
            </div>
        )

    }
}

export default SendData