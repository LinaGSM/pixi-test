export class Notes {
    start = 0;
    end = 0;
    hauteur = 0;
    graphisme;
    constructor(x, y, hauteurDeLaNote) {
        this.start = x;
        this.end = y;
        this.hauteur = hauteurDeLaNote
        this.graphisme = this.creationRectangle(50);

        this.graphisme.interactive = true;
        this.graphisme.buttonMode = true; // Affiche le curseur comme une main sur hover

        /////Pour le Drag/////

        // Enable the this.graphisme to be interactive... this will allow it to respond to mouse and touch events
        this.graphisme.eventMode = 'static';

        // This button mode will mean the hand cursor appears when you roll over the this.graphisme with your mouse
        this.graphisme.cursor = 'pointer';

        // Center the this.graphisme's anchor point
        //this.graphisme.anchor.set(0.5);

        // Make it a bit bigger, so it's easier to grab
        //this.graphisme.scale.set(3);




        console.log('Notes is created');
    }

    creationRectangle(cellSize) {
        let rectangle = new PIXI.Graphics();
/*
        rectangle.x = this.start;
        rectangle.y = this.hauteur * cellSize;
        rectangle.width = (this.end - this.start) * cellSize;
        rectangle.height = cellSize;
*/
        //Les -1 -2 servent à laisser un espace entre les rectangles
        rectangle.rect(this.start + 1, this.hauteur * cellSize + 1, (this.end - this.start) * cellSize - 2, cellSize - 1); // x, y, largeur, hauteur
        rectangle.fill(0xFF0000); // Couleur de remplissage rouge

        

        return rectangle;
    }

    moveTo(x, y) {
        this.start = x;
        this.hauteur = y;
        this.graphisme;
        this.graphisme = this.creationRectangle(50);
    }

    // Enable the bunny to be interactive... this will allow it to respond to mouse and touch events

}