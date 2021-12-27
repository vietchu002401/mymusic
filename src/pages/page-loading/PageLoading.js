import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import "./pageLoading.scss"

const PageLoading = (props) => {
    let languageState = useSelector(state => state.languageReducer)
    let [display, setDisplay] = useState("flex")
    useEffect(()=>{
        if(!props.loader){
            setTimeout(()=>{
                setDisplay("none")
            },3000)
        }else{
            setDisplay("flex")
        }
    },[props.loader])
    return (
        <div style={{display : display}} className={!props.loader ? "background-page" : "background-page-loading"}>
            {props.loader ? <h1>{languageState.loading}</h1> : null}
        </div>
    );
};

export default PageLoading;