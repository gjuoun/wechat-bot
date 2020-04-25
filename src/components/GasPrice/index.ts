import axios from "axios";
import moment from "moment";

// const gasBuddyUrlExample = "https://www.gasbuddy.com/assets-v2/api/stations/16905/fuels"
const gasBuddyAPIBaseUrl = "https://www.gasbuddy.com/assets-v2/api/stations/";

async function getFuelPrice(station_id: string = "16905"): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const response = await axios.get(
      `${gasBuddyAPIBaseUrl}/${station_id}/fuels`
    );

    let fuelMessage = "Halifax gas price: \n";

    try {
      if (response.data.fuels) {
        let postedTime = "";

        // postedTime = "5 hours ago"
        postedTime =
          moment(Date.now()).diff(
            response.data.fuels[0].prices[0].postedTime,
            "hours"
          ) + " hour(s) ago";
        for (let fuel of response.data.fuels) {
          let fuelType = fuel.fuelType;
          let price = fuel.prices[0].price;
          // pad space after fuelType
          fuelType = (fuelType + "     ").slice(0, 8);
          // pad spaces before price
          price = ("  " + price).slice(-4);
          fuelMessage += `${fuelType} - ${price}¢\n`;
        }
        fuelMessage += `Updated at ${postedTime}`;
      }
      // console.log(fuelMessage);
      resolve(fuelMessage);
    } catch (e) {
      console.error("Failed fetch station_id - ", station_id);
      reject("Failed on fetching gas price");
    }
  });
}

export default getFuelPrice;
