export function formatDate(timestamp: number) {
  // Create a date object from the timestamp
  const date = new Date(timestamp);

  // return a formatted date
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function daysBetween(date1: number, date2: number) {
  // The number of milliseconds in one day
  const ONE_DAY = 1000 * 60 * 60 * 24;

  // Calculate the difference in milliseconds
  const differenceMs = Math.abs(date1 - date2);

  // Convert back to days and return
  return Math.round(differenceMs / ONE_DAY);
}

export function getSemantleNumber(timestamp: number): number {
  return daysBetween(timestamp, 1643414400000);
}

/*
 * The MIT License
Copyright (c) 2018 Alexufo . Original code 2013 by Sveinn Steinarsson
*/

/* eslint-disable @typescript-eslint/camelcase */
export function largestTriangleThreeBuckets(data: number[], threshold: number) {
  // data is linear array [90,87,97...]
  const data_length = data.length;
  if (threshold >= data_length || threshold === 0) {
    return data; // Nothing to do
  }
  const sampled = [];
  let sampled_index = 0;

  // Bucket size. Leave room for start and end data points
  const every = (data_length - 2) / (threshold - 2);

  let a = 0, // Initially a is the first point in the triangle
    max_area_point,
    max_area,
    area,
    next_a;

  sampled[sampled_index++] = data[a]; // Always add the first point

  for (let i = 0; i < threshold - 2; i++) {
    // Calculate point average for next bucket (containing c)
    let avg_x = 0,
      avg_y = 0,
      avg_range_start = Math.floor((i + 1) * every) + 1,
      avg_range_end = Math.floor((i + 2) * every) + 1;
    avg_range_end = avg_range_end < data_length ? avg_range_end : data_length;

    const avg_range_length = avg_range_end - avg_range_start;

    for (; avg_range_start < avg_range_end; avg_range_start++) {
      avg_x += avg_range_start;
      avg_y += data[avg_range_start] * 1; // * 1 enforces Number (value may be Date)
    }

    avg_x /= avg_range_length;
    avg_y /= avg_range_length;

    // Get the range for this bucket
    let range_offs = Math.floor((i + 0) * every) + 1;
    const range_to = Math.floor((i + 1) * every) + 1;

    // Point a
    const point_a_x = a * 1, // enforce Number (value may be Date)
      point_a_y = data[a] * 1;

    max_area = area = -1;

    for (; range_offs < range_to; range_offs++) {
      // Calculate triangle area over three buckets
      area =
        Math.abs(
          (point_a_x - avg_x) * (data[range_offs] - point_a_y) -
            (point_a_x - range_offs) * (avg_y - point_a_y)
        ) * 0.5;
      if (area > max_area) {
        max_area = area;
        max_area_point = data[range_offs];
        next_a = range_offs; // Next a is this b
      }
    }

    sampled[sampled_index++] = max_area_point; // Pick this point from the bucket
    a = next_a as number; // This a is the next a (chosen b)
  }

  sampled[sampled_index++] = data[data_length - 1]; // Always add last
  return sampled;
}
/* eslint-enable @typescript-eslint/camelcase */
