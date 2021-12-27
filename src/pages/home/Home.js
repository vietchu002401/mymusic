import React, { useEffect, useState } from 'react';
import "./home.scss"

import ListVideoCard from '../../components/list-video-card/ListVideoCard';
import VideoCard from '../../components/videoCard/VideoCard';

import bg from "../../assets/backgroundImage/texture-old-faded-vintage-paper-beige-retro-background-grunge-paper-with-spots-streaks_213524-157.jpg"
import video from "../../assets/video/ep19.mp4"
import axios from 'axios';
import songApi from "../../api/songApi"
import newsApi from "../../api/newsApi"
import Loading from '../../components/loading/Loading';
import PageLoading from '../page-loading/PageLoading';
import NewsCard from '../../components/news-card/NewsCard';
import { useHistory } from 'react-router';
import BackgroundEffect from '../../components/background-effect/BackgroundEffect';
import { useSelector } from 'react-redux';

const Home = () => {

    let languageState = useSelector(state => state.languageReducer)

    let [allSong, setAllSong] = useState([])
    let [slice, setSlice] = useState(12)
    let [loader, setLoader] = useState(true)
    let [loaderMore, setLoaderMore] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0)
        document.title = "My Music"
    }, [])

    useEffect(() => {
        setLoader(true)
        let fetchData = async () => {
            await axios.get(process.env.REACT_APP_SERVER_URL + songApi.getAll + slice)
                .then(res => {
                    setAllSong([...res.data.data])
                    setLoader(false)
                }).catch(err => {
                    console.log(err)
                    setLoader(false)
                })
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])



    let loadMore = async () => {
        let newSlice = slice + 12
        setSlice(slice + 12)
        setLoaderMore(true)

        await axios.get(process.env.REACT_APP_SERVER_URL + songApi.getAll + newSlice)
            .then(res => {
                setAllSong([...res.data.data])
                setLoader(false)
                setLoaderMore(false)
            }).catch(err => {
                console.log(err)
                setLoader(false)
                setLoaderMore(false)
            })
    }
    return (
        <div className="home">
            <ListVideoCard languageState={languageState} title={languageState.mostView} percent={false} />
            <div data-aos="fade-out" style={{ backgroundImage: "url(" + bg + ")" }} className="title">
                <h1 style={{ textAlign: "center" }}>{languageState.newest}</h1>
            </div>
            <div className="main-home">
                {allSong.map((item, index) => {
                    return <VideoCard key={index} propsSongData={item} />
                })}
                {loaderMore ? <Loading /> : null}
                {!loader && allSong.length === 0 ? <h1>{languageState.noResult}</h1> : null}
            </div>
            <button style={{ display: allSong.length < slice ? "none" : "block" }} onClick={loadMore} className="my-button">{languageState.loadMore}</button>
            <ListVideoCard languageState={languageState} title={languageState.mostQuality} percent={true} />
            <MostLoved loader={loader} languageState={languageState}/>
            <News languageState={languageState}/>
            <PageLoading loader={loader} />
            <BackgroundEffect />
        </div>
    );
};

let News = (props) => {
    let { languageState } = props
    useEffect(() => {
        let video = document.getElementById("myVideo")
        video.play()
        return () => video.pause()
    }, [])

    let [list, setList] = useState([])

    useEffect(() => {
        let fetchData = async () => {
            await axios.get(process.env.REACT_APP_SERVER_URL + newsApi.getNews)
                .then(res => {
                    let list = res.data.data.reverse()
                    setList([...list])
                }).catch(err => {
                    console.log(err)
                })
        }
        fetchData()
    }, [])
    return (
        <div className="video-background">
            <video autoPlay muted loop id="myVideo">
                <source src={video} type="video/mp4" />
            </video>
            <div className="video-background__news">
                <h1>{languageState.introduce.title}</h1>
                <div>
                    <p>{languageState.introduce.content1}</p>
                    <p>{languageState.introduce.content2}</p>
                </div>
            </div>
            <div className="video-background__link">
                {list.map((item, index) => {
                    return <NewsCard item={item} key={index} />
                })}
            </div>
        </div>
    )
}

let MostLoved = (props) => {

    let [topLoved, setTopLoved] = useState([])
    let history = useHistory()
    useEffect(() => {
        let fetchData = async () => {
            await axios.get(process.env.REACT_APP_SERVER_URL + songApi.getTopLoved + "?slice=6")
                .then(res => {
                    setTopLoved([...res.data.data])
                }).catch(err => {
                    console.log(err)
                })
        }
        fetchData()
    }, [])

    let goTo = () => {
        history.push({
            pathname: "/top-loved"
        })
    }
    return (
        <div>
            <div data-aos="fade-out" style={{ backgroundImage: "url(" + bg + ")" }} className="title">
                <h1 style={{ textAlign: "center" }}>{props.languageState.mostLoved}</h1>
            </div>
            <div className="main-home">
                {topLoved.map((item, index) => {
                    return <VideoCard key={index} propsSongData={item} />
                })}
                {props.loader ? <Loading /> : null}
                {!props.loader && topLoved.length === 0 ? <h1>{props.languageState.noResult}</h1> : null}
            </div>
            <button onClick={goTo} className="my-button">{props.languageState.seeMore}</button>
        </div>
    )
}

export default Home;