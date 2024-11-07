import fs from 'fs/promises'; // Use promises API for file operations
import path from 'path';
import.meta.url;
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);

// Get the directory name of the current module (equivalent to __dirname)
const __dirname = path.dirname(__filename);

// Now you can use __dirname to construct file paths
const filePath = path.join(__dirname, 'searchHistory.json');
console.log(filePath);
// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

interface CityData {
  name: string;
  id: string;
}
// TODO: Complete the HistoryService class

class HistoryService {
  private filePath: string;
  constructor() {
    console.log("hoooooooooolaaaa " + __dirname);
    this.filePath = path.join(__dirname, 'searchHistory.json'); // Path to the JSON file
  }

  // TODO: Define a read method that reads from the searchHistory.json file
  async read() {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading file:', error);
      return [];
    }
  }

  // private async read() {}
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
    } catch (error) {
      console.error('Error writing file:', error);
    }
  }
  // private async write(cities: City[]) {}
  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  
  async getCities(): Promise<City[]> {
    const data = await this.read();
    return data.map((cityData: CityData) => new City(cityData.name, cityData.id));
  }
  // async getCities() {}
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string): Promise<void> {
    const cities = await this.getCities();
    const newCity = new City(cityName, Date.now().toString()); // Using timestamp as a unique id
    cities.push(newCity);
    await this.write(cities);
  }
  // async addCity(city: string) {}
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<boolean> {
    const cities = await this.getCities();
    const updatedCities = cities.filter(city => city.id !== id);
    if (updatedCities.length === cities.length) {
      // If the length of updatedCities is the same, no city was removed
      return false;
    }
    await this.write(updatedCities);
    return true;
  }
  // async removeCity(id: string) {}
}

export default new HistoryService();
