import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}

// TODO: Define a class for the Weather object
class Weather {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  forecast: any[]; // You can define a more specific type if needed

  constructor(
    temperature: number,
    description: string,
    humidity: number,
    windSpeed: number,
    forecast: any[]
  ) {
    this.temperature = temperature;
    this.description = description;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.forecast = forecast;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor() {
    this.baseURL = 'https://api.openweathermap.org'; 
    this.apiKey = process.env.API_KEY || ''; 
    this.cityName = ''; 
  }

  setCityName(city: string): void {
    this.cityName = city;
  }
  // TODO: Create fetchLocationData method
   // private async fetchLocationData(query: string) {}
   private async fetchLocationData(city: string): Promise<Coordinates> {
    if (!this.cityName) {
      throw new Error('City name is not set');
    }
    const url = this.buildGeocodeQuery(city); 
  const response = await fetch(url);
   // const response = await fetch(`${this.baseURL}/geocode?q=${this.cityName}&key=${this.apiKey}`);
    const data = await response.json();
    return this.destructureLocationData(data);
  }

 
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  private destructureLocationData(locationData: any): Coordinates {
    const { lat: latitude, lon: longitude } = locationData[0]; // Adjust based on actual API response
    return { latitude, longitude };
  }

  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
   private buildGeocodeQuery(city: string): string {
    return `${this.baseURL}/geocode?q=${city}&key=${this.apiKey}`;
  }

  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${this.apiKey}`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  private async fetchAndDestructureLocationData(city: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(city);
    return locationData;
  }
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const response = await fetch(this.buildWeatherQuery(coordinates));
    return await response.json();
  }
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  private parseCurrentWeather(response: any): Weather {
    const { main, weather, wind } = response;
    const temperature = main.temp;
    const description = weather[0].description;
    const humidity = main.humidity;
    const windSpeed = wind.speed;
    return new Weather(temperature, description, humidity, windSpeed, []);
  }
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): any[] {
    // Implement based on the structure of the weatherData
    // Here we simply return a placeholder
    return weatherData.map((data) => ({
      temperature: data.main.temp,
      description: data.weather[0].description,
      date: data.dt_txt,
      isHotterThanCurrent: data.main.temp > currentWeather.temperature,
    }));
  }
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  async getWeatherForCity(city: string): Promise<Weather> {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastData = weatherData.list; // Adjust based on actual API response
    currentWeather.forecast = this.buildForecastArray(currentWeather, forecastData);
    return currentWeather;
  }
}

export default new WeatherService();
