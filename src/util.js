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
