
initGame();

const musicToWin = ['C3;1','H2;1', 'C3;2']
// 'G2;2','E2;2','C2;2','D2;1','E2;1','G2;4']
// const musicToWin = ['C2;2','E2;2', 'G2;2', 'E2;2', 'C2;4', 'C3;4']


var musicCreated = new Map();



function initGame() {
    const numberOfTactsInGame = 2
    const numberOfTactTimeBoxesInGame = 8
    // Your game can start here, but define separate functions, don't write everything in here :)
    printKey();
    printMetrum();
    for (let j = 1; j <= numberOfTactsInGame; j++){

        printTact(j)
        printTactSeparator()
    }
    printTactSeparator()
    for (let i = 1; i <= numberOfTactTimeBoxesInGame; i++){

        printBlockNodeHolder(i);
    
    }


    printOnePart();
    printNodes();
    initDragAndDrop();
    piano();
}

function initDragAndDrop(){

    $('.node').on('dragstart', startDrag);
    

    $('.line').on('dragover', allowDrop);   
    $('.line').on('dragenter', dragEnter);
    $('.line').on('dragleave', dragLeave);
    $('.line').on('drop', drop);

    $('.line').on('click', deleteNode)

    $('#checkBox').on('click', jsMusicPlay)
}

function logMapElements(value, key, map) {
    console.log(`m[${key}] = ${value}`);
  }

function checkMap(){
    var sortedOrder = Array();
    musicCreated.forEach(logMapElements);
    Array.from(musicCreated.keys()).sort().forEach(function(key, e){
        console.log(key)
        
        sortedOrder.push(musicCreated.get(key))
        
    })
    console.log(sortedOrder)
    return musicToWin.every((val, i) => val === sortedOrder[i])
    
}

function jsMusicPlay(){

    const player = new SimplePlayer();
    const sequenceParser = new SequenceParser(128, [2, 4]);
    player.play(sequenceParser.parse([
        'C3/8 B2/8 C3/4',
        'G2/4 E2/4',
        'C2/4 D2/8 E2/8',
        'G2/2',

        'C2/4 E2/4',
        'G2/4 E2/4',
        'C2/2',
        'C3/2',


    ]));
    
}


function allowDrop(event){

    event.preventDefault();

}

function dragEnter(event){
    console.log('enter',event);
    event.target.style.backgroundColor='lightgreen';

}

function dragLeave(event){
    console.log('leave',event);
    event.target.style.backgroundColor='';
}



function startDrag(event){
    console.log('dragging',event);

    
    event.originalEvent.dataTransfer.setData('text', event.currentTarget.innerHTML);
    console.log(event.originalEvent.dataTransfer.getData('text'))

}

function dragOver(event){

    console.log('dragover',event);
}

function drop(event){
    playKey(event)
    console.log('drop',event);
    console.log(event.originalEvent.dataTransfer.getData('text'));
    var node = event.originalEvent.dataTransfer.getData('text');
    var x = $(node).appendTo(event.currentTarget)
    x.addClass('onStaff')
    
    
    console.log(nodeRegister(event))
    disableDrag($(event.currentTarget).first().parent().children())
    
    var currentParent = $(event.currentTarget).first().parent()
    for (let i = 1; i<nodeLenght(event); i++){

        disableDrag(currentParent.next().children())
        currentParent = currentParent.next()

    }
    
    event.target.style.backgroundColor='green'
    musicCreated.set(nodeTact(event)+nodeInTact(event), `${nodeRegister(event)};${nodeLenght(event)}`)
    if (checkMap()) alert('YOU WON!')
}

function nodeInTact(event){

   var node = $(event.currentTarget).first().parent().attr('class')[12];
   return node
}

function nodeRegister(event){

    var node = $(event.currentTarget).data('pitch')
    return node
}

function nodeLenght(event){

    var node = $(event.currentTarget).children().data('lenght')
    return node
}

function nodeTact(event){

    var node = $(event.currentTarget).first().parent().parent().attr('class')[5];
    return node

}

function disableDrag(elementArray){

    elementArray.removeClass('line')
    elementArray.addClass('lineOcupied')
    elementArray.off('drop');
    elementArray.off('leave');
    elementArray.off('dragenter');

}

function enableDrag(elementArray){

    elementArray.removeClass('lineOcupied')
    elementArray.addClass('line')
    elementArray.on('drop', drop);
    
    elementArray.on('dragenter', dragEnter);

}

function deleteNode(event){
    if(event.currentTarget.children.length==0)return
    console.log('delete',event);
    // var nodeLenght = $(event.currentTarget).children('img').data('lenght')

    event.currentTarget.style.backgroundColor='';
    enableDrag($(event.currentTarget).first().parent().children())

    var currentParent = $(event.currentTarget).first().parent()
    console.log(currentParent)
    for (let i = 1; i<nodeLenght(event); i++){

        enableDrag(currentParent.next().children())
        currentParent = currentParent.next()

    }
    console.log(nodeLenght(event))
    $(event.currentTarget).empty();
    
    musicCreated.delete(nodeTact(event)+nodeInTact(event))
    console.log(musicCreated)

    

}

function printOnePart(){
    
    $('.tactTimeBox').append('<div class="line betweenLine" data-pitch="A3"></div>');
    $('.tactTimeBox').append('<div class="line betweenLine" data-pitch="G3"></div>');
    $('.tactTimeBox').append('<div class="line crossLine" data-pitch="F3"></div>');
    $('.tactTimeBox').append('<div data-key="186" class="line betweenLine" data-pitch="E3"></div>');
    $('.tactTimeBox').append('<div data-key="76" class="line crossLine" data-pitch="D3"></div>');
    $('.tactTimeBox').append('<div data-key="75" class="line betweenLine" data-pitch="C3"></div>');
    $('.tactTimeBox').append('<div data-key="74" class="line crossLine" data-pitch="H2"></div>');
    $('.tactTimeBox').append('<div data-key="72" class="line betweenLine" data-pitch="A2"></div>');
    $('.tactTimeBox').append('<div data-key="71" class="line crossLine" data-pitch="G2"></div>');
    $('.tactTimeBox').append('<div data-key="70" class="line betweenLine" data-pitch="F2"></div>');
    $('.tactTimeBox').append('<div data-key="68" class="line crossLine" data-pitch="E2"></div>');
    $('.tactTimeBox').append('<div data-key="83" class="line betweenLine" data-pitch="D2"></div>');
    $('.tactTimeBox').append('<div data-key="65" class="line overLine" data-pitch="C2"></div>');    
}

function printBlockNodeHolder(timeInTact){

    $('.tact').append('<div class="tactTimeBox '+timeInTact+'"></div>');
    
}

function printTact(tactNumber){
    $('#mainStaffContainer').append('<div class="tact '+tactNumber+'"></div>');
}

function printTactSeparator(){
    $('#mainStaffContainer').append('<div class="tactSeparator"></div>');
}

function printKey(){
    $('#mainStaffContainer').append('<div class="violin img"></div>');
}

function printMetrum(){
    $('#mainStaffContainer').append('<div class="metrum value"></div>');
}

function printNodes(){
    $('#nodesContainer').append('<div class="node minim" draggable="true"> <img data-lenght="4" src="imgs/nodeMinim.png")> </div>');
    $('#nodesContainer').append('<div class="node crotchet" draggable="true"><img data-lenght="2" src="imgs/nodeCrotchet.png")> </div>');
    $('#nodesContainer').append('<div class="node eight" draggable="true"> <img data-lenght="1" src="imgs/nodeEight.png")> </div>');
}



function playKey(event){
    var dataKey = $(event.currentTarget).data('key');
    console.log(dataKey)
    playNoteStaff(dataKey)
}

function playNoteStaff(e) {
    const staffNote = $(".nowplaying"),
     audio = $(`audio[data-key="${e}"]`),
        key = $(`.key[data-key="${e}"]`);
    
    if (!key) return;

    const keyNote = key.data('note')
    
    key.addClass("playing");
    // console.log(staffNote)
    staffNote.html(`${keyNote}`);
    
    // console.log(audio);
    audio[0].play();
    }




function piano(){
        const keys = document.querySelectorAll(".key"),
    note = document.querySelector(".nowplaying"),
    hints = document.querySelectorAll(".hints");

    function playNote(e) {
    const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`),
        key = document.querySelector(`.key[data-key="${e.keyCode}"]`);

    if (!key) return;

    const keyNote = key.getAttribute("data-note");
    
    key.classList.add("playing");
    note.innerHTML = keyNote;
    
    audio.currentTime = 0;
    audio.play();
    }

    function removeTransition(e) {
    if (e.propertyName !== "transform") return;
    this.classList.remove("playing");
    }

    function hintsOn(e, index) {
    e.setAttribute("style", "transition-delay:" + index * 50 + "ms");
    }

    hints.forEach(hintsOn);

    keys.forEach(key => key.addEventListener("transitionend", removeTransition));

    window.addEventListener("keydown", playNote);


}

class SimplePlayer {
    constructor () {
        this.synth = new Tone.Synth().toMaster();
    }

    /**
     * If the given event has new tempo and/or time signatures, apply them to the Transport immediately.
     * @param {SequenceEvent} event 
     * @param {boolean} ramp If true, tempo will ramp up/down to the given value over 1 second,
     *     otherwise it will change instantly.
     */
    applyEventUpdates (event, ramp) {
        if (event.newTempo && event.newTempo.unit === 'bpm') {
            if (ramp) {
                Tone.Transport.bpm.rampTo(event.newTempo.value, 1);
            } else {
                Tone.Transport.bpm.value = event.newTempo.value;
            }
        }

        if (event.newTimeSignature) {
            Tone.Transport.timeSignature = [
                event.newTimeSignature.numerator,
                event.newTimeSignature.denominator
            ];
        }
    }

    /**
     * Use Tone.js Transport to play a series of notes encoded by the event list passed in input,
     * using the default ugly synthetic membrane sound.
     * @param {SequenceEvent[]} track 
     */
    play (track) {
        const synth = this.synth;

        // We will use the Transport to schedule each measure independently. Given that we
        // inform Tone.js of the current tempo and time signature, the Transport will be
        // able to automatically interpret all measures and note durations as absolute
        // time events in seconds without us actually bothering
        let measureCounter = 0;
        let firstEvent = true;

        // Stop, rewind and clear all events from the transport (from previous plays)
        Tone.Transport.stop();
        Tone.Transport.position = 0;
        Tone.Transport.cancel();
        
        for (const event of track) {
            // The first event is always supposed to have new tempo and time signature info
            // so we should update the Transport appropriately
            if (firstEvent) {
                this.applyEventUpdates(event, false);
                firstEvent = false;
            }

            // In the following callback, "time" represents the absolute time in seconds
            // that the measure we are scheduling is expected to begin at, given the current
            // tempo and time signature assigned to the Transport
            Tone.Transport.schedule((time) => {
                // Change the tempo if this event has a new tempo. Also do the same if a new time signatue is issued
                this.applyEventUpdates(event, true);

                // This contains the relative time of notes with respect to the
                // start of the current measure, in seconds
                let relativeTime = 0;

                for (const note of event.measure.notes) {
                    const duration = note.duration;

                    // If this is an actual note (as opposed to a rest), schedule the
                    // corresponding sound to be played along the Transport timeline
                    // after the previous notes in the measure have been played (hence the relativeTime)
                    if (note.type === 'note') {
                        synth.triggerAttackRelease(note.name, note.duration, time + relativeTime);
                    }

                    // This is used to delay notes that come next by the correct amount
                    relativeTime += Tone.Time(duration).toSeconds();

                }
            }, `${measureCounter}m`);

            measureCounter++;
        }
        
        Tone.Transport.start();
    }
}


class SequenceParser {
    constructor (tempoBpm, timeSignatureArray) {
        this.initialTempo = { value: tempoBpm, unit: 'bpm' };
        this.initialTimeSignature = { numerator: timeSignatureArray[0], denominator: timeSignatureArray[1] };
    }

    parse (textMeasures) {
        const result = [];
        let firstEvent = true;

        for (const textMeasure of textMeasures) {
            const event = { };

            if (firstEvent) {
                event.newTempo = this.initialTempo;
                event.newTimeSignature = this.initialTimeSignature;
                firstEvent = false;
            }

            event.measure = this.parseTextMeasure(textMeasure);
            result.push(event);
        }

        return result;
    }

    parseTextMeasure (textMeasure) {
        const notes = textMeasure.split(' ')
            .filter(textNote => !!textNote)
            .map(textNote => this.parseTextNote(textNote));

        return { notes };
    }

    parseTextNote (textNote) {
        const chunks = textNote.split('/');
        const isNote = (chunks[0] !== 'rest');
        return {
            type: isNote ? 'note' : 'rest',
            name: isNote ? chunks[0] : null,
            duration: chunks[1] + 'n'
        };
    }
}