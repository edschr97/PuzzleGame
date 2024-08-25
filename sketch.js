

  let start = false;

  let widthR = 160; // Höhe einer Zelle
  let heightR = 160;// Breite einer Zelle

  let wCanvas = 640;
  let hCanvas = 480;

  let mousex = widthR / 2;
  let mousey = heightR / 2;

  let spalte = 4; // Spaltenanzahl wird berrechnet, Breite/Zellenbreite
  let zeile = 3;  // Zeilenanzahl wird berrechnet, Höhe/Zellenhöhe
  let amount = spalte * zeile; // Anzahl der Zellen wird berechnet, Spalte*Zeile
  let ind = 0; // Wert für die Schleife

  let sA = 0;
  let x = widthR / 2;
  let y = heightR / 2;

  let erstesMalHalten = false;

  let werte = []; // Liste der gemischten Indexe

  let raster = [];  // Liste der die Rasterzellen enhählt
  let pic = [];     // Liste der die Picturezellen enthält

  let isHolding = false; // gibt an ob etwas gehalten wird
  let hold;  //
  let place;

  let pl = [2]; // pl[0] = holdRaster; pl[1] = placeRaster;

  var img; // Geladenes Bild

  let winn = false; // Boolean für die Winnanzeige

  // Storing the last keypoint position
  let lastKeypoints = [];

  // Bewegung erkennung

  let video;
  let poseNet;
  let poses = [];

  let links = [2];
  let rechts = [2];

  let holdIndex;

  let sw = false;

  let control = 2;

  function preload()
  {
    img = loadImage('data/cat_640_480.jpg');
  }

  function setup()
  {
    createCanvas(640, 800);

    frameRate(10);


    // Aus OpenPos Beispiel https://editor.p5js.org/edschr/sketches/09hxMkLly /////////////////////////////


    video = createCapture(VIDEO);
    video.size(wCanvas, hCanvas);

    // Create a new poseNet method with a single detection
    poseNet = ml5.poseNet(video);
    // This sets up an event that fills the global variable "poses"
    // with an array every time new poses are detected
    poseNet.on('pose', function (results)
    {
      poses = results;
    });
    // Hide the video element, and just show the canvas
    video.hide();

    print(lastKeypoints);
    // setup original keypoints
    createDefaultKeypoints();
    print(lastKeypoints);


    //////////////////////////////////////////////////////////////////////////////////////////////////////////


    let l = createVector(links[0], links[1]);
    let r = createVector(rechts[0], rechts[1]);

    for (let j = 0; j < zeile; j++)
    {
      for (let i = 0; i < spalte; i++)
      {
        // Raster wird erzeugt
        raster[ind] = new Raster(widthR / 2 + i * widthR,   // X Position
          heightR / 2 + j * heightR, // Y Poistion
          widthR,  // Breit
          heightR, // Höhe
          ind,     // Index Raster
          ind,     // Index Bild
          255,
          0,
          0,
          100);

        // Picture wird erzeugt
        pic[ind] = new Picture(raster[ind].getRX(), // X Position
          raster[ind].getRY(), // Y Poistion
          widthR,  // Breit
          heightR, // Höhe
          255,     // Rot
          255,     // Grün
          255,     // Blau
          0,     // Alpha
          ind,     // Index von des Pictures
          ind,
          img);    // Index des Raster auf dem es liegt
        //console.log(ind);
        ind++; // erhöht den Index für das erzeugen
      }
    }
  }



  function draw()
  {
    background(34, 34, 34);

    //Variablen für die Hände
    let l = createVector(links[0], links[1]); // Linke Hand Position
    let r = createVector(rechts[0], rechts[1]); // Rechte Hand Position

    let m1 = p5.Vector.lerp(l, r, 0.5); // Die Mitte vom Abstand der Hände

    let dis = dist(l.x, l.y, r.x, r.y); // Abstand der Hände

    updateKeypoints();

    drawKeypoints();


    // übergibt Mausvaribalen die Mausposition
    mousex = constrain(m1.x, 0, wCanvas);
    mousey = constrain(m1.y, 0, hCanvas);

    for (let i = 0; i < amount; i++)
    { // Picture wird dargestellt

      pic[i].drawP();

      //raster[i].drawR();
      if (start == true)
      {

        if (sw == false && isHolding == false)
        { // Maus hält nichts
          if (pic[i].checkDis(mousex, mousey) == true)
          {
            hold = pic[i].getPI();
            //console.log(pic[i].getIMR());
            pl[0] = pic[i].getIMR();
          }
        }

        if (sw == true && isHolding == true)
        {  // Raster wird beim halten aktiviert und die distanz überprüft
          if (raster[i].checkDisR(mousex, mousey) == true)
          {
            pl[1] = raster[i].getRI();
            place = pic[raster[i].getIMP()].getPI();
            //console.log(hold + " (" + pl[0] + ") " + " is over " + place + " (" + pl[1] + ")");
          }
        }

        raster[i].richtigesBild();

        if (isHolding && hold != null)
        {
          sw = true;
          erstesMalHalten = true;
          pic[hold].setPXY(mousex, mousey);
          pic[hold].drawP();
          //console.log("hält");
        } else
        {
          if (sw == true)
          {
            loslassen();
          }

        }
      }
    }

    // Grafik um dem Spieler zu zeigen, dass man Gewonnen hat
    if (winn == true)
    {
      applyMatrix();
      fill(0, 150);
      rectMode(CENTER);
      rect(width / 2, height / 2, width, height);
      fill(255);
      textSize(50);
      textAlign(CENTER);
      text("NICE", width / 2, height / 2);
      resetMatrix();
    }

    //stellt Mauszeiger da bzw Mitte von den Händen
    checkDisHand(dis);
    checkDisHold(l.x, l.y, r.x, r.y);
    checkHold(m1.x, m1.y);

    // Stellt Hände da

    if (control == 2)
    {
      fill(255, 0, 0);
      ellipse(links[0], links[1], 10, 10);

      fill(255, 0, 0);
      ellipse(rechts[0], rechts[1], 10, 10);
    }

    //console.log(hold + " " + place);
    //console.log(pl[0] + " " + pl[1]);
    applyMatrix();
    translate(480 / 3, 650);
    scale(-0.5, 0.5);
    image(video, 0, 0);
    resetMatrix();
  }


  // Erzeugt und übergibt den Bilder zufäliige Postionen vom Raster
  function randomPosition()
  {
    werte = randomize(amount); // Liste zwei wird erzeugt
    //console.log(werte);

    // Pictures bekommen neue X und Y Werte aus der generierten Liste
    for (let i = 0; i < amount; i++)
    {
      pic[i].setPXY(raster[werte[i]].getRX(), raster[werte[i]].getRY());

      pic[i].setIMR(werte[i]);
      raster[werte[i]].setIMP(pic[i].getPI());
      //console.log(pic[i].getPI() + " X: " + pic[i].getPX() + " Y: " + pic[i].getPY());
    }
  }


  function keyPressed()
  {
    if (keyCode === ENTER)
    { // Staret das Spiel
      startGame();
    }

    if (keyCode === BACKSPACE)
    { // Endet das Spiel
      stopGame();
    }

    if(keyCode === ESCAPE)
    {
      let fs = fullscreen();
      fullscreen(!fs);
    }
  }


  // Halten /////////////////////////
  function checkHold(xh, yh)
  {
    if (isHolding == true)
    {
      //text("holding", xh-5, yh-30);
      stroke(255);
      strokeWeight(2);
      fill(0, 0);
      ellipse(xh, yh, 80, 80);
    } else
    {
      //text("not holding", xh, yh-30);
      stroke(255);
      strokeWeight(2);
      fill(0, 0);
      ellipse(xh, yh, 20, 20);
    }
  }


  function checkDisHand(distance)
  {
    if (distance < widthR && start == true && constrain(mousex, 0, width) && constrain(mousey, 0, height))
    {
      isHolding = true;
    } else
    {
      isHolding = false;
    }
  }


  function checkDisHold(x1, y1, x2, y2)
  {
    let chDi = dist(x1, y1, x2, y2);

    if (chDi < 15)
    {
      return true;
    } else
    {
      return false;
    }

  }


  function loslassen()
  {
    if (erstesMalHalten)
    {
      // Tauscht die Plätze und übergibt aus dem Zwischenspeicher die Indexwerte

      pic[hold].setPXY(raster[pl[1]].getRX(), raster[pl[1]].getRY());
      pic[hold].setIMR(raster[pl[1]].getRI());
      raster[pl[0]].setIMP(pic[place].getPI());

      pic[place].setPXY(raster[pl[0]].getRX(), raster[pl[0]].getRY());
      pic[place].setIMR(raster[pl[0]].getRI());
      raster[pl[1]].setIMP(pic[hold].getPI());

      //console.log(pic[hold].getPI() + " switch with " + pic[place].getPI());
      //console.log("hat losgelassen");

      sw = false;
      /*
      place = null;
      hold = null;
      pl[1] = null;
      pl[0] = null;
      */
      checkWin();

    }
  }


  // startet das Spiel
  function startGame()
  {
    sw = false;
    start = true;
    isHolding = false;
    winn = false;
    console.log("start");
    randomPosition();
  }


  // stopt das Spiel
  function stopGame()
  {

    // setzt Boolean zurück
    start = false;
    sw = false;
    istHolding = false;
    erstesMalHalten = false;
    console.log("stop");

    //setzt wieder die Startwerte zurück
    for (var i = 0; i < amount; i++)
    {
      pic[i].setPXY(raster[i].getRX(), raster[i].getRY());
      pic[i].setIMR(i);
      pic[i].setPA(0);
      raster[i].setIMP(i);
    }

    // setzt die Zwischenspeicher zurück;
    pl[0] = null;
    pl[1] = null;
    place = null;
    hold = null;
  }


  function checkWin()
  { // checkt ob alle auf der richtigen Positionen sind
    if (start == true)
    {
      var amountOfRight = 0;

      for (let i = 0; i < amount; i++)
      {
        if (raster[i].richtigesBild() == true)
        {
          amountOfRight++;
        }
      }

      if (amountOfRight == amount)
      {
        console.log("nice: " + amountOfRight);
        winn = true;
        stopGame();
      } else
      {
        winn = false;
        console.log("bad: " + amountOfRight);
      }
    }
  }


  // Kontrollen /////////////////////////////

  function keyTyped()
  {
    if (key === 'r')
    { // gibt die enthaltene Indexe des Rasters aus
      for (let i = 0; i < amount; i++)
      {
        console.log("Raster ID: " + raster[i].getRI() + "  -> Picture ID: " + raster[i].getIMP());
      }
    }

    if (key === 'p')
    { // gibt die enthaltene Indexe des Bildes aus
      for (let i = 0; i < amount; i++)
      {
        console.log("Picture ID: " + pic[i].getPI() + " -> Raster ID: " + pic[i].getIMR());
      }
    }
  }


  // Aus OpenPose Beispiel https://editor.p5js.org/edschr/sketches/09hxMkLly

  // Create default keypoints for easing.
  function createDefaultKeypoints()
  {
    let numKeypoints = 17;
    for (let i = 0; i < numKeypoints; i++)
    {
      newKeypoint = {x: width / 2, y: height / 2}

      lastKeypoints.push(newKeypoint);
    }
  }


  function updateKeypoints()
  {
    // If there are no poses, ignore it.
    if (poses.length <= 0)
    {
      return;
    }

    // Otherwise, let's update the points;

    let pose = poses[0].pose;
    let keypoints = pose.keypoints;

    for (let kp = 0; kp < keypoints.length; kp++)
    {

      let oldKeypoint = lastKeypoints[kp];
      let newKeypoint = keypoints[kp].position;

      let interpX = lerp(oldKeypoint.x, newKeypoint.x, .3);
      let interpY = lerp(oldKeypoint.y, newKeypoint.y, .3);

      let interpolatedKeypoint = {x: interpX, y: interpY}

      lastKeypoints[kp] = interpolatedKeypoint;
    }
  }


  // A function to draw ellipses over the detected keypoints
  function drawKeypoints()
  {

    for (let i = 0; i < lastKeypoints.length; i++)
    {
      keypoint = lastKeypoints[i];

      fill(i * 10, i * 10, 0);

      //text(i, keypoint.x, keypoint.y);

      if (i == 10)
      {
        links = [width - keypoint.x, keypoint.y];
      }

      if (i == 9)
      {
        rechts = [width - keypoint.x, keypoint.y];
      }
    }
  }
