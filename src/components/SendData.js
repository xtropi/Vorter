import React, {Component} from 'react'
import axios from 'axios'

class SendData extends Component {
    state = {
        dataSended: '',
        dataRecieved: []
    }

    sendData = async () => {
        let result = await axios.post('http://localhost:80/postServerData', {data: this.state.dataSended})
        let mergeDataRecieved = [...this.state.dataRecieved, result.data]
        this.setState({...this.state, dataRecieved: mergeDataRecieved})
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
            <input  type="text" value={this.state.dataSended} onChange={this.handleInput} />
            <button className="btn btn-md btn-danger">Send</button></form>
            <br/>
            
            
            {this.state.dataRecieved.map(element=>{return (<div>{element.msg} {element.data}<br/></div>)})}
            
            </div>
        )

    }
}

export default SendData