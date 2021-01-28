import React, { Component, useEffect, useState } from "react";




function getLeaveTime(){
    let x = localStorage.getItem("TimeLeave")
    console.log("x",x)
    if(x === null){

        x = Date.now()
        localStorage.setItem("TimeLeave", x)
    }
    
    return +x
}






const LeaveTimer = (props) => {
    console.log("LeaveTime")
    let startTime = getLeaveTime()
    const [currTime, setCurrTime] = useState(Date.now());
    //console.log(props.seconds)


    // add side effect to component
    useEffect(() => {
        // create interval
        const interval = setInterval(
            // set number every 5s
            () => setCurrTime((Date.now())),
            1000
        );

        // clean up interval on unmount
        return () => {
            clearInterval(interval);
        };
    }, []);

    let secs = parseInt((currTime - startTime)/1000%60)
    console.log("secs",secs)
    secs = secs<10? "0"+secs : secs
    let mins = parseInt((((currTime - startTime)/1000)/60)%60)
    mins = mins<10? "0"+mins : mins
    let hours = parseInt((((currTime - startTime)/1000)/60)/60)
    hours = hours<10? "0"+hours: hours

    
    
    return <p style={{color:"#8B8B8B"}}> {hours}:{mins}:{secs}</p>;
}

export default LeaveTimer;