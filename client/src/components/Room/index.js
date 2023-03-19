import React, { useState, useEffect } from "react";
import "./index.css";
import { Box, Grid, Container } from "@material-ui/core";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase/firebase";

import SideNav from "../CustomAppBar/sideNav";

import WelcomeMessage from "./WelcomeMessage";
import DisplayRoomates from "./DisplayRoomates";
import UpcomingEvents from "./UpcomingEvents";
import DisplayTopGroceryList from "./DisplayTopGroceryList";
import Wallet from "./Wallet";

const roommateCalendar = [
  {
    name: "Garbage Day",
    date: "February 15th, 2023",
    time: "10:00AM to 1:00PM",
  },
  {
    name: "Happy Birthday",
    date: "February 20th, 2023",
    time: "6:00PM to 9:00PM",
  },
  {
    name: "MSCI 342 Final Exam",
    date: "February 27th, 2023",
    time: "1:00PM to 2:00PM",
  },
];

const serverURL = "http://localhost:3000/"; //enable for dev mode
// const serverURL ="http://ec2-18-216-101-119.us-east-2.compute.amazonaws.com:3006";

const Room = () => {
  const [user, setUser] = useState({});
  const [roomateData, setRoomateData] = useState([]);
  const [roomTopGrocery, setRoomTopGrocery] = useState([]);

  onAuthStateChanged(auth, (currUser) => {
    setUser(currUser);
  });

  useEffect(() => {
    callApiGetRoomPageInfo().then((res) => {
      var parsed = JSON.parse(res.express);
      // console.log(parsed);
      setRoomateData(parsed);
    });

    callGetTopGrocery().then((res) => {
      var parsed = JSON.parse(res.express);
      // console.log(parsed);
      setRoomTopGrocery(parsed);
    });
  }, [user]);

  const callApiGetRoomPageInfo = async () => {
    const url = serverURL + "/api/getRoomPageInfo";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //authorization: `Bearer ${this.state.token}`
      },
      body: JSON.stringify({
        firebaseUID: user.uid,
      }),
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    // console.log("User settings: ", body);
    return body;
  };

  const callGetTopGrocery = async () => {
    const url = serverURL + "/api/getTopGrocery";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        //authorization: `Bearer ${this.state.token}`
      },
      body: JSON.stringify({
        firebaseUID: user.uid,
      }),
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    // console.log("User settings: ", body);
    return body;
  };

  return (
    <>
      <SideNav/>
      <Container class="container">
        <Box sx={{ flexGrow: 1, margin: "50px" }}>
          <Grid
            container
            justifyContent="space-between"
            alignItems="stretch"
            spacing={2}
            style={{ margin: "0px" }}
          >
            <Grid item xs={6} md={7}>
              <WelcomeMessage roomateData={roomateData} user={user} />
              <br />
              <UpcomingEvents roommateCalendar={roommateCalendar} />
            </Grid>

            <Grid item xs={6} md={5}>
              <DisplayRoomates roomateData={roomateData} user={user}/>
              <br />
              <Wallet roomateData={roomateData} user={user} />
              <br />
              <DisplayTopGroceryList roomTopGrocery={roomTopGrocery} />
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default Room;
