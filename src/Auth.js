import React, {Component} from 'react'
import App from './App'
import Register from './Register'

class Auth extends Component {
    render(){
        return(
            <div>
            { true ? <App/> : <Register/> /* isLoggedIn} */}
            
                
            
            </div>
        )

    }
}

export default Auth