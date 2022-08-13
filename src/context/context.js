import React, { useState, useEffect, useContext } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';
import { MdLocalGasStation } from 'react-icons/md';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext()

const GithubProvider = ({children}) => {
    const [githubUser, setGithubUser] = useState(mockUser)
    const [repos, setRepos] = useState(mockRepos)
    const [followers, setFollowers] = useState(mockFollowers)
    // requests loading
    const [requests, setRequests] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    // error
    const [error, setError] = useState({ show: false, msg: "" });
    // check requests
    const checkRequests = () => {
        axios(`${rootUrl}/rate_limit`)
            .then(({data}) => {
                let {rate: {remaining}} = data
                setRequests(remaining)
                if(remaining === 0) {
                    toggleError(true, 'sorry, you have execeeded your hourly rate limit!')
                }
            })
            .catch((err) => console.log(err))
    }
    
    function toggleError(show = false, msg = '') {
        setError({show,msg})
    }

    const searchGithubUser = async (user) => {
        toggleError()
        setIsLoading(true)
        const response = await axios(`${rootUrl}/users/${user}`).catch(err => console.log(err))
        if(response) {
            setGithubUser(response.data)
            const {login, followers_url} = response.data
            await Promise.allSettled([
              axios(`${rootUrl}/users/${login}/repos?per_page=100`),
              axios(`${followers_url}?per_page=100`),
            ]).then((result) => {
                // theo thứ tự từ trên xuống dưới của Promise.allSettled
                const [repos, followers] = result
                const status = 'fulfilled'
                if(repos.status === status) {
                    setRepos(repos.value.data)
                } 
                if (followers.status === status) {
                  setFollowers(followers.value.data);
                } 
            }).catch((error) => console.log(error))
        } else {
            toggleError(true, "there is no user with that username");
        }
        checkRequests()
        setIsLoading(false)
    }

    useEffect(() => {
        checkRequests();
    }, [])
    return (
      <GithubContext.Provider
        value={{
          githubUser,
          repos,
          followers,
          requests,
          error,
          searchGithubUser,
          isLoading
        }}
      >
        {children}
      </GithubContext.Provider>
    );
}

export const useGlobalContext = () => {
    return useContext(GithubContext)
}

export {GithubProvider, GithubContext}