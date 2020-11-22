import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import ThemeContext from './contexts/theme'
import Nav from './components/Nav'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Loading from './components/Loading'

const Popular = React.lazy(() => import('./components/Popular'))
const Battle = React.lazy(() => import('./components/Battle'))
const Results = React.lazy(() => import('./components/Results'))

function App () {
    const [theme, setTheme] = React.useState('dark')

    const toggleTheme = () => {
        setTheme(theme => theme === 'light' ? 'dark' : 'light')
    }

    const value = React.useMemo(() => ({
        theme,
        toggleTheme
    }), [theme])

    return (
        <Router>
            <ThemeContext.Provider value={value}>
                <div className={theme}>
                    <div className='container'>
                        <Nav />
                        <React.Suspense fallback={<Loading />}>
                            <Switch>
                                <Route exact path='/' component={Popular} />
                                <Route exact path='/battle' component={Battle} />
                                <Route path='/battle/results' component={Results} />
                                <Route render={ () => (<h1>404</h1>) } />
                            </Switch>
                        </React.Suspense>
                    </div>
                </div>
            </ThemeContext.Provider>
        </Router>
    )
}

const root = document.getElementById('app')
ReactDOM.render(<App />, root)