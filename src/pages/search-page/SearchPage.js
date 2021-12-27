import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import "./searchPage.scss"
import songApi from "../../api/songApi"
import VideoCard from '../../components/videoCard/VideoCard';
import MyInput from "../../components/my-input/MyInput"
import qs from "query-string"
import PageLoading from '../page-loading/PageLoading';
import BackgroundEffect from '../../components/background-effect/BackgroundEffect';

const SearchPage = () => {
    let [isSong, setIsSong] = useState(true)
    let [isSoundTrack, setIsSoundTrack] = useState(true)
    let [list, setList] = useState([])
    let [loader, setLoader] = useState(false)
    let [firstLoad, setFirstLoad] = useState(true)

    let search = new URLSearchParams(useLocation().search)
    let searchValue = search.get("key")  
    let history = useHistory()

    let goTo = () => {
        history.push({
            pathname: "/"
        })
    }
    let changeKind = (e) => {
        if (e.target.value === "0") {
            setIsSong(true)
            setIsSoundTrack(false)
        } else if (e.target.value === "1") {
            setIsSong(false)
            setIsSoundTrack(true)
        } else {
            setIsSong(true)
            setIsSoundTrack(true)
        }
    }
    useEffect(() => {
        setLoader(true)
        let fetchData = async () => {
            let data = {
                key: searchValue.toLowerCase(),
                isSong: isSong,
                isSoundTrack: isSoundTrack
            }
            await axios.post(process.env.REACT_APP_SERVER_URL + songApi.getSearchSong, data)
                .then(res => {
                    setList([...res.data.data])
                    setLoader(false)
                    setFirstLoad(false)
                }).catch(err => {
                    console.log(err.response)
                    setLoader(false)
                    setFirstLoad(false)
                })
        }
        fetchData()
    },[searchValue, isSong, isSoundTrack])
    useEffect(()=>{
        document.title = "Search | My Music"
        window.scrollTo({
            top : 0,
            behavior : "smooth"
        })
    },[])

    let changeSearchValue=(e)=>{
        let newSearchValue = e.target.value
        let data = {
            key : newSearchValue
        }
        history.push({
            search : "?" + qs.stringify(data)
        })
    }
    return (
        <div className="search-page">
            <div className="search-page__route">
                <svg onClick={goTo} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-house-door-fill home-icon" viewBox="0 0 16 16">
                    <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z" />
                </svg>
                <p> / Search</p>
            </div>
            <div className="search-page__search">
                <h2>Search:</h2>
                <MyInput placeHolder="Search" onChange={(e)=>changeSearchValue(e)} value={searchValue}/>
            </div>
            <select onChange={(e)=>changeKind(e)} name="cars" id="cars">
                <option value="2">Solo song or Soundtrack</option>
                <option value="0">Just Song</option>
                <option value="1">Just Soundtrack</option>
                <option value="2">Both</option>
            </select>
            <div className="search-page__main">
                {list.map((item, index) => {
                    return <VideoCard key={index} propsSongData={item} />
                })}
                {list.length === 0 && !loader ? <h1>No Result</h1> : null}
                {loader ? <div className="loader"></div> : null}
            </div>
            <PageLoading loader={firstLoad} />
            <BackgroundEffect/>
        </div>
    );
};

export default SearchPage;