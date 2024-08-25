function randomize(size) {
  let randomIndex; // Zwischenspeicher für den Index für das gelöschte Element
  let arry1 = [];
  let arry2 = [];
  
  // Befühlt die erste Liste
  for(let i = 0; i < size; i++) { 
    arry1[i] = i;
  }
  
  //Befühlt die zweite Liste zufällig mit den Werten aus der ersten Liste
  for(let i = 0; i < size; i++) {
    randomIndex = Math.floor(Math.random()*arry1.length); // Erzeugt einen zufälligen Index
    arry2[i] = arry1[randomIndex];
    arry1.splice(randomIndex, 1); // Löscht den Wert aus der ersten Liste
  }
  
  return arry2;
}