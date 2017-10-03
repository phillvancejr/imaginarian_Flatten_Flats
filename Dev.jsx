#target photoshop
#include '~/JSXlib/devLib.jsx'

//DEBUG
try {

var doc = app.activeDocument
var selection = doc.selection

//IF THERE IS A FLATS GROUP SELCTED
if(doc.activeLayer.name == 'FLATS' && doc.activeLayer.typename == 'LayerSet') {
  //STORE FLATS GROUP
  var flatGroup = doc.activeLayer

  //MAKE CHANNEL MASKS
  for(var i = 0; i < flatGroup.artLayers.length; i ++) {
    //SELECT LAYER
    doc.activeLayer = flatGroup.artLayers[i]
    //MAGIC SELECT
    magicSelect()
    //SAVE SELECTION
    var newChannel = doc.channels.add()
    //COPY LAYER NAME TO CHANNEL NAME
    newChannel.name = flatGroup.artLayers[i].name
    //STORE SELECTION IN CHANNEL
    selection.store(newChannel)
    //IF AT LAST LAYER
    if(flatGroup.artLayers[i] == flatGroup.artLayers[flatGroup.artLayers.length - 1]) {
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
  //DUPLICATE FLAT GROUP
  var flatLayer = flatGroup.duplicate()
  //FLATTEN
  flatLayer = flatLayer.merge()
  //CHANGE NAME TO FLATS
  flatLayer.name = 'FLATS'
  //SELECT FLATS LAYER
  doc.activeLayer = flatLayer

//IF THERE IS NO FLATS GROUP SELECTED
} else {alert("No \"FLATS\" group could be found, you should place your layers in a group named \"FLATS\" and select it before running the script")}


} catch(Error) {debug(Error)}


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
