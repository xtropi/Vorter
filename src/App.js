import React, {Component} from 'react'
import Navbar from './components/Navbar'
import Main from './components/Main'
import Register from './Register'
import Profile from './Register'
import About from './components/About'
import { BrowserRouter, Route, Switch} from 'react-router-dom'

class App extends Component {
    render(){
        return(
            <div>

            {/* isLoggedIn ? */}

            <BrowserRouter>
            <div className='App'>
                <Navbar />
            <Switch>
                
                <Route exact path='/' component={Main}/>
                <Route path='/about' component={About}/>

            </Switch>
            </div>
            </BrowserRouter>

             {/* : */}

            {/* <Register /> */}
            
            </div>
        )

    }
}

export default App