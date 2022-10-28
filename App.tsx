// import * as React from 'react';
// import './style.css';

// let post = [
//   {
//     message: 'mes',
//     author: 'me',
//     likes: 1,
//   },
//   {
//     message: 'mes2',
//     author: 'me2',
//     likes: 12,
//   },
// ];

// export default function App() {
//   return (
//     <div>
//       <h1>Hello StackBlitz!</h1>
//       <p>Start editing to see some magic happen :)</p>
//       {post.map((post) => (
//         <Post data={post}></Post>
//         /** ^ this is how you display posts
//          * dynamically
//          */
//       ))}
//       {/* <Post data={post}></Post> */}
//       {/* <Post author="me again" likes="21" message='meep'></Post>
//       <Post author="someone else" likes="21" message='meep2'></Post> */}
//     </div>
//   );
// }
// function Post(props) {
//   return (
//     <div style={{ border: '1px black solid' }}>
//       <div>
//         body: {props.data.message} - from: {props.data.author}
//       </div>
//       <div>likes: {props.data.likes}</div>
//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';

import MonthPicker from './MonthPicker';
import './App.css';
import useAsyncFetch from './useAsyncFetch';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function ResDisplay(props) {
  console.log('in ResDisplay');
  // static var will contain the list of resevoirs
  const [reservoirs, setResevoirs] = useState([]);
  let d = props.date;
  // console.log('d:',d);
  // call the custom fetch hook, passing it the callback functions that it can use
  useAsyncFetch('query/getList', d, thenFun, catchFun);

  function thenFun(result) {
    console.log('thenfunres', result);
    setResevoirs(result);
    // render the list once we have it
  }

  function catchFun(error) {
    console.log(error);
  }
  if (reservoirs) {
    return (
      <div className="chart">
        <DisplayChart data={reservoirs} />
      </div>
    );
  } else {
    return <div className="chart"></div>;
  }
}

function DisplayChart(props) {
  // props.data = reservoirs i.e. the full json pile
  let jsonReservoirs = props.data;
  // console.log('jsonReservoirs prop:',props.data);
  let len = jsonReservoirs.length;
  const nicknames = new Map();
  // for(let i=0; i<len; i++) {
  //   console.log('stationid:',jsonReservoirs[i]['stationId']);
  //   nicknames.set(i,jsonReservoirs[i]['stationId']);
  // }
  nicknames.set(0, 'Shasta'); //SHA
  nicknames.set(1, 'Oroville'); //ORO
  nicknames.set(2, 'Trinity Lake'); //CLE
  nicknames.set(3, 'New Melones'); //NML
  nicknames.set(4, 'San Luis'); //LUS
  nicknames.set(5, 'Don Pedro'); //DNP
  nicknames.set(6, 'Berryessa'); //BER
  console.log('json reservoirs:', jsonReservoirs);
  // console.log(jsonReservoirs[0].value);
  //extract month value
  let resMonthVals = [];
  for (let y = 0; y < len; y++) {
    // console.log('reservoir vals:');
    resMonthVals.push(jsonReservoirs[y].value);
  }
  console.log('rsmonthval:', resMonthVals);
  // following the order in the mockup
  let totalCapacities = {
    label: 'total capacity',
    data: [4552000, 3537577, 2447650, 2400000, 1062000, 2030000, 1602000],
    backgroundColor: ['rgb(120,199,227)'],
  };

  let monthlydata = {
    label: 'monthly capacity',
    data: resMonthVals,
    backgroundColor: ['rgb(66,145,152)'],
  };

  let labels = [];
  for (let n = 0; n < len; n++) {
    labels.push(nicknames.get(n));
  }

  // let stickerObj = {label: "Sticker Price",data: [], backgroundColor: ["pink"]}
  //   let midIncObj = {label: "Middle Income Family Price", data: [], backgroundColor: ["red"]}
  //   let labels = [];
  //   for (let i=0; i<n; i++) {
  //     stickerObj.data.push(props.schools[i].sticker);
  //     midIncObj.data.push(props.schools[i].midIncome);
  //     labels.push(nicknames.get(i));
  //   }

  let reseData = {};
  reseData.labels = labels;
  reseData.datasets = [monthlydata, totalCapacities];
  // let userData = {};
  // userData.labels = labels;
  // userData.datasets = [stickerObj, midIncObj];
  let options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };
  return (
    <div id="chart-container">
      <Bar options={options} data={reseData} />
    </div>
  );
}

function Hide() {
  // let buttonstate = props.state
  const [date, setDate] = useState({ month: 4, year: 2022 });
  const [showResults, setShowResults] = useState(false);
  let buttonText = showResults ? 'See less' : 'See more';
  const toggle = () => {
    console.log(showResults);
    setShowResults(!showResults);
  };

  function yearChange(newYear) {
    let m = date.month;
    setDate({ year: newYear, month: m });
  }

  function monthChange(newMonth) {
    let y = date.year;
    setDate({ month: newMonth, year: y });
  }

  return (
    <div>
      <button type="button" id="show-hide" onClick={toggle}>
        {buttonText}
      </button>
      {showResults ? (
        <div className="allcharts">
          <ResDisplay date={date} />
          <div className="pickdate">
            <p id="calendartext">
              Here's a quick look at some of the data on reservoirs from the{' '}
              <a href="https://cdec.water.ca.gov/index.html">
                California Data Exchange Center
              </a>
              , which consolidates climate and water data from multiple federal
              and state government agencies, and electric utilities. Select a
              month and year to see storage levels in the eleven largest
              in-state reservoirs.
            </p>
            <div id="changeMon">Change month:</div>
            <MonthPicker
              // props
              date={date}
              yearFun={yearChange}
              monthFun={monthChange}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

const Header = () => <h1 id="hr">Water storage in California reservoirs</h1>;

function App() {
  return (
    <div>
      <Header />
      <main>
        <div className="paragraphs">
          <p>
            California's reservoirs are part of a{' '}
            <a href="https://www.ppic.org/wp-content/uploads/californias-water-storing-water-november-2018.pdf">
              complex water storage system
            </a>
            . The State has very variable weather, both seasonally and from
            year-to-year, so storage and water management is essential. Natural
            features - the Sierra snowpack and vast underground aquifers -
            provide more storage capacity, but reservoirs are the part of the
            system that people control on a day-to-day basis. Managing the flow
            of surface water through rivers and aqueducts, mostly from North to
            South, reduces flooding and attempts to provide a steady flow of
            water to cities and farms, and to maintain natural riparian
            habitats. Ideally, it also transfers some water from the seasonal
            snowpack into long-term underground storage. Finally, hydro-power
            from the many dams provides carbon-free electricity.
          </p>
          <p>
            California's water managers monitor the reservoirs carefully, and
            the state publishes daily data on reservoir storage.
          </p>
        </div>

        <figure>
          <img
            src="https://cdn.theatlantic.com/thumbor/HYdYHLTb9lHl5ds-IB0URvpSut0=/900x583/media/img/photo/2014/09/dramatic-photos-of-californias-historic-drought/c01_53834006/original.jpg
"
          />
          <figcaption className="captions">
            Lake Oroville in the 2012-2014 drought. Image credit Justin
            Sullivan, from The Atlantic article Dramatic Photos of California's
            Historic Drought.
          </figcaption>
        </figure>
      </main>
      <Hide />
    </div>
  );
}

export default App;
