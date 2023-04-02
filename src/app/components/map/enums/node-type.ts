/**
  W przypadku krawędzi jest tak:
- POI: 1 (to powinno być automatycznie przypisane do węzła związanego ze stanowiskiem i niezmienialne)
- Oczekujący: 2
- Wyjazdowy: 3
- Normalny: 4
- Oczekująco - wyjazdowy: 5
- Skrzyżowanie: 6
*/
export enum NodeType {
  POI = 1,
  Wait = 2,
  Depart = 3,
  Normal = 4,
  WaitAndDepart = 5,
  Crossing = 6
}
