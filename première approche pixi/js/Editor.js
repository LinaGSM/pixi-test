//import Note from './Notes.js';

let app = new PIXI.Application();

let monEditor;
let elementsDeEditor = [];
let maRegion = [];

let cellSizeHAUTEUR = 25;
let cellSizeLARGEUR = 25;

let gridSnapping = true;

let dragTarget = null;

let play = false;


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




const worldSize = 100000;

app.stage.addChild(worldContainer);


let x = 0;
let y = 0;

let const1 = 0;
let const2 = 0;

let sliderScrollHorizontal = document.getElementById("sliderScrollHorizontal");
let maxHorizontal = sliderScrollHorizontal.max;
let scrollValueHorizontal = 1.0;

//let playButton = document.getElementById("play");


sliderScrollHorizontal.addEventListener('input', () => {
    scrollValueHorizontal = parseFloat(sliderScrollHorizontal.value);
    x = scrollValueHorizontal * 10;
});

let sliderScrollVertical = document.getElementById("sliderScrollVertical");
sliderScrollVertical.max = 1.25;
let maxVertical = sliderScrollVertical.max;
let zoomValueVertical = 1.0;

sliderScrollVertical.addEventListener('input', () => {
    zoomValueVertical = parseFloat(sliderScrollVertical.value);
    y = zoomValueVertical * 10;

    //console.log("worldContainer.x: " + worldContainer.x);
    //console.log("worldContainer.y: " + worldContainer.y);

    //console.log("x: " + x);
    //console.log("y: " + y);

    //console.log("const1: " + const1);
    //console.log("const2: " + const2);
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
let worldHeight = 128 * cellSizeHAUTEUR //128 pour le nombre de touches du piano 6 octaves + 8 touches
//(yMax / screenHeight) * worldSize + screenHeight;
//  yMax = (max(scrollValueVertical) * 10)

const style = new PIXI.TextStyle({
    fontSize: 24,
    fill: 'red',
    wordWrap: true,
    wordWrapWidth: 200 // Limite la largeur du texte
});

const pianoContainer = new PIXI.Container({
    isRenderGroup: true,
});

app.stage.addChild(pianoContainer);

let longueurTouchesBlanches;


function drawPiano() {
    let piano = new PIXI.Graphics();
    let touchesNoires = new PIXI.Graphics();
    let k = 0;

    //entre2TouchesNoires est la hauteur d'une touche blanche située entre deux touches noires
    let entre2TouchesNoires = 2 * cellSizeHAUTEUR;

    longueurTouchesBlanches = 50;

    let nombreOctaves = 0;

    //positionToucheBlancheSuivante est la position de la prochaine touche blanche à dessiner
    let positionToucheBlancheSuivante = 0;
    for (let i = 0; i < 70; i++) {
        //ici on dessine les touches blanches qui sont entre deux touches noires 
        if (k == 1 || k == 2 || k == 5) {
            if (k == 1) {
                nombreOctaves++;
                console.log(" nombre d'octaves: " + nombreOctaves);

                // Créer le texte correctement
                let text = new PIXI.Text("C" + nombreOctaves, style); // Nouvelle syntaxe
                text.x = (piano.width - text.width) / 2;
                text.y = positionToucheBlancheSuivante + (piano.height - text.height) / 2 + cellSizeHAUTEUR / 4;
                
                console.log("text.text: " + text.text);

                // Ajouter le texte au pianoContainer
                pianoContainer.addChild(text);
                app.stage.addChild(pianoContainer);

            }
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
    pianoContainer.addChildAt(piano, 0);
}


//Fonction pour dessiner un piano


let signature = [3, 4];  //++++++++++++++++++++++++++++++++++++++++++++// Modifié


//Fonction pour dessiner la grille
function drawGrid(rows, cols, cellSizeHAUTEUR, cellSizeLARGEUR) {

    let grid = new PIXI.Graphics();
    grid.strokeStyle = "grey";

    for (let row = 0; row * cellSizeHAUTEUR <= worldHeight; row++) {
        grid.moveTo(0, row * cellSizeHAUTEUR);
        grid.lineTo(worldWidth, row * cellSizeHAUTEUR);
        grid.stroke({ color: "grey", pixelLine: true });
    }

    for (let col = 0; col * cellSizeLARGEUR <= worldWidth; col++) {
        //modifie l'épaisseur de la ligne pour les mesures
        if (col % signature[0] == 0) {
            grid.stroke({ color: "white", pixelLine: true });
        }
        else {
            grid.stroke({ color: "grey", pixelLine: true });
        }
        grid.moveTo(col * cellSizeLARGEUR, 0);
        grid.lineTo(col * cellSizeLARGEUR, worldHeight);

    }

    grid.interactive = true;

    grid.position.set(0, 0);

    worldContainer.addChild(grid);
}

//Element Curseur
//Mettre le curseur au niveau du piano par défaut
let curseur;
function drawCurseur() {
    curseur = new PIXI.Graphics();
    curseur.moveTo(longueurTouchesBlanches + 2, 1);
    curseur.lineTo(longueurTouchesBlanches + 2, worldHeight);
    curseur.stroke({ color: "red" });

    curseur.interactive = true;

    curseur.position.set(0, 0);

    worldContainer.addChild(curseur);

    // penser à faire s'arrêter le curseur quand on appuie sur le bouton play et quand on est au bout de la grille
    /*if (play) {
        app.ticker.add(() => {
            curseur.x += 1;
            if (curseur.x > worldWidth) {
                curseur.x = 300;
            }
        });
        playCurseur();
    }*/

}

function playCurseur() {
    app.ticker.add(() => {
        curseur.x += 1;
        if (curseur.x > worldWidth) {
            curseur.x = 300;
        }
    });


}


//Classe Note

class Note extends PIXI.Graphics {
    dragZone = new PIXI.Graphics();
    coteSelec = false;
    color = null;
    constructor(x, y, l, h, color) {
        super();
        this.color = color;
        this.rect(0, 1, l - 1, h - 1);
        this.fill(color);
        this.position.set(x, y);



        this.interactive = true;
        this.eventMode = 'static';
        this.hitArea = app.screen;

        this.cursor = 'pointer';

        this.creeDragZone(x, y, l, h);

        this.interactive = true;
        maRegion.push(this);

        //Test
        worldContainer.addChild(this);
        //app.stage.addChild(this);

        //Problème: Ne marche que dans la zone principale
        //On ne rentre pas dans onDragStart
        //lorsque la note sort du cadre elle n'est plus detectable
        this.on('pointerdown', onDragStart);
        //let draaagZone = this.dragZone;
        //draaagZone.on('pointerdown', this.width += 50);
    }

    /*coteDroitSelectionne(event) {
        console.log("côté droit sélectionné");
        this.width += 50;

        //this.coteSelec = this;//Ne sert à rien

        for (let i = 0; i < 4; i++) {
            elargirNote(i * 50, this);
        }

//DYSFONCTIONNEMENT

        //app.stage.on('pointermove',allongeNote(note,event));
    }*/



    //Idée pour élargir la note:
    // créer une zone de sélection sur le côté droit de la note (OK)
    // ondragstart sur cette zone appele la fonction coteDroitSelectionne(OK)
    // ondragmove sur cette zone appelle la fonction elargirNote 

    // coteDroitSelectionne indique que le coté droit de la note est sélectionné (en rouge)
    //plus tard on crée une fonction pour élargir la note en fonction de la position du curseur
    ///////////////////////////////////////////////////////////////////////////////////
    // 
    //Zone Créée 
    creeDragZone(noteX, noteY, noteWidth, noteHeight) {
        this.dragZone.rect(noteWidth - 10, 0, 10, noteHeight + 1);
        this.dragZone.fill("red");// la rendre invisible
        this.dragZone.position.set(x, y);

        this.dragZone.x = noteX;
        this.dragZone.y = noteY;
        this.dragZone.interactive = true;
        this.dragZone.cursor = "ew-resize"; // Curseur de redimensionnement
        worldContainer.addChild(this.dragZone);
    }
}

///////////////////////////////////////////////////////////////////////////////////

function elargirNote(newWidth, note) {
    if (newWidth > 50) { // Empêcher une largeur trop petite
        let h = note.height;
        let x = note.x;
        let y = note.y;
        note.clear();

        note.rect(0, 1, newWidth - 1, h);
        note.fill(note.color);
        note.position.set(x, y);
    }
}



//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//
//%%% Fonctions pour les évènements %%//
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%//

///////////////////////////////////
//Fonctions pour déplacer la note//
///////////////////////////////////

//DYSFONCTIONNEMENT
function allongeNote(note, event) {
    if (note) {
        newWidth = event.global.x - note.x;
        note.elargirNote(newWidth);
    }
    //let newWidth = event.data.global.x - note.x;
    //note.parent.toLocal(event.global, null, note.width);

}


function onDragStart(event) {
    // Est appelé à cette ligne là: note.on('pointerdown', onDragStart); dans onDoubleClick 
    // lors de la création de la note
    this.alpha = 0.5;
    dragTarget = this;
    console.log(" Detecte Evenement ");
    app.stage.on('pointermove', onDragMove);


}

function onDragMove(event) {
    if (dragTarget) {
        dragTarget.parent.toLocal(event.global, null, dragTarget.position);
        dragTarget.dragZone.parent.toLocal(event.global, null, dragTarget.dragZone.position);


        if (gridSnapping) {
            dragTarget.x = Math.floor(dragTarget.x / cellSizeLARGEUR) * cellSizeLARGEUR;
            dragTarget.y = Math.floor(dragTarget.y / cellSizeHAUTEUR) * cellSizeHAUTEUR;

            dragTarget.dragZone.x = Math.floor(dragTarget.dragZone.x / cellSizeLARGEUR) * cellSizeLARGEUR;
            dragTarget.dragZone.y = Math.floor(dragTarget.dragZone.y / cellSizeHAUTEUR) * cellSizeHAUTEUR;
        }
        dragTarget.eventMode = 'static';
    }
}

function onDragEnd(event) {
    if (dragTarget) {
        app.stage.off('pointermove', onDragMove);
        dragTarget.alpha = 1;
        dragTarget = null;

        //Test
        //dragTarget.on('pointerdown', onDragStart);
        //
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

    //mousePos.x /= app.stage.scale.x;
    //mousePos.y /= app.stage.scale.y;

    mousePos.x /= worldContainer.scale.x;
    mousePos.y /= worldContainer.scale.y;

    if (gridSnapping) {
        mousePos.x = Math.floor((mousePos.x + const1) / cellSizeLARGEUR) * cellSizeLARGEUR;
        mousePos.y = Math.floor((mousePos.y + const2) / cellSizeHAUTEUR) * cellSizeHAUTEUR;
    }

    let note = new Note(mousePos.x, mousePos.y, cellSizeLARGEUR, cellSizeHAUTEUR, "blue");
    note.eventMode = 'static';
    note.on('pointerdown', onDragStart);
    elementsDeEditor.push(note);

}



//Classe Editor

class Editor {
    listDeRegions = [];
    constructor() {
        console.log("Editor constructor");
        drawGrid(5, 10, cellSizeHAUTEUR, cellSizeLARGEUR);
        drawPiano();
        drawCurseur();

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
        return note;

    }

    //méthode pour zoomer sur la grille
    zoom(hauteur, largeur) {
        worldContainer.scale.set(hauteur, largeur);
        pianoContainer.scale.set(1, largeur);
    }

    //méthode pour allonger la durée d'une note
    allongeNote() {
        //à faire
    }

}

let playButton = document.getElementById("play");


let isPlaying = false; // Variable qui stocke l'état du bouton

//document.getElementById("sliderZoomVertical").max = 1.25;


function init() {
    let sliderZoomHorizontal = document.getElementById("sliderZoomHorizontal");
    let sliderZoomVertical = document.getElementById("sliderZoomVertical");

    let zoomValueHorizontal = 1.0;
    let zoomValueVertical = 1.0;

    sliderZoomHorizontal
        .addEventListener("input", () => {
            zoomValueHorizontal = parseFloat(sliderZoomHorizontal.value);
            monEditor.zoom(zoomValueHorizontal, zoomValueVertical);
            document.querySelector("#scaleXValue").textContent = zoomValueHorizontal;
        });

    sliderZoomVertical
        .addEventListener("input", () => {
            zoomValueVertical = parseFloat(sliderZoomVertical.value);
            monEditor.zoom(zoomValueHorizontal, zoomValueVertical);
            // On affiche la nouvelle valeur
            document.querySelector("#scaleYValue").textContent = zoomValueVertical;
        });

    playButton.addEventListener("click", () => {
        isPlaying = !isPlaying; // Bascule entre Play et Pause

        // Change le texte du bouton en fonction de l'état
        playButton.textContent = isPlaying ? "⏸ Pause" : "▶ Play";

        if (isPlaying) {
            playCurseur();
        } else {
            app.ticker.stop();
            //isPlaying = false;
        }

        console.log("État du bouton Play:", isPlaying); // Debug: voir l'état dans la console
    });



    monEditor = new Editor();
    let note1 = monEditor.creeNote(300, 125, true);
    elargirNote(300, note1);
    let note2 = monEditor.creeNote(625, 200, false);
}

window.onload = init;