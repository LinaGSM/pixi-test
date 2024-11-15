// Conception de l'éditeur: organisation de ce qui va être dessiné sur l'écran 
// Class Editor, Class Region, Class Notes

//A faire : ajouter les fonctionnalités d''Amped Studio' 
//(zoom, déplacement de ce que l'on voit de la grille, création de notes,...)

//A faire la prochaine fois : faire afficher la note créée.

import { Notes } from "./Notes.js";
import { Region } from "./Region.js";

let dragTarget = null;
let maNote = new Notes(0, 5, 5);

maNote.graphisme.interactive = true;
maNote.graphisme.buttonMode = true; // Affiche le curseur comme une main sur hover

/////Pour le Drag/////






function drawGrid(rows, cols, cellSize, app) {
    let grid = new PIXI.Graphics();
    grid.strokeStyle = "white";

    for (let row = 0; row * cellSize <= app.canvas.height; row++) {
        grid.moveTo(0, row * cellSize);
        grid.lineTo(app.canvas.width, row * cellSize);
    }

    for (let col = 0; col * cellSize <= app.canvas.width; col++) {
        grid.moveTo(col * cellSize, 0);
        grid.lineTo(col * cellSize, app.canvas.height);
    }

    grid.stroke();

    app.stage.addChild(grid);
}



class Editor {

    listDeRegions = [];

    constructor() {
        console.log("Editor constructor");
        //this.dessineFenetre();
    }

    async dessineFenetre() {
        this.app = new PIXI.Application();
        await this.app.init(
            { width: 640, height: 360 } // voir si on peut changer en pourcentage de fenêtre
        );
        let cellSize = 50;
        drawGrid(5, 10, cellSize, this.app);

        //Dessine app (l'application graphique)
        document.body.appendChild(this.app.canvas);

        //let rectangle = maNote.creationRectangle(cellSize);
        this.app.stage.addChild(maNote.graphisme);


        // Ajouter un écouteur d'événement pour détecter les clics
        maNote.graphisme.on('pointerdown', onClick);

        // Setup events for mouse + touch using the pointer events
        maNote.graphisme.on('pointerdown', onDragStart, maNote.graphisme);


        // Center the maNote.graphisme's anchor point
        //maNote.graphisme.anchor.set(0.5);

        // Make it a bit bigger, so it's easier to grab
        //maNote.graphisme.scale.set(3);

        this.app.stage.interactive = true;
        this.app.stage.eventMode = 'static';
        this.app.stage.hitArea = this.app.screen;
        this.app.stage.on('pointerup', onDragEnd);
        this.app.stage.on('pointerupoutside', onDragEnd);




        function onClick(event) {
            console.log("click x y =" + event.data.global.x + " " + event.data.global.y);
        }


        ////// OnDrag //////


        function onDragStart(event) {
            console.log("onDragStart");
            // Store a reference to the data
            // * The reason for this is because of multitouch *
            // * We want to track the movement of this particular touch *
            this.alpha = 0.5;//pour la transparence
            dragTarget = maNote.graphisme;
            maNote.graphisme.on('pointermove', onDragMove);
        }

        function onDragMove(event) {
            let mousePosition = event.data.global;
            if (dragTarget) {
                //définir ce que fait le dragMove : ici on déplace la note
                console.log("x,y = " + event.data.global.x + " " + event.data.global.y);
                //maNote.moveTo(event.data.global.x, event.data.global.y);
                maNote.moveTo(mousePosition.x , mousePosition.y )  // Déplacer le rectangle pour le centrer sur la souris
                
                console.log("onDragMove");
                dragTarget.parent.toLocal(event.global, null, dragTarget.position);


            }
        }

        function onDragEnd(event) {
            if (dragTarget) {
                console.log("onDragEnd");
                //définir ce que fait le dragEnd
                //maNote.moveTo(event.data.global.x, event.data.global.y);
                maNote.graphisme.off('pointermove', onDragMove);
                dragTarget.alpha = 1;//fin de la transparence       /*compris */
                dragTarget = null;//"Réinitialisation" de dragTarget    /*compris */
            }
        }

    }

}

let monEditor = new Editor();

window.onload = monEditor.dessineFenetre();