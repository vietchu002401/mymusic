import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Switch, useHistory, Route, Link } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import songApi from "../../api/songApi"
import newsApi from '../../api/newsApi';
import trendApi from "../../api/trendApi"
import DeleteSongModal from '../../components/modal/DeleteSongModal';
import UpdateSongModal from '../../components/modal/UpdateSongModal';
import MyInput from '../../components/my-input/MyInput';

import "./adminManage.scss"
import UpdateNewsModal from '../../components/modal/UpdateNewsModal';
import adminApi from '../../api/adminApi';
import AddNewsModal from '../../components/modal/AddNewsModal';


const AdminManage = () => {

    let adminState = useSelector(state => state.adminReducer)
    let history = useHistory()
    useEffect(() => {
        if (!adminState.isAdmin || adminState.code !== process.env.REACT_APP_CODE) {
            history.push({
                pathname: "/admin"
            })
        }
    }, [adminState, history])
    return (
        <div className="admin-page">
            <header className="admin-page__header">
                <ul>
                    <NavLink activeClassName="selected" to="/admin/manage/all-songs"><li>All Songs</li></NavLink>
                    <NavLink activeClassName="selected" to="/admin/manage/add-song"><li>Add Song</li></NavLink>
                    <NavLink activeClassName="selected" to="/admin/manage/all-recommend"><li>All Recommend</li></NavLink>
                    <NavLink activeClassName="selected" to="/admin/manage/all-news"><li>All NEWS</li></NavLink>
                    <NavLink activeClassName="selected" to="/admin/manage/all-trend"><li>All Trend</li></NavLink>
                </ul>
            </header>
            <Link to="/"><button className="my-button">Go to Home Page</button></Link>
            <Switch>
                <Route exact path="/admin/manage/all-songs" component={AllSongs} />
                <Route exact path="/admin/manage/add-song" component={AddSong} />
                <Route exact path="/admin/manage/all-recommend" component={AllRecommend} />
                <Route exact path="/admin/manage/all-news" component={AllNews} />
                <Route exact path="/admin/manage/all-trend" component={AllTrend} />
            </Switch>
        </div>
    );
};

let AllSongs = () => {

    let [allSongs, setAllSongs] = useState([])
    let [again, setAgain] = useState(false)
    let [searchValue, setSearchValue] = useState("")
    let adminState = useSelector(state => state.adminReducer)

    useEffect(() => {
        let fetchData = async () => {
            let data = {
                key: searchValue.toLowerCase(),
                isSong: true,
                isSoundTrack: true,
                code: adminState.code
            }
            await axios.post(process.env.REACT_APP_SERVER_URL + adminApi.adminSearchSong, data)
                .then(res => {
                    setAllSongs([...res.data.data])
                }).catch(err => {
                    console.log(err)
                })
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [again, searchValue])

    let fetchAgain = () => {
        setAgain(!again)
    }

    let changeSearchValue = (e) => {
        setSearchValue(e.target.value)
    }

    return (
        <div>
            <h1>Total: {allSongs.length} songs</h1>
            <MyInput placeHolder="Search" value={searchValue} onChange={changeSearchValue} />
            <table className="admin-page__table">
                <tbody>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Singer</th>
                        <th>Composer</th>
                        <th>Code</th>
                        <th>Lyric</th>
                        <th>Sound Track</th>
                        <th>Song</th>
                        <th>Movie</th>
                        <th style={{ width: "200px" }}>Edit</th>
                    </tr>
                    {allSongs.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td><img src={item.image} alt=""></img></td>
                                <td>{item.name}</td>
                                <td>{item.singer}</td>
                                <td>{item.composer}</td>
                                <td>{item.code}</td>
                                <td>{item.lyric}</td>
                                <td>{item.isSoundTrack ? "TRUE" : "FALSE"}</td>
                                <td>{item.isSong ? "TRUE" : "FALSE"}</td>
                                <td>{item.movie}</td>
                                <td>
                                    <UpdateSongModal fetchAgain={fetchAgain} songInfo={item} />
                                    <DeleteSongModal api={songApi} id={item.id} fetchAgain={fetchAgain} />
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

let AddSong = () => {

    let [name, setName] = useState("")
    let [singer, setSinger] = useState("")
    let [composer, setComposer] = useState("")
    let [code, setCode] = useState("")
    let [lyric, setLyric] = useState("")
    let [isSoundTrack, setIsSoundTrack] = useState(false)
    let [isSong, setIsSong] = useState(true)
    let [movie, setMovie] = useState("")
    let adminState = useSelector(state => state.adminReducer)

    let changeName = (e) => {
        setName(e.target.value)
    }
    let changeSinger = (e) => {
        setSinger(e.target.value)
    }
    let changeComposer = (e) => {
        setComposer(e.target.value)
    }
    let changeCode = (e) => {
        setCode(e.target.value)
    }
    let changeLyric = (e) => {
        setLyric(e.target.value)
    }
    let changeMovie = (e) => {
        setMovie(e.target.value)
    }
    let changeIsSoundTrack = (e) => {
        if (e.target.value === "1") {
            setIsSoundTrack(true)
        } else {
            setIsSoundTrack(false)
        }
        console.log(e.target.value)
    }
    let changeIsSong = (e) => {
        if (e.target.value === "1") {
            setIsSong(true)
        } else {
            setIsSong(false)
        }
    }
    let getImage = async (code) => {
        return await axios.get(process.env.REACT_APP_API_URL + "&part=snippet,statistics&id=" + code)
    }


    let handleAddSong = async (e) => {
        e.preventDefault()
        getImage(code).then(res => {
            let data = {
                name: name,
                singer: singer,
                composer: composer,
                code: code,
                lyric: lyric,
                isSoundTrack: isSoundTrack,
                isSong: isSong,
                movie: movie,
                image: res.data.items[0].snippet.thumbnails.maxres ? res.data.items[0].snippet.thumbnails.maxres.url : res.data.items[0].snippet.thumbnails.high.url,
                authCode: adminState.code
            }
            axios.post(process.env.REACT_APP_SERVER_URL + songApi.addSong, data)
                .catch(err => {
                    console.log(err)
                })
            setName("")
            setCode("")
            setComposer("")
            setLyric("")
            setSinger("")
            setMovie("")
        }).catch(err => {
            console.log(err)
        })
    }
    return (
        <form style={{ paddingBottom: "100px" }} onSubmit={handleAddSong}>
            <div className="admin-page__add-song">
                <MyInput onChange={changeName} value={name} placeHolder="Name" />
                <MyInput onChange={changeSinger} value={singer} placeHolder="Singer" />
                <MyInput onChange={changeComposer} value={composer} placeHolder="Composer" />
                <MyInput onChange={changeCode} value={code} placeHolder="Youtube Code" />
                <MyInput onChange={changeLyric} value={lyric} placeHolder="Lyric" />
                <select onChange={changeIsSoundTrack} name="soundtrack">
                    <option value="">is Sound Track?</option>
                    <option value="1">TRUE</option>
                    <option value="0">FALSE</option>
                </select>
                <select onChange={changeIsSong} name="song">
                    <option value="">is Song?</option>
                    <option value="1">TRUE</option>
                    <option value="0">FALSE</option>
                </select>

                <MyInput onChange={changeMovie} value={movie} placeHolder="Movie" />

                <button className="my-button">Submit</button>
            </div>
        </form>
    )
}

let AllRecommend = () => {

    let [allRecommend, setAllRecommend] = useState([])
    let [again, setAgain] = useState(false)
    let adminState = useSelector(state => state.adminReducer)

    useEffect(() => {
        let fetchData = async () => {
            let data = {
                code: adminState.code
            }
            await axios.post(process.env.REACT_APP_SERVER_URL + songApi.getAllRecommend, data)
                .then(res => {
                    setAllRecommend([...res.data.data])
                }).catch(err => {
                    console.log(err)
                })
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [again])

    let fetchAgain = () => {
        setAgain(!again)
    }

    let deleteRecommend = async (id) => {
        await axios.delete(process.env.REACT_APP_SERVER_URL + songApi.deleteRecommend + id)
            .then(res => {
                console.log(res.data.message)
                fetchAgain()
            }).catch(err => {
                console.log(err)
            })
    }
    return (
        <div>
            <h1>Total: {allRecommend.length} recommends</h1>
            <table className="admin-page__table">
                <tbody>
                    <tr>
                        <th>Id</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Song name</th>
                        <th>Singer</th>
                        <th>Composer</th>
                        <th>Movie</th>
                        <th>Info</th>
                        <th>Soundtrack or Song</th>
                        <th style={{ width: "200px" }}>Edit</th>
                    </tr>
                    {allRecommend.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.user}</td>
                                <td>{item.email}</td>
                                <td>{item.songName}</td>
                                <td>{item.singer}</td>
                                <td>{item.composer}</td>
                                <td>{item.movie}</td>
                                <td>{item.info}</td>
                                <td>{item.kind}</td>
                                <td>
                                    <p onClick={() => deleteRecommend(item.id)} style={{ backgroundColor: "red" }}>Delete</p>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

let AllNews = () => {

    let [allNews, setAllNews] = useState([])
    let [again, setAgain] = useState(false)
    let adminState = useSelector(state => state.adminReducer)

    useEffect(() => {
        let fetchData = async () => {
            let data = {
                code: adminState.code
            }
            await axios.post(process.env.REACT_APP_SERVER_URL + newsApi.getAllNews, data)
                .then(res => {
                    setAllNews([...res.data.data])
                }).catch(err => {
                    console.log(err)
                })
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [again])

    let fetchAgain = () => {
        setAgain(!again)
    }

    return (
        <div>
            <h1>Total: {allNews.length} NEWS</h1>
            <AddNewsModal />
            <table className="admin-page__table">
                <tbody>
                    <tr>
                        <th>Id</th>
                        <th>Header</th>
                        <th>Body</th>
                        <th>Image</th>
                        <th>Youtube code</th>
                        <th style={{ width: "200px" }}>Edit</th>
                    </tr>
                    {allNews.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.header}</td>
                                <td>{item.body}</td>
                                <td>{item.image}</td>
                                <td>{item.code}</td>
                                <td>
                                    <UpdateNewsModal fetchAgain={fetchAgain} newsData={item} />
                                    <DeleteSongModal api={newsApi} id={item.id} fetchAgain={fetchAgain} />
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

let AllTrend = () => {

    let adminState = useSelector(state => state.adminReducer)

    let [songCount, setSongCount] = useState(0)
    let [soundTrackCount, setSoundTrackCount] = useState(0)

    useEffect(() => {
        let fetchData = async () => {
            await axios.get(process.env.REACT_APP_SERVER_URL + trendApi.getAllTrend + adminState.code)
                .then(res => {
                    res.data.data.forEach(item => {
                        if (item.isSong) {
                            setSongCount(item.accessCount)
                            return
                        }
                        setSoundTrackCount(item.accessCount)
                    })
                }).catch(err => {
                    console.log(err)
                })
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    let total = songCount + soundTrackCount
    return (
        <div className='all-trend'>
            <h3>{total} lượt truy cập</h3>
            <h3>Loại truy cập</h3>
            <ul className='percent-chart'>
                <li>100%</li>
                <li>90%</li>
                <li>80%</li>
                <li>70%</li>
                <li>60%</li>
                <li>50%</li>
                <li>40%</li>
                <li>30%</li>
                <li>20%</li>
                <li>10%</li>
                <li>0%</li>
            </ul>
            <ul className='kind-chart'>
                <li>Bài hát</li>
                <li>Nhạc phim</li>
            </ul>
            <div style={{ height: songCount / total * 100 + "%" }} className='chart'>

            </div>
            <div style={{ height: soundTrackCount / total * 100 + "%" }} className='chart'>

            </div>
        </div>
    )
}
export default AdminManage;