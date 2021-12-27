import React, { useEffect, useState } from 'react';
import BackgroundEffect from '../../components/background-effect/BackgroundEffect';
import Mp3Card from '../../components/mp3-card/Mp3Card';
import "./mp3Page.scss"
import mp3Api from '../../api/mp3Api';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Mp3Page = () => {

    let history = useHistory()
    let [display, setDisplay] = useState("block")
    let [list, setList] = useState([])
    let [loading, setLoading] = useState(true)
    useEffect(() => {
        if (!loading) {
            setTimeout(() => {
                setDisplay("none")
            }, 3000)
        } else {
            setDisplay("flex")
        }
    }, [loading])

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        })
    }, [])

    useEffect(() => {
        setLoading(true)
        let fetchData = async () => {
            await axios.get(process.env.REACT_APP_SERVER_URL + mp3Api.getAllList)
                .then(res => {
                    setList(res.data.data)
                    setLoading(false)
                }).catch(err => {
                    console.log(err)
                    setLoading(false)
                })
        }
        fetchData()
    }, [])
    let goTo=()=>{
        history.push({
            pathname : "/"
        })
    }

    return (
        <div className='mp3-page'>
            <div className="news-page__route">
                <svg onClick={goTo} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-house-door-fill home-icon" viewBox="0 0 16 16">
                    <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z" />
                </svg>
                <p> / News</p>
            </div>
            <h1>List MP3</h1>
            <div className='mp3-page__main'>
                {list.map((item, index) => {
                    return <Mp3Card data={item} key={index} />
                })}
            </div>
            <BackgroundEffect />
            <div style={{ display: display }} className={!loading ? "mp3-loading" : "mp3-load"}>
                {loading ? <h1>LOADING</h1> : null}
            </div>
        </div>
    );
};

export default Mp3Page; <Mp3Card />