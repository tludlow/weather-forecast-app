import { describe, expect, test } from 'vitest';
import { getWeatherForecast } from '~/server/open-weather-map-api';

describe('Open weather map API - getWeatherForecast()', async () => {
  test('the "lat" input argument should range between -90 and 90 inclusive', async () => {
    // Sanity check of a correct input
    expect(() =>
      getWeatherForecast({
        lat: 0,
        lon: 0,
        days: 1,
      })
    ).not.toThrowError();

    // Obviously bad values
    await expect(
      getWeatherForecast({
        lat: 200,
        lon: 0,
        days: 1,
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Invalid "lat" value, lat must be between -90 and 90 inclusive]`
    );

    await expect(
      getWeatherForecast({
        lat: -200,
        lon: 0,
        days: 1,
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Invalid "lat" value, lat must be between -90 and 90 inclusive]`
    );

    // Edge values
    expect(() =>
      getWeatherForecast({
        lat: 90,
        lon: 0,
        days: 1,
      })
    ).not.toThrowError();

    expect(() =>
      getWeatherForecast({
        lat: -90,
        lon: 0,
        days: 1,
      })
    ).not.toThrowError();

    // +1 values
    await expect(
      getWeatherForecast({
        lat: 90.1,
        lon: 0,
        days: 1,
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Invalid "lat" value, lat must be between -90 and 90 inclusive]`
    );

    await expect(
      getWeatherForecast({
        lat: -90.1,
        lon: 0,
        days: 1,
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Invalid "lat" value, lat must be between -90 and 90 inclusive]`
    );
  });

  test('the "lon" input argument should range between -180 and 180 inclusive', async () => {
    // Sanity check of a correct input
    expect(() =>
      getWeatherForecast({
        lat: 0,
        lon: 0,
        days: 1,
      })
    ).not.toThrowError();

    // Obviously bad values
    await expect(
      getWeatherForecast({
        lat: 0,
        lon: 200,
        days: 1,
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Invalid "lon" value, lon must be between -180 and 180 inclusive]`
    );

    await expect(
      getWeatherForecast({
        lat: 0,
        lon: -200,
        days: 1,
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Invalid "lon" value, lon must be between -180 and 180 inclusive]`
    );

    // Edge values
    expect(() =>
      getWeatherForecast({
        lat: 0,
        lon: 180,
        days: 1,
      })
    ).not.toThrowError();

    expect(() =>
      getWeatherForecast({
        lat: 0,
        lon: -180,
        days: 1,
      })
    ).not.toThrowError();

    // +1 values
    await expect(
      getWeatherForecast({
        lat: 0,
        lon: 180.1,
        days: 1,
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Invalid "lon" value, lon must be between -180 and 180 inclusive]`
    );

    await expect(
      getWeatherForecast({
        lat: 0,
        lon: -180.1,
        days: 1,
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Invalid "lon" value, lon must be between -180 and 180 inclusive]`
    );
  });

  test('the "days" input argument should range between 1 and 10 inclusive', async () => {
    // Sanity check of a correct input
    expect(() =>
      getWeatherForecast({
        lat: 0,
        lon: 0,
        days: 3,
      })
    ).not.toThrowError();

    // Obviously bad values
    await expect(
      getWeatherForecast({
        lat: 0,
        lon: 0,
        days: -100,
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Invalid "days" value, days must be between 1 and 10 inclusive]`
    );

    await expect(
      getWeatherForecast({
        lat: 0,
        lon: 0,
        days: 225,
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Invalid "days" value, days must be between 1 and 10 inclusive]`
    );

    // Edge values
    expect(() =>
      getWeatherForecast({
        lat: 0,
        lon: 0,
        days: 1,
      })
    ).not.toThrowError();

    expect(() =>
      getWeatherForecast({
        lat: 0,
        lon: 0,
        days: 10,
      })
    ).not.toThrowError();

    // +1 values
    await expect(
      getWeatherForecast({
        lat: 0,
        lon: 0,
        days: 0,
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Invalid "days" value, days must be between 1 and 10 inclusive]`
    );

    await expect(
      getWeatherForecast({
        lat: 0,
        lon: 0,
        days: 11,
      })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `[Error: Invalid "days" value, days must be between 1 and 10 inclusive]`
    );
  });
});
