import React, { useState, useEffect, Component } from "react";

// class Clock extends React.Component{
//     constructor(props){
//         super(props)
//         var today = new Date()
//         this.state = {
//             date: today.toLocaleString()
//         }


//     }

//     storeTime = () =>{
//         localStorage.setItem("Date", this.state.date)
//     }




//     componentDidUpdate(){
//         if(localStorage.getItem("Date") == null){
//             this.storeTime()
//         }



//     }
//     render(){


//         console.log(this.state.date)
//         return (


//             <h6>{localStorage.getItem("Date")}</h6>

//         )
//     }
// }




const Clock = (props) => {
    
    
    
    
    if (props.date) {
        return <h6 style={{color:"#8B8B8B"}}>{props.date}</h6>
    } else {
        return <h6 style={{color:"#8B8B8B"}}>N/A</h6>
    }
}

export default Clock;