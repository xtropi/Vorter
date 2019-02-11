import React, {Component} from 'react'
import Time from './Time'
import SendData from './SendData'

class Main extends Component {
    render(){
        return(
            <div>
            <Time />
            <hr/>
            <SendData />
            </div>
        )

    }
}

export default Main