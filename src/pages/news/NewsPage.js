import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import "./newsPage.scss"
import newsApi from "../../api/newsApi"
import PageLoading from '../page-loading/PageLoading';
import NewsCard from '../../components/news-card/NewsCard';
import BackgroundEffect from '../../components/background-effect/BackgroundEffect';

const NewsPage = () => {
    let history = useHistory()
    let params = useParams()
    let [loader, setLoader] = useState(false)
    let [newsData, setNewsData] = useState({ body: [] })

    let [anotherNews, setAnotherNews] = useState([""])

    let goTo = () => {
        history.push({
            pathname: "/"
        })
    }
    useEffect(() => {
        setLoader(true)
        let fetchData = async () => {
            await axios.get(process.env.REACT_APP_SERVER_URL + newsApi.getById + params.id)
                .then(res => {
                    let response = [...res.data.data]
                    let data = {
                        header: response[0].header,
                        body: response[0].body.split("^"),
                        code: response[0].code
                    }
                    setNewsData({ ...data })
                    setAnotherNews(response.slice(1, response.length))
                    setLoader(false)
                }).catch(err => {
                    console.log(err)
                    setLoader(false)
                })
        }
        fetchData()
    }, [params.id])
    useEffect(() => {
        document.title = "NEWS | My Music"
        window.scrollTo({
            top: 0
        })
    }, [params.id])

    return (
        <div className="news-page">
            <div className="news-page__route">
                <svg onClick={goTo} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-house-door-fill home-icon" viewBox="0 0 16 16">
                    <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z" />
                </svg>
                <p> / News</p>
            </div>
            <div className="news-page__main">
                <h1>{newsData.header}</h1>
                {newsData.body.map((item, index) => {
                    return <p key={index}>{item}</p>
                })}
                {loader ? <div className="loader"></div> : null}
            </div>
            <iframe className="news-video" src={"https://www.youtube.com/embed/" + newsData.code} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            <div className="another-news">
                {anotherNews.map((item, index) => {
                    return <NewsCard item={item} key={index} />
                })}
            </div>
            <PageLoading loader={loader} />
            <BackgroundEffect/>
        </div>
    );
};

export default NewsPage;