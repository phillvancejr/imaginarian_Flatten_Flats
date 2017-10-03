/** Copyright Phill Vance 'The Imaginarian' 2017
*** imaginarian_Flatten_Flats ***/

#target photoshop

var doc = app.activeDocument
var selection = doc.selection

//IF THERE IS A FLATS GROUP SELCTED
if(doc.activeLayer.name == 'FLATS' && doc.activeLayer.typename == 'LayerSet') {
  //STORE FLATS GROUP AS A DUPLICATE
  var flatGroup = doc.activeLayer.duplicate()

  //CLEAN MASKS BY DELETING LAYERS ABOVE
  //FOR EACH LAYER LOOP BACKWARDS 'UP LAYER STACK'
  for(var i = flatGroup.artLayers.length - 1; i > -1 ; i--) {
    //LOOP THROW OTHER LAYERS BACKWARDS 'UP LAYER STACK'
    for(var j = i-1; j > -1 ; j--) {
      //SELECT NEXT LAYER UP
      doc.activeLayer = flatGroup.artLayers[j]
      //MAGIC SELECT
      magicSelect()
      //SELECT WORKING LAYER
      doc.activeLayer = flatGroup.artLayers[i]
      //DELETE SELECTED
      selection.clear()
    }
    //DESELECT
    selection.deselect()
  }

  //MAKE CHANNEL MASKS
  for(var k = 0; k < flatGroup.artLayers.length; k ++) {
    //SELECT LAYER
    doc.activeLayer = flatGroup.artLayers[k]
    //MAGIC SELECT
    magicSelect()
    //SAVE SELECTION
    var newChannel = doc.channels.add()
    //COPY LAYER NAME TO CHANNEL NAME
    newChannel.name = flatGroup.artLayers[k].name
    //STORE SELECTION IN CHANNEL
    selection.store(newChannel)
    //IF AT LAST LAYER
    if(flatGroup.artLayers[k] == flatGroup.artLayers[flatGroup.artLayers.length - 1]) {
      //GET COLOR MODE
      var colorMode = doc.mode.toString().replace(/DocumentMode./, "")
      //TURN ON COLOR MODE CHANNELS
      toggleChannels(colorMode, true)
      //TURN OFF LAST ADDED CHANNEL
      newChannel.visible = false
      //DESELECT
      selection.deselect()
    }
  }

  //CREATE COMBINED FLATS LAYER
  flatLayer = flatGroup.merge()
  //CHANGE NAME TO FLATS
  flatLayer.name = 'FLATS'
  //SELECT FLATS LAYER
  doc.activeLayer = flatLayer

  //ALERT
  alert('Flat Layer created successfully')

//IF THERE IS NO FLATS GROUP SELECTED
} else {alert("No \"FLATS\" group could be found, you should place your layers in a group named \"FLATS\" and select it before running the script")}


//FUNCTIONS
function magicSelect() {
  selection.select([[0, 0], [1, 0], [1, 1], [0, 1]], SelectionType.REPLACE);
  selection.grow(0, true);
  selection.invert();
}

function toggleChannels (mode, bool) {
  if(mode == 'CMYK') {
    doc.channels.getByName('Cyan').visible = bool
    doc.channels.getByName('Magenta').visible = bool
    doc.channels.getByName('Yellow').visible = bool
    doc.channels.getByName('Black').visible = bool
  } else if(mode == 'RGB') {
    doc.channels.getByName('Red').visible = bool
    doc.channels.getByName('Green').visible = bool
    doc.channels.getByName('Blue').visible = bool
  } else {
    $.writeln('2 parameters required: color mode, visibility bool')
  }
}
