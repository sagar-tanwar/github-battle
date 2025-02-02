import React from 'react'
import PropTypes from 'prop-types'
import { fetchPopularRepos } from '../utils/api'
import { FaUser, FaStar, FaCodeBranch, FaExclamationTriangle } from 'react-icons/fa'
import Card from './Card'
import Loading from './Loading'
import Tooltip from './Tooltip'

function LanguagesNav({ selected, onUpdateLanguage }) {
    const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python']
    return (
        <ul className="flex-center">
            { languages.map((language) => (
                <li key={language}>
                    <button
                        className="btn-clear nav-link"
                        onClick={() => onUpdateLanguage(language)}
                        style={language === selected ? { color: 'rgb(187, 46, 31)' } : null}>
                        {language}
                    </button>
                </li>
            ))}
        </ul>
    )
}

LanguagesNav.propTypes = {
    selected: PropTypes.string.isRequired,
    onUpdateLanguage: PropTypes.func.isRequired
}

function RepoGrid({ repos }) {
    return (
        <ul className='grid space-around'>
            {repos.map((repo, index) => {
                const { name, owner, html_url, stargazers_count, forks, open_issues } = repo
                const { login, avatar_url } = owner

                return (
                    <li key={html_url} >
                        <Card
                            header={`#${index + 1}`}
                            avatar={avatar_url}
                            href={html_url}
                            name={login}
                         >
                            <ul className='card-list'>
                                <li>
                                    <Tooltip text="User's Name">
                                        <FaUser color='rgb(255, 191, 116)' size={22} />
                                        <a href={`https://github.com/${login}`}>{name}</a>
                                    </Tooltip>
                                </li>
                                <li>
                                    <FaStar color='rgb(255, 215, 0)' size={22} />
                                    {stargazers_count.toLocaleString()} stars
                                </li>
                                <li>
                                    <FaCodeBranch color='rgb(129, 195, 245)' size={22} />
                                    {forks.toLocaleString()} forks
                                </li>
                                <li>
                                    <FaExclamationTriangle color='rgb(241, 138, 147)' size={22} />
                                    {open_issues.toLocaleString()} open
                                </li>
                            </ul>
                        </Card>
                    </li>
                )
            })}
        </ul>
    )
}

RepoGrid.prototype = {
    repos: PropTypes.array.isRequired
}

function popularReducer (state, action) {
    switch (action.type) {
        case 'success':
            return {
                ...state,
                [action.selectedLanguage]: action.data,
                error: null
            }
        case 'error':
            return {
                ...state,
                error: 'There was an error fetching the repositories.'
            }
        default:
            throw new Error('There was an error fetching the repositories.')
    }
}

export default function Popular () {
    const [selectedLanguage, setSelectedLanguage] = React.useState('All')
    const [state, dispatch] = React.useReducer(
        popularReducer,
        {error: null}
    )

    const fetchedLanguages = React.useRef([])


    React.useEffect(() => {
        if (fetchedLanguages.current.includes(selectedLanguage) === false) {
            fetchedLanguages.current.push(selectedLanguage)
            fetchPopularRepos(selectedLanguage)
                .then((data) => dispatch({type: 'success', data, selectedLanguage}))
                .catch((error) => dispatch({type: 'error'}))
        }

    }, [fetchedLanguages, selectedLanguage])

    const isLoading = () => {
        return !state[selectedLanguage] && state.error === null
    }

    return (
        <React.Fragment>
            <LanguagesNav
                selected={selectedLanguage}
                onUpdateLanguage={setSelectedLanguage}
            />

            {isLoading() && <Loading text='Fetching Repos' />}
            {state.error && <p className='center-text error'>{state.error}</p>}
            {state[selectedLanguage] && <RepoGrid repos={state[selectedLanguage]} />}
        </React.Fragment>
    )
}