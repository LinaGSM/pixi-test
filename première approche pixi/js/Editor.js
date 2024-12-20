//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%% Réfactoring:%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
//%%%%%%%%%%%%%%%%%%%%%%%%%%%% C:\Lina\MASTER\PROJET DS4H\OnMyOwn\Refactoring%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//


// Conception de l'éditeur: organisation de ce qui va être dessiné sur l'écran 
// Class Editor, Class Region, Class Notes

//A faire : ajouter les fonctionnalités d''Amped Studio' 
//(déplacement de ce que l'on voit de la grille,...)
/* zoom: Ok ---> Gérer les dézoom pour le scale < 1.0 */
/* création de notes: Ok */
/* déplacement des notes: Ok */


//A faire : Classe Grille qui contient les régions qui elles-mêmes contiennent les notes

//A faire : rendre modifiable le nombre de lignes et de colonnes de la grille
/* ---> J'ai rendu modifiable la taille des cellules de la grille (cellSizeHAUTEUR, cellSizeLARGEUR)*/

//A faire : rendre modifiable la taille des notes (longueur en temps)

//A faire : Gérer le temps (temps pixel) pour le curseur parcouru

let monEditor;
let app = new PIXI.Application();
let elementsDeEditor = [];

let cellSizeHAUTEUR = 50;
let cellSizeLARGEUR = 100;

let gridSnapping = true;

let dragTarget = null;

let maRegion = [];


/* Fonctions de L'editor:
- creeNote(x, y, gridSnapping) // Crée une note à la position x, y dans une cellule de la grille si gridSnapping=true
(OK)^
- zoom(hauteur, largeur) // Zoom sur la grille avec la valeur de hauteur et largeur
(OK)^
*/




await app.init(
    { width: 650, height: 360 } // voir si on peut changer en pourcentage de fenêtre
);

// Append the application canvas to the document body
document.body.appendChild(app.canvas);

// Sélectionne la div cible
const targetDiv = document.querySelector('.grille');

// Ajoute le canvas dans la div
targetDiv.appendChild(app.canvas);

const worldContainer = new PIXI.Container({
    // this will make moving this container GPU powered
    isRenderGroup: true,
});


const worldSize = 1000;

app.stage.addChild(worldContainer);



let x = 0;
let y = 0;

let const1 = 0;
let const2 = 0;

let sliderScrollHorizontal = document.getElementById("sliderScrollHorizontal");
let maxHorizontal = sliderScrollHorizontal.max;
let scrollValueHorizontal = 1.0;

sliderScrollHorizontal.addEventListener('input', () => {
    scrollValueHorizontal = parseFloat(sliderScrollHorizontal.value);
    x = scrollValueHorizontal * 10;
});

let sliderScrollVertical = document.getElementById("sliderScrollVertical");
let maxVertical = sliderScrollVertical.max;
let zoomValueVertical = 1.0;

sliderScrollVertical.addEventListener('input', () => {
    zoomValueVertical = parseFloat(sliderScrollVertical.value);
    y = zoomValueVertical * 10;



    console.log("worldContainer.x: " + worldContainer.x);
    console.log("worldContainer.y: " + worldContainer.y);

    console.log("x: " + x);
    console.log("y: " + y);

    console.log("const1: " + const1);
    console.log("const2: " + const2);
});


const screenWidth = app.renderer.width;
const screenHeight = app.renderer.height;


app.ticker.add(() => {

    const targetX = (x / screenWidth) * worldSize;
    const targetY = (y / screenHeight) * worldSize;

    const1 = targetX;
    const2 = targetY;

    //tree.position.set(targetX,targetY);



    worldContainer.x += (-targetX - worldContainer.x);
    worldContainer.y += (-targetY - worldContainer.y);

    pianoContainer.y += (-targetY - pianoContainer.y);
});






let xMax = maxHorizontal * 10;
let yMax = maxVertical * 10;

//la largeure de la zone parcourable
let worldWidth = (xMax / screenWidth) * worldSize + screenWidth;
//  xMax = (max(scrollValueHorizontal) * 10)

//la hauteur de la zone parcourable
let worldHeight = (yMax / screenHeight) * worldSize + screenHeight;
//  yMax = (max(scrollValueVertical) * 10)





const pianoContainer = new PIXI.Container({
    isRenderGroup: true,
});

app.stage.addChild(pianoContainer);



//Fonction pour dessiner un piano
function drawPiano() {
    let piano = new PIXI.Graphics();
    let touchesNoires = new PIXI.Graphics();
    let k = 0;

    //entre2TouchesNoires est la hauteur d'une touche blanche située entre deux touches noires
    let entre2TouchesNoires = 2 * cellSizeHAUTEUR;

    let longueurTouchesBlanches = 250;

    //positionToucheBlancheSuivante est la position de la prochaine touche blanche à dessiner
    let positionToucheBlancheSuivante = 0;
    for (let i = 0; i < 52; i++) {

        //ici on dessine les touches blanches qui sont entre deux touches noires 
        if (k == 1 || k == 2 || k == 5) {
            piano.rect(0, positionToucheBlancheSuivante, longueurTouchesBlanches, entre2TouchesNoires);
            positionToucheBlancheSuivante += entre2TouchesNoires;
        }
        //et ici on dessine les autres touches blanches 
        else {
            piano.rect(0, positionToucheBlancheSuivante, longueurTouchesBlanches, (3 / 2) * cellSizeHAUTEUR);
            positionToucheBlancheSuivante += (3 / 2) * cellSizeHAUTEUR;
        }
        piano.fill("white");
        piano.stroke({ width: 2, color: 0x000000, alpha: 1 });

        //on dessine les touches noires
        if (k != 3 && k != 6) {
            touchesNoires.rect(0, positionToucheBlancheSuivante - (cellSizeHAUTEUR / 2), (2 / 3) * longueurTouchesBlanches, cellSizeHAUTEUR);
            touchesNoires.fill("black");
        }

        k++;


        if (k == 7) {
            k = 0;
        }

    }

    piano.interactive = true;
    touchesNoires.interactive = true;
    pianoContainer.addChild(piano);
    pianoContainer.addChild(touchesNoires);

}


//Fonction pour dessiner la grille

function drawGrid(rows, cols, cellSizeHAUTEUR, cellSizeLARGEUR) {
    let grid = new PIXI.Graphics();
    grid.strokeStyle = "white";

    for (let row = 0; row * cellSizeHAUTEUR <= worldHeight; row++) {
        grid.moveTo(0, row * cellSizeHAUTEUR);
        grid.lineTo(worldWidth, row * cellSizeHAUTEUR);
    }

    for (let col = 0; col * cellSizeLARGEUR <= worldWidth; col++) {
        grid.moveTo(col * cellSizeLARGEUR, 0);
        grid.lineTo(col * cellSizeLARGEUR, worldHeight);
    }

    grid.stroke();

    grid.interactive = true;

    grid.position.set(0, 0);

    worldContainer.addChild(grid);

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

        worldContainer.addChild(this);
        this.on('pointerdown', onDragStart);
    }

}


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
//%%% Fonctions pour les évènements %%//
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//

///////////////////////////////////
//Fonctions pour déplacer la note//
///////////////////////////////////

function onDragStart(event) {
    // Est appelé à cette ligne là: note.on('pointerdown', onDragStart); dans onDoubleClick 
    // lors de la création de la note
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
}

function onDragEnd(event) {
    if (dragTarget) {
        app.stage.off('pointermove', onDragMove);
        dragTarget.alpha = 1;
        dragTarget = null;
    }
}


///////////////////////////////////////////
// Fonctions pour la création d'une note //
///////////////////////////////////////////

// Variables pour la détection du double-clic
let lastClickTime = 0; // Temps du dernier clic
const doubleClickInterval = 300; // Intervalle en millisecondes pour considérer un double-clic

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

    if (gridSnapping) {
        mousePos.x = Math.floor((mousePos.x + const1) / cellSizeLARGEUR) * cellSizeLARGEUR;
        mousePos.y = Math.floor((mousePos.y + const2) / cellSizeHAUTEUR) * cellSizeHAUTEUR;
    }

    let note = new Note(mousePos.x, mousePos.y, cellSizeLARGEUR, cellSizeHAUTEUR, "blue");
    elementsDeEditor.push(note);

}



//Classe Editor

class Editor {
    listDeRegions = [];
    constructor() {
        console.log("Editor constructor");
        drawGrid(5, 10, cellSizeHAUTEUR, cellSizeLARGEUR);
        drawPiano();

        // On rend la stage interactif
        app.stage.interactive = true;
        app.stage.eventMode = 'static';
        app.stage.hitArea = app.screen;

        worldContainer.interactive = true;
        worldContainer.eventMode = 'static';
        worldContainer.hitArea = app.screen;

        //On réagit aux évenements de création et déplacement de note
        app.stage.on('pointerup', onDragEnd);

        app.stage.on('pointertap', detecteDoubleClic);

    }

    //méthode pour créer une note
    creeNote(x, y, gridSnapping) {
        let xNote = x;
        let yNote = y;

        if (gridSnapping) {
            xNote = Math.floor((x + const1) / cellSizeLARGEUR) * cellSizeLARGEUR;
            yNote = Math.floor((y + const2) / cellSizeHAUTEUR) * cellSizeHAUTEUR;
        }

        let note = new Note(xNote, yNote, cellSizeLARGEUR, cellSizeHAUTEUR, "blue");
        elementsDeEditor.push(note);

    }

    //méthode pour zoomer sur la grille
    zoom(hauteur, largeur) {
        worldContainer.scale.set(hauteur, largeur);
        pianoContainer.scale.set(1, largeur);
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
            monEditor.zoom(zoomValueHorizontal, zoomValueVertical);
        });

    sliderZoomVertical
        .addEventListener("input", () => {
            zoomValueVertical = parseFloat(sliderZoomVertical.value);
            monEditor.zoom(zoomValueHorizontal, zoomValueVertical);
        });

    monEditor = new Editor();
    monEditor.creeNote(500, 125, true);
    monEditor.creeNote(625, 200, false);
}

window.onload = init;