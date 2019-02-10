import React, {Component} from 'react'
import axios from 'axios'

class Time extends Component {
    state = {
        time: ''
    }

    // constructor(){
    //     super()

    //     this.getData = this.getData.bind(this)
    // }

    getData = async () => {

        // let response = await fetch('http://localhost:80/getDBData')
        // let json = await response.json()

        // fetch('http://localhost:80/getDBData')
        // .then(response => response.json())
        // .then(data => {
        //     //this.setState({time: data.now})
        //     return data.now
        // })

        // axios.get('http://localhost:80/getDBData')
        // .then(result => {
        //     this.setState({time: result.data.now})
        //     a = result.data.now
        // })

        let result = await axios.get('http://localhost:80/getDBData')

        return result.data
    }
    
    componentDidMount = ()=>{
    this.getData().then(result => this.setState({time: result.now}))
        
    }

    render(){
        return(
            <div>
            Server time: {this.state.time}           
            </div>
        )

    }
}

export default Time