import React, {Component} from 'react'
import { connect } from 'react-redux'
import { rmmbrSendedData } from '../actions/postActions'
import axios from 'axios'


class SendData extends Component {

    componentDidMount(){
        const {
            dataSended, 
            dataRecieved
        } = this.props.data
        this.setState({
                data: {
                    dataSended: dataSended,
                    dataRecieved: dataRecieved
                }
            }
        )
    }

    state = {
        data: {
            dataSended: '',
            dataRecieved: []
        }
    }

    sendData = async () => {
        let result = await axios.post('http://localhost:80/postServerData', {data: this.state.data.dataSended})
        let mergeDataRecieved = [...this.state.data.dataRecieved, result.data]
        this.setState({...this.state, data: {...this.state.data, dataRecieved: mergeDataRecieved}})
    }

    handleInput = () => {
        this.setState({...this.state, data: {...this.state.data, dataSended: event.target.value}})
    }

    onSubmit = (event) =>{
        event.preventDefault()
        this.sendData()
        .then(()=>{
            this.props.rmmbrSendedData(this.state.data)
        })

      }

    render(){
        return(
            <div>
            <form onSubmit={this.onSubmit}>
            <input  type="text" value={this.state.data.dataSended} onChange={this.handleInput} />
            <button className="btn btn-md btn-danger">Send</button></form>
            <br/>
            
            
            {this.state.data.dataRecieved.map(element=>{return (<div>{element.msg} {element.data}<br/></div>)})}
            
            </div>
        )

    }
}

const mapStateToProps = (state) => {
    return {
        data: state.data
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        rmmbrSendedData: (data) => { dispatch(rmmbrSendedData(data)) }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SendData)