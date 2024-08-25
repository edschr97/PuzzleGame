class Picture {
  
  constructor(x, y, w, h, r, g, b, a, iP, iR, bild) {
    this.x = x;         // X Position
    this.y = y;         // Y Position
    this.w = w;         // Breite
    this.h = h;         // Höhe
    this.r = r;         // Rot
    this.g = g;         // Grün
    this.b = b;         // Blau
    this.a = a;         // Alpha
    this.iP = iP;       // Index vom Bild
    this.iR = iR        // Index vom Raster
    this.bild = bild;   // Geladenes Bild
    this.cropX = constrain(this.x-this.w/2, 0, width);  // Breite um des ausgeschnitten Bildes
    this.cropY = constrain(this.y-this.h/2, 0, height); // Höhe um des ausgeschnitten Bildes
  }
  
  drawP() {
    applyMatrix();
    translate(this.x, this.y , 1);  // Postition
    
    imageMode(CENTER);
    image(this.bild.get(this.cropX, this.cropY, this.w, this.h), 0, 0, this.w, this.h);

    rectMode(CENTER);
    noStroke();
    fill(this.r, this.g, this.b, this.a); // Farbe
    rect(0, 0, this.w, this.h);
    
    textSize(10);
    textAlign(CENTER);
    fill(255,100);
    text(this.iP, 0, 0);
    
    resetMatrix();
  }
  
  
  // getter Methoden 
  
  getPX() { // gibt X Position zurück
    return this.x;
  }
  
  getPY() { // gibt Y Position zurück
    return this.y;
  }
  
  getPI() { // gibt Index des Pictures zurück
    return this.iP;
  }
  
  getIMR() { // gibt Index der Zelle zurück auf der die Liegt
    return this.iR;
  }
  
  
  // setter Methoden
  
  setPXY(xP, yP){ // setzt neue Werte für X und Y
    this.x = xP;
    this.y = yP;
  }
    
  setPA(aR){ // setzt einen neuen Wert für Alpha
    this.a = aR;
  }
  
  setIMR(iMRnew) { // bekommt eine neue Zelle zugewissen
    this.iR = iMRnew; 
  }
  
  // functions
  
  // Ceckt den Abstand zur Maus
  checkDis(mX, mY) {
    let di = dist(this.x, this.y, mX, mY);
    
    if(di < this.w/2) {
      this.a = 100;
      return true;
    } else {
      this.a = 0;
      return false;
    }
  }
}