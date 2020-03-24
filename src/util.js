import axios from "axios";

export function determineCenter(regiao) {
  switch (regiao) {
    case "Norte":
      return [-5.752961, -57.8];
    case "Nordeste":
      return [-10.752961, -40];
    case "Sul":
      return [-28, -50];
    case "Sudeste":
      return [-20, -45];
    case "Centro-Oeste":
      return [-15.75, -57.87];
    default:
      return [-15.75291, -57.85457];
  }
}

export function determineZoom(regiao) {
  switch (regiao) {
    case "Norte":
    case "Nordeste":
    case "Sul":
    case "Sudeste":
    case "Centro-Oeste":
      return 5;
    default:
      return 4;
  }
}

export function getDaysArray(start, end = new Date()) {
  for (var arr = [], dt = start; dt <= end; dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt));
  }
  return arr.map(v => v.toISOString().slice(0, 10));
}

export function getAllFullReports(start, end = new Date()) {
  const dates = getDaysArray(start, end);

  const promises = dates.map(date => {
    return axios
      .get(
        `https://covid19-brazil-api.now.sh/api/report/v1/brazil/${date.replace(
          /-/g,
          ""
        )}`
      )
      .then(res => {
        return { data: res.data.data, date };
      });
  });

  return Promise.all(promises).then(res => {
    const fullReports = res.filter(r => r.data.length !== 0);

    return {
      reports: fullReports.map(r => r.data),
      availableDates: fullReports.map(r => r.date)
    };
  });
}
