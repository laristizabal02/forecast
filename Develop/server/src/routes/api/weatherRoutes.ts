import { Router, type Request, type Response } from 'express';
import HistoryService from '../../service/historyService.js'; // Service for managing search history
import WeatherService from '../../service/weatherService.js'; // Service for fetching weather data

const router = Router();

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ message: 'City name is required' });
  }

  try {
    // TODO: Get weather data from WeatherService
    const weatherData = await WeatherService.getWeatherForCity(city);

    // TODO: Save city to search history using HistoryService
    await HistoryService.addCity(city);

    // Respond with the weather data and the updated search history
    const searchHistory = await HistoryService.getCities();

    return res.status(200).json({
      weatherData,
      searchHistory
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ message: 'An error occurred while processing your request' });
  }
});

// GET search history
router.get('/history', async (_, res: Response) => {
  try {
    // Retrieve search history using HistoryService
    const searchHistory = await HistoryService.getCities();
    return res.status(200).json(searchHistory);
  } catch (error) {
    console.error('Error fetching search history:', error);
    return res.status(500).json({ message: 'Error fetching search history' });
  }
});

// BONUS: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Delete city from search history using HistoryService
    const success = await HistoryService.removeCity(id);

    if (!success) {
      return res.status(404).json({ message: 'City not found in search history' });
    }

    // Return the updated search history
    const searchHistory = await HistoryService.getCities();
    return res.status(200).json({ message: 'City removed from history', searchHistory });
  } catch (error) {
    console.error('Error deleting city from history:', error);
    return res.status(500).json({ message: 'Error deleting city from history' });
  }
});

export default router;