import './App.css';
import Child from "./child";
import React, {Component} from "react";

class client extends Component {

  

  constructor(props){
    super(props);
    this.state = {
      ws: null
    };
  }



  connect = () =>{
    const ws = new WebSocket("ws://localhost:3000/");
    
    
    
    console.log("ws",ws)
    
    ws.onopen = () =>{
      
      console.log("connected websocket main component");
      //localStorage.clear()
      this.setState({ws:ws});
      
    }

    ws.onclose = e =>{
      console.log("Socket is closed and reconnect");
      //localStorage.clear()
      setTimeout(() => {
        this.check();
      }, 5000);
    }

    ws.onerror = err =>{
      console.error("Socket error and closing");
      ws.close();
    }

    
    

    
  }

  componentDidMount(){
    console.log("Client.js")
    this.connect();
  }

  check = () =>{
    const {ws} = this.state
    console.log("check")
    if(!ws || ws.readyState === WebSocket.CLOSED){
      this.connect();
    }
  }


  render(){
    return(
      <Child websocket = {this.state.ws}/>
    );

    
  }
}


export default client;
