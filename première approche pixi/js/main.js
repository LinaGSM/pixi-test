window.onload = init;
let app;

async function init() {
    console.log("Page chargée");
    app = new PIXI.Application()
    
    await app.init(
        { width: 640, height: 360 }
    );
    console.log("largeur : " + app.view.width);
    console.log("hauteur : " + app.view.height);
    
    document.body.appendChild(app.canvas);

        drawGrid(5, 10, 50);
        drawCursor(10);
    
        const rectangle = new PIXI.Graphics();
        rectangle.rect(100, 100, 200, 100); // x, y, largeur, hauteur
        rectangle.fill(0xFF0000); // Couleur de remplissage rouge
        app.stage.addChild(rectangle);
}
 
// Crée une fonction qui affiche une grille
function drawGrid(rows, cols, cellSize) {
    const grid = new PIXI.Graphics();
    grid.strokeStyle = "white";
    
    //console.log("Nombre de lignes : " + rows);
    //console.log("Nombre de colonnes : " + cols);
    //const cell=((app.view.width)/cols);
    for (let row = 0; row*cellSize <= app.view.height; row++) {
        grid.moveTo(0, row * cellSize);
        grid.lineTo(app.view.width, row * cellSize);
    }

    for (let col = 0; col * cellSize <= app.view.width; col++) {
        grid.moveTo(col * cellSize, 0);
        grid.lineTo(col * cellSize, app.view.height);
    }

    grid.stroke();

    app.stage.addChild(grid);
}
//crée une fonction en pixi js qui affiche un curseur comme une ligne parcourant la grille de haut en bas
function drawCursor(x) {    // dessine un curseur à la position x (rouge)
    const cursor = new PIXI.Graphics();
    cursor.strokeStyle="red";
    cursor.lineStyle(3, "red", 1); //curseur d'épaisseur 3 et de couleur rouge
    //console.log("épaisseur : " + cursor.linewidth);

    cursor.moveTo(x, 0);
    cursor.lineTo(x, app.view.height);
    cursor.stroke();
    app.stage.addChild(cursor);
}


//----------Outils----------//

//--Charge un PNG ('pixiTest.png')--//

        /*await PIXI.Assets.load('pixiTest.png');
        let sprite = PIXI.Sprite.from('pixiTest.png');
        app.stage.addChild(sprite); 
        */

//--Fait bouger un élement en fonction du temps écoulé--//


        /*
    // Add a variable to count up the seconds our demo has been running
        let elapsed = 0.0;

    // Tell our application's ticker to run a new callback every frame, passing
    // in the amount of time that has passed since the last tick
        app.ticker.add((ticker) => {
            // Add the time to our total elapsed time
            elapsed += ticker.deltaTime;
            // Update the sprite's X position based on the cosine of our elapsed time.  We divide
            // by 50 to slow the animation down a bit...
            sprite.x = 100.0 + Math.cos(elapsed/50.0) * 100.0;
        });
        */

//--Crée un rectangle--//

        
        const rectangle = new PIXI.Graphics();
        rectangle.rect(100, 100, 200, 100); // x, y, largeur, hauteur
        rectangle.fill(0xFF0000); // Couleur de remplissage rouge
        

//--Ajoute un élément à la scène--//

        app.stage.addChild(rectangle);
        
//--Dessine une Ligne d'un point (x, y) à (x + width, y + height)--//

        /*
        function drawLine(x, y, width, height) {
            const line = new PIXI.Graphics();
            line.lineStyle(2, 0xFFFFFF, 1);
            line.moveTo(x, y);
            line.lineTo(x + width, y + height);
            app.stage.addChild(line);
        }
        */