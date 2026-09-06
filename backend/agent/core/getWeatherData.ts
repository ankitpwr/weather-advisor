import axios from "axios";
import type { AppStateType } from "../agent";

export async function getWeatherData(state: any) {
  try {
    const response = await axios.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${state.city}`,
    );
    const latitude = response.data.results[0].latitude;
    const longitude = response.data.results[0].longitude;

    const result = await axios.get(`https://api.open-meteo.com/v1/forecast`, {
      params: {
        latitude,
        longitude,
        timezone: "auto",
        current:
          "temperature_2m,apparent_temperature,precipitation,precipitation_probability,wind_speed_10m,wind_gusts_10m,uv_index",
        hourly:
          "temperature_2m,apparent_temperature,precipitation_probability,precipitation,wind_speed_10m,wind_gusts_10m,uv_index",
        daily: "precipitation_sum",
        forecast_days: 1,
      },
    });

    return { weatherData: result.data };
  } catch (error) {
    console.log("error occured in get weather data", error);
    return { finalResponse: "agent failed, Try again!" };
  }
}
