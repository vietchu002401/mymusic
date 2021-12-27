import React, { useEffect, useState } from 'react';
import "./backToTop.scss"

const BackToTop = () => {
    let [show, setShow] = useState(false)

    useEffect(()=>{
        let scrollEvent = ()=>{
            if(window.scrollY > 0){
                setShow(true)
            }else{
                setShow(false)
            }
        }
        window.addEventListener("scroll",scrollEvent)
        return ()=> window.removeEventListener("scroll",scrollEvent)
    },[])

    let backToTop=()=>{
        window.scrollTo({
            top : 0,
            behavior : "smooth"
        })
    }
    return (
        <div onClick={backToTop} style={{opacity : show ? "1" : "0"}} className="back-to-top">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="30" fill="currentColor" className="bi bi-chevron-up" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z" />
            </svg>
            <p>TOP</p>
        </div>
    );
};

export default BackToTop;