# Weather Forecast App

You can try the application here: https://weather-forecast-app-sand-eight.vercel.app/

## Getting started

1. Ensure you have Node.js version 22 installed.
2. Clone the repository.
3. Install the packages using `pnpm install`.
4. Copy the `.env.example` file to `.env` and update your API key(s) by following the instructions contained in the file.
5. Run `pnpm dev` and view the application at: http://localhost:3000/.
6. Enter a location of your choice in the index page form to see your weather forecast!

## Architecture Decisions

### Frontend

The frontend of this application is created using the Next.js meta framework. This is for two reasons: it was a requirement of the task and it is also the framework I am most familiar with. The project uses the latest Next.js version, and therefore is created using the app router. This is helpful for a simple demo application like this as it allows me to utilise server components for data fetching and the latest React suspense features for loading and error boundaries for error handling. Next.js provides solutions for both of these through framework patterns. This approach for data fetching is often simpler for straightforward use cases such as this application demands, but is arguably more complicated for larger, more complex applications created with teams. There is still much debate to be had around these patterns given that the innovations pioneered by the React and Vercel teams are still in active development.

Styling of the application is done using Tailwind CSS, my preferred approach for CSS.

### Backend

The project is fairly simple, so for brevity and time efficiency reasons the code is exposed via Next.js API routes. There are two API routes in this application, they are as described:

- `GET /api/weather?location={LOCATION}` - Get the current weather forecast for the location provided.
- `GET /api/forecast?location={LOCATION} `- Get the weather forecast for the location provided for the next few days. You may also optionally provide a days search parameter which allows you to customise the number of forecast days returned in your forecast. If you do not provide this parameter, it will default to the next 3 days.

The underlying code for getting this data is contained within the server folder. The functions here interact with the [Open Weather Map API](https://openweathermap.org/api). Everything is fairly simple, with there just being 4 functions, 3 of which are simply making API calls and parsing the returned data. The final function, `generateDailyForecastFromHourForecasts()`, is a little more complex, but is a pure function which gets the "overall" daily forecast for the given days based on the many 3-hourly interval forecasts we have been provided. You could easily extend this function and make it more algorithmic with how you determine this overall forecast. For now, for time reasons, I have done something very basic. The "algorithm" selects the 1pm forecast and uses that for the daily forecast. An example of a more complex algorithm would be to aggregate the temperatures across the day, weighting more heavily towards temperatures near the hottest parts of the day to be more representative. You may also want to take the predominant weather status as the overall day status, not just use the one at 1pm (i.e. it could rain all day other than at 1pm and it would not show rain for the entire day).

The data returned from the third-party API is structured and is described in their [documentation](https://openweathermap.org/api). To ensure it is consistent with the documentation and to also provide us with type safety, I have utilised [Zod](https://www.npmjs.com/package/zod) to parse the JSON data. I have also used these Zod schemas within my frontend to guarantee type safety across the network boundary.

### Testing

There is a simple unit test set up provided, showing some basic testing of the arguments to the `getWeatherForecast()` function. I could do some more testing using a similar approach for the other functions in the application, but it would be more of the same. For time reasons, I only did one function to demonstrate the pattern.

There is no end-to-end or integration testing implemented in this application. That would be possible, but probably overkill for a simple application like this.

An often overlooked, but still important aspect of testing, is the "testing" done by utilising TypeScript. By having a fully typed application, the shape and type of the inputs and outputs are statically known to the TypeScript compiler and therefore the amount of bugs that are possible when composing functionality is vastly diminished.
