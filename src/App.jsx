import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [bgColor, setBgColor] = useState(
    localStorage.getItem("bgColor") || "#ffffff"
  );
  const [textColor, setTextColor] = useState(
    localStorage.getItem("textColor") || "#000000"
  );
  const [favoriteCity, setFavoriteCity] = useState(
    localStorage.getItem("favoriteCity") || ""
  );

  const handleSaveSettings = () => {
    localStorage.setItem("bgColor", bgColor);
    localStorage.setItem("textColor", textColor);
    localStorage.setItem("favoriteCity", favoriteCity);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  const shouldShowSunImage = (sunrise, sunset) => {
    const now = Date.now() / 1000;
    return now > sunrise && now < sunset;
  };

  const {
    data: weather,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["weather", city, country],
    queryFn: async () => {
      const apiKey = "887e681356b5d99974e41d477e3bad0f";
      const query = country ? `${city},${country}` : city;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=metric`
      );
      if (!response.ok) {
        throw new Error("Місто не знайдено");
      }
      return response.json();
    },
    enabled: false,
  });

  const handleSearch = () => {
    if (city) {
      refetch();
    }
  };

  return (
    <div className="App" style={{ backgroundColor: bgColor, color: textColor }}>
      <div>
        <h2>Налаштування</h2>
        <label>
          Колір фону:
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
        </label>
        <label>
          Колір тексту:
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          />
        </label>
        <label>
          Улюблене місто:
          <input
            type="text"
            value={favoriteCity}
            onChange={(e) => setFavoriteCity(e.target.value)}
            placeholder="Введіть улюблене місто."
          />
        </label>
        <button onClick={handleSaveSettings}>Зберегти налаштування</button>
      </div>
      <h1>Погода</h1>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Введіть місто"
      />
      <input
        className="inputCountry"
        type="text"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        placeholder="Введіть країну (не обов’язково)"
      />
      <button onClick={handleSearch}>Отримати погоду</button>

      {isLoading && <p>Завантаження...</p>}
      {error && <p style={{ color: "red" }}>Помилка: {error.message}</p>}
      {weather && (
        <div>
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <p>Температура: {weather.main.temp}°C</p>
          <p>Погода: {weather.weather[0].description}</p>
          <p>Час сходу сонця: {formatTime(weather.sys.sunrise)}</p>
          <p>Час заходу сонця: {formatTime(weather.sys.sunset)}</p>
          {shouldShowSunImage(weather.sys.sunrise, weather.sys.sunset) ? (
            <img
              src="https://cdn.pixabay.com/photo/2018/01/26/13/04/sun-3108640_960_720.png"
              alt="Sun"
            />
          ) : (
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/b/b3/Full_moon.jpeg"
              alt="Moon"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function WrappedApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}
