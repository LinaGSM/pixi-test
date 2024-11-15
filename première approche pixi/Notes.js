class Notes {
    start = 0;
    end = 0;
    hauteur = 0;
    constructor(x, y, hauteurDeLaNote) {
        this.start = x;
        this.end = y;
        this.hauteur = hauteurDeLaNote

        console.log('Notes is created');
    }

    creationRectangle(cellSize) {
        const rectangle = new PIXI.Graphics();
        rectangle.rect(this.start, this.hauteurDeLaNote * cellSize, (this.end - this.start), cellSize); // x, y, largeur, hauteur

        //affiche dans la console tous les paramètres de retcangle.rect
        console.log("x : " + this.start);
        console.log("y : " + this.hauteur * cellSize);

        //affiche dans la console this.end
        console.log(this.end - this.start);

        console.log("largeur : " + (this.end - this.start));
        console.log("hauteur : " + cellSize);

        rectangle.fill(0xFF0000);

        return rectangle;
    }

    /*affichage(app, cellSize){
        const visuel = this.creationRectangle(cellSize); 
        app.stage.addChild(visuel);
        console.log("Note est affichée");
    }*/

    // Enable the bunny to be interactive... this will allow it to respond to mouse and touch events
    eventMode = 'static';

    // This button mode will mean the hand cursor appears when you roll over the bunny with your mouse
    cursor = 'pointer';
    /*
        // Setup events for mouse + touch using the pointer events
        bunny.on('pointerdown', onDragStart, bunny);
    
        // Move the sprite to its designated position
        bunny.x = x;
        bunny.y = y;*/


    //0xFF0000
}