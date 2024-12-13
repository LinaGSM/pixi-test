//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Réfactoring:%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
//%%%%%%%%%%%%%%%%%%%%%%%%%%%% C:\Lina\MASTER\PROJET DS4H\OnMyOwn\Refactoring%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//

let monEditor;
let app = new PIXI.Application();
let elementsDeEditor = [];

let cellSizeHAUTEUR = 50;
let cellSizeLARGEUR = 100;
let gridSnapping = true;

await app.init(
    { width: 640, height: 360 } // voir si on peut changer en pourcentage de fenêtre
);

// Conception de l'éditeur: organisation de ce qui va être dessiné sur l'écran 
// Class Editor, Class Region, Class Notes

//A faire : ajouter les fonctionnalités d''Amped Studio' 
//(déplacement de ce que l'on voit de la grille,...)
/* zoom: Ok ---> Gérer les dézoom pour le scale < 1.0 */
/* création de notes: Ok */
/* déplacement des notes: Ok */


//A faire : Classe Grille qui contient les régions qui elles-mêmes contiennent les notes

//A faire : rendre modifiable le nombre de lignes et de colonnes de la grille
/* ---> J'ai rendu modifiable la taille des cel
lules de la grille (cellSizeHAUTEUR, cellSizeLARGEUR)*/

//A faire : rendre modifiable la taille des notes (longueur en temps)

//A faire : Gérer le temps (temps pixel) pour le curseur parcouru

let dragTarget = null;

let lignesHorizontales = [];
let lignesVerticales = [];
let maRegion = [];

//Fonction pour dessiner la grille

function drawGrid(rows, cols, cellSizeHAUTEUR, cellSizeLARGEUR) {
    let grid = new PIXI.Graphics();
    grid.strokeStyle = "white";

    for (let row = 0; row * cellSizeHAUTEUR <= app.canvas.height; row++) {
        grid.moveTo(0, row * cellSizeHAUTEUR);
        grid.lineTo(app.canvas.width, row * cellSizeHAUTEUR);
    }

    for (let col = 0; col * cellSizeLARGEUR <= app.canvas.width; col++) {
        grid.moveTo(col * cellSizeLARGEUR, 0);
        grid.lineTo(col * cellSizeLARGEUR, app.canvas.height);
    }

    grid.stroke();

    app.stage.addChild(grid);
}

//Classe Note

class Note extends PIXI.Graphics {
    constructor(x, y, l, h, color) {
        super();
        this.rect(0, 1, l - 1, h - 1);
        this.fill(color);
        this.position.set(x, y);

        this.interactive = true;
        maRegion.push(this);

    }

}

//Classe Editor

class Editor {

    listDeRegions = [];

    constructor() {
        console.log("Editor constructor");
    }

    //Revoir la conception de dessineFenetre
    async dessineFenetre() {

        drawGrid(5, 10, cellSizeHAUTEUR, cellSizeLARGEUR);

        //Dessine app (l'application graphique)
        document.body.appendChild(app.canvas);

        let dragTarget = null;

        function onDragStart(event) {
            this.alpha = 0.5;
            dragTarget = this;
            app.stage.on('pointermove', onDragMove);
        }

        function onDragMove(event) {

            if (dragTarget) {
                dragTarget.parent.toLocal(event.global, null, dragTarget.position);
                if (gridSnapping) {
                    dragTarget.x = Math.floor(dragTarget.x / cellSizeLARGEUR) * cellSizeLARGEUR;
                    dragTarget.y = Math.floor(dragTarget.y / cellSizeHAUTEUR) * cellSizeHAUTEUR;
                }
            }

            return;
        }



        function onDragEnd(event) {
            if (dragTarget) {
                app.stage.off('pointermove', onDragMove);
                dragTarget.alpha = 1;
                dragTarget = null;
            }
        }



        app.stage.interactive = true;
        app.stage.eventMode = 'static';
        app.stage.hitArea = app.screen;
        app.stage.on('pointerup', onDragEnd);
        app.stage.on('pointerupoutside', onDragEnd);

        app.stage.on('pointertap', detecteDoubleClic);

        // Écouter l'événement pointertap (qui détecte un clic ) et appelle double clic seulement si
        // un deuxieme clic est detecté, avec un interval (doubleClickInterval) entre les deux clics

        // Variables pour la détection du double-clic
        function detecteDoubleClic(event) {
            const currentTime = Date.now();
            if (currentTime - lastClickTime < doubleClickInterval) {
                onDoubleClick(event); // Appelle la fonction associée au double-clic
            }
            
            lastClickTime = currentTime;
        }

        function onDoubleClick(event) {
            //créer une note dans la cell du double clic

            let mousePos = event.global;

            mousePos.x /= app.stage.scale.x;
            mousePos.y /= app.stage.scale.y;

            gridSnapping = true
            if (gridSnapping) {
                mousePos.x = Math.floor(mousePos.x / cellSizeLARGEUR) * cellSizeLARGEUR;
                mousePos.y = Math.floor(mousePos.y / cellSizeHAUTEUR) * cellSizeHAUTEUR;
            }

            let carre = new Note(mousePos.x, mousePos.y, cellSizeLARGEUR, cellSizeHAUTEUR, "blue");
            app.stage.addChild(carre);
            elementsDeEditor.push(carre);

            carre.on('pointerdown', onDragStart);
        }




        // Variables pour la détection du double-clic
        let lastClickTime = 0; // Temps du dernier clic
        const doubleClickInterval = 300; // Intervalle en millisecondes pour considérer un double-clic

    }
}


function init() {
    let sliderZoomHorizontal = document.getElementById("sliderZoomHorizontal");
    let sliderZoomVertical = document.getElementById("sliderZoomVertical");


    let zoomValueHorizontal = 1.0;
    let zoomValueVertical = 1.0;


    sliderZoomHorizontal
        .addEventListener("input", () => {
            zoomValueHorizontal = parseFloat(sliderZoomHorizontal.value);
            app.stage.scale.set(zoomValueHorizontal, zoomValueVertical);
        });

    sliderZoomVertical
        .addEventListener("input", () => {
            zoomValueVertical = parseFloat(sliderZoomVertical.value);
            app.stage.scale.set(zoomValueHorizontal, zoomValueVertical);
        });

    monEditor = new Editor();
    monEditor.dessineFenetre();

}

window.onload = init;