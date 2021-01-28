
import React, { Component} from "react";
import "./child.css"
import car from "../../img/car_grey.png"
import car_tran from "../../img/car_opacity.png"
import ArrivalTimer from "../Timer/ArrivalTimer"
import {
    Container,
    Row,
    Col,
} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Clock from "../Date/Clock"
import LeaveTimer from "../Timer/LeaveTimer"
import FadeIn from 'react-fade-in';

class RssiStorage {

    constructor() {
        this.key = "Date"
        let x = JSON.parse(localStorage.getItem(this.key))

        this.rssi = null
        this.date = null
        if (x) {
            this.rssi = x.rssi
            this.date = x.date
        }
    }

    update(rssi) {
        console.log("rssi", rssi)
        if (rssi >0) {
            if (this.date) {
                // do nothing
                return
            }
            // set new date 

            let date = new Date()
            this.rssi = rssi
            
            
            localStorage.setItem("Date", JSON.stringify({
                rssi: rssi,
                date: date.toLocaleString(),
            }))
            
            
            
        } else {
            // remove date
            console.log("else statement")
            this.date = null
            localStorage.removeItem("Date")
            localStorage.removeItem("TimePark")

            
        }
    }

    getLastValidRssi() {
        return {
            rssi: this.rssi,
            date: this.date
        }
    }
}



class Child extends Component {


    constructor(props) {
        super(props);
        this.rssi = new RssiStorage()
        this.state = this.rssi.getLastValidRssi()
        
    }

    receiveMessage = () => {
        const { websocket } = this.props
        console.log(websocket)
        try {
            websocket.onmessage = (message) => {
                let { rssi } = JSON.parse(message.data)
                //console.log(message.data)
                console.log("rssi", rssi)
                this.rssi = new RssiStorage()
                this.rssi.update(rssi)
                this.setState(this.rssi.getLastValidRssi())
            }
        } catch (error) {
            console.log(error)
        }
    }

     

    

    componentDidUpdate() {
        this.receiveMessage()
    }

    render() {
        
       
        return (
            <>
                
                <p class="h1 text-center pt-4" style={{fontFamily:"DIN Alternate"}}>YIP ON CAR PARK</p>
                <div class="wrapper">
                    <div class="divider div-transparent"></div>
                </div>
                

                
                <Container style={{fontFamily:"DIN Alternate"}}>
                
                    <div class="img-container">

                    
                        <Row>
                        
                            <Col sm={6} md={4} xs={12}>
                            <FadeIn  transitionDuration={1000}>
                                <h1 class="title">Car 1</h1>
                                <Row>
                                    <Col xs={4}>
                                        <h6><small>ARRIVAL TIME</small></h6>
                                        <h6 class="data"><Clock date={this.state.date}/></h6>
                                    </Col>

                                    <Col xs={4}>
                                        <h6><small>PARK TIME</small></h6>
                                        {/* <ArrivalTimer/> */}
                                        <h6 class="data">{this.state.date !== null?<ArrivalTimer />: <h6 class="data"> N/A</h6>}</h6>
                                    </Col>

                                    <Col xs={4}>
                                        <h6><small>LEAVE</small></h6>
                                        {/* <LeaveTimer/> */}
                                        <h6 class="data">{this.state.date === null? <LeaveTimer />: <h6 class="data">N/A</h6>}</h6>
                                    </Col>

                                    <Col xs={12}>
                                        {this.state.date !== null? <img src={car} class="img-responsive " fluid />:<img src={car_tran} class="img-responsive carOp" fluid /> }
                                        
                                    </Col>
                                </Row>
                            </FadeIn>
                            </Col>
                            
                            
                            
                            
                            <Col sm={6} md={4} xs={12}>
                            <FadeIn  transitionDuration={1500}>
                                <h1 class="title">Car 2</h1>
                                <Row>
                                <Col xs={4}>
                                        <h6><small>ARRIVAL TIME</small></h6>
                                        <h6 class="data">N/A</h6>
                                    </Col>

                                    <Col xs={4}>
                                        <h6><small>PARK TIME</small></h6>
                                        <h6 class="data">N/A</h6>
                                        {/* <h6 class="data">{this.state.date !== null?<ArrivalTimer />: <h6 class="data"> N/A</h6>}</h6> */}
                                    </Col>

                                    <Col xs={4}>
                                        <h6><small>LEAVE</small></h6>
                                        <h6 class="data">N/A</h6>
                                        {/* <h6 class="data">{this.state.date === null? <LeaveTimer />: <h6 class="data">N/A</h6>}</h6> */}
                                    </Col>
                                    <Col xs={12}>
                                        <img src={car_tran} class="img-responsive carOp" fluid /> 
                                        
                                    </Col>
                                </Row>
                                </FadeIn>
                            </Col>
                            


                            
                            <Col sm={6} md={4} xs={12}>
                                <FadeIn  transitionDuration={2000}>
                                <h1 class="title">Car 3</h1>
                                <Row>
                                <Col xs={4}>
                                        <h6><small>ARRIVAL TIME</small></h6>
                                        <h6 class="data">N/A</h6>
                                    </Col>

                                    <Col xs={4}>
                                        <h6><small>PARK TIME</small></h6>
                                        <h6 class="data">N/A</h6>
                                        {/* <h6 class="data">{this.state.date !== null?<ArrivalTimer />: <h6 class="data"> N/A</h6>}</h6> */}
                                    </Col>

                                    <Col xs={4}>
                                        <h6><small>LEAVE</small></h6>
                                        <h6 class="data">N/A</h6>
                                        {/* <h6 class="data">{this.state.date === null? <LeaveTimer />: <h6 class="data">N/A</h6>}</h6> */}
                                    </Col>

                                    <Col xs={12}>
                                    <img src={car_tran} class="img-responsive carOp" fluid /> 
                                    </Col>
                                </Row>
                                </FadeIn>
                            </Col>
                            
                            
                            
                        </Row>
                        
                    </div>
                    
                </Container>
                

            </>


        );
    }
}

export default Child;