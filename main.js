function init() {
  let track = document.getElementById("track").value;
  let sessionName = document.getElementById("race-type").value;
  let driverNumber = document.getElementById("driver").value;
  let year = document.getElementById("year").value;
  let sessionType = "Race";

  getSessionKey(track, sessionName, sessionType, year, driverNumber);
}

async function getSessionKey(
  track,
  sessionName,
  sessionType,
  year,
  driverNumber
) {
  try {
    let sessionResponse = await fetch(
      `https://api.openf1.org/v1/sessions?country_name=${track}&session_name=${sessionName}&session_type=${sessionType}&year=${year}`
    );

    if (!sessionResponse.ok) {
      throw new Error("Could not fetch session key");
    }

    let sessionInfo = await sessionResponse.json();
    let key = sessionInfo[0].session_key;

    getLapTimes(key, driverNumber);
  } catch (error) {
    console.error(error);
  }
}

async function getLapTimes(key, driverNumber) {
  try {
    let response = await fetch(
      `https://api.openf1.org/v1/laps?session_key=${key}&driver_number=${driverNumber}`
    );

    if (!response.ok) {
      throw new Error("Could not fetch resource;");
    }

    let data = await response.json();

    let op = document.querySelector(".output");
    empty(op);

    let orderList = document.createElement("ol");
    let listClassAttr = document.createAttribute("class");
    listClassAttr.value = "list";
    orderList.setAttributeNode(listClassAttr);
    op.appendChild(orderList);

    let averageSection = document.createElement("div");
    let avgClass = document.createAttribute("class");
    avgClass.value = "average";
    averageSection.setAttributeNode(avgClass);
    op.appendChild(averageSection);

    let totalRaceLapTime = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].lap_duration >= 60 && data[i].lap_duration < 120) {
        remainder = (data[i].lap_duration - 60).toFixed(3);
        display("1:" + remainder);
      } else if (data[i].lap_duration >= 120) {
        remainder = (data[i].lap_duration - 120).toFixed(3);
        display("2:" + remainder);
      } else {
        display(data[i].lap_duration);
      }
      totalRaceLapTime += data[i].lap_duration;
    }

    let averageLapTime = totalRaceLapTime / data.length;
    if (averageLapTime >= 60 && averageLapTime < 120) {
      displayAverage("Average Lap Time: 1." + (averageLapTime - 60).toFixed(3));
    } else if (averageLapTime >= 120) {
      displayAverage(
        "Average Lap Time: 2." + (averageLapTime - 120).toFixed(3)
      );
    } else {
      displayAverage("Average Lap Time: " + averageLapTime.toFixed(3));
    }
  } catch (error) {
    console.error(error);
  }
}

function display(text) {
  let list = document.querySelector(".list");

  let listElement = document.createElement("li");
  listElement.textContent = text;

  list.appendChild(listElement);
}

function displayAverage(text) {
  let average = document.querySelector(".average");

  average.textContent = text;

  average.appendChild(average);
}

function empty(element) {
  while (element.firstElementChild) {
    element.firstElementChild.remove();
  }
}
