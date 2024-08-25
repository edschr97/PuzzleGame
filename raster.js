class Raster {
  
  constructor(x, y, w, h, iR, iP, r, g, b, a) {
    this.x = x;   // X Position
    this.y = y;   // Y Position
    this.w = w;   // Breite
    this.h = h;   // Höhe
    this.iR = iR; // Index von der Zelle
    this.iP = iP; // Index vom Bild
    this.sA = 0;  // Rahmendicke
    this.r = r;   // Rot
    this.g = g;   // Grün
    this.b = b;   // Blau
    this.a = a;   // Alpha
  }
  
  drawR() {
    applyMatrix();
    translate(this.x, this.y);            // Postition
    rectMode(CENTER);
    fill(255,100);
    noStroke();
    textSize(10);
    text(this.iR + ": " + this.iP, -30, -35);
    fill(this.r, this.g, this.b, this.a);
    stroke(255);
    strokeWeight(this.sA);// Farbe
    rect(0, 0, this.w, this.h);           // Zelle
    resetMatrix();
  }
  
  
  // getter Methoden 
  
  getRX() { // gibt X Position zurück
    return this.x;
  }
  
  getRY() { // gibt Y Position zurück
    return this.y;
  }
  
  getRI() { // gibt Index der Zelle zurück
    return this.iR;
  }
  
  getIMP() { // gibt Index der Zelle zurück
    return this.iP;
  }
  
  
  // setter Methoden
  
  setRA(aR){ // setzt einen neuen Wert für Alpha
    this.a = aR;
  }
  
  setSA(SA) { // setzt neue Rahmenstärke
    this.sA =SA
  }
  
  setIMP(IP) { // setzt einen Index des Bildes in der Zelle
    this.iP = IP;
  }
  
  setRF(R, G, B) { // setzt  neue Farben
    this.r = R;
    this.g = G;
    this.b = B;
  }

  
  // functions
  
  // Checkt den Abstand zur Maus und ändert den Rahmen der Zelle
  checkDisR(mX, mY) {
    let di = dist(this.x, this.y, mX, mY);
    if(di < this.w/2) {
      return true;
    } else {
      return false;
    }
  }
  
  
  // Ändert die Farbe, jenachdem ob die Rasterzelle das richtige Bild enhält
  richtigesBild() {
    if(this.iR != this.iP) {
      return false;
    } else {
      return true;
    }
  }
  
}