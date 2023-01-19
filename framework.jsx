function getFrame() {
  var comp = app.project.activeItem
  var select = comp.selectedLayers

  var sel = []
  for (var i = 0; i < select.length; i++) {
    sel.push({
      pos: select[i].transform.position,
      rot: select[i].transform.rotation,
      sca: select[i].transform.scale,
      opa: select[i].transform.opacity,
      anc: select[i].transform.anchorPoint
    })
  }

  const obj = {
    comp: comp,
    select: select,
    sel: sel
  }

  return obj
}

function changeName(lays, base, init, count) {
  if (init == undefined) init = 1
  if (count == undefined) count = 1
  for (var i = 0; i < lays.length; i++) {
    lays[i].name = base + ' ' + (count * i + init)
  }
}

/**
 * setProperty function
 *
 * @param {Array} layers - An array of layers to apply the property value
 * @param {String} propertyPath - The property path to access the property, for example "transform.position"
 * @param {Any} value - The value to be set to the property
 */
function setProperty(layers, propertyPath, value) {
  if (layers.constructor !== Array) {
    throw new Error('Expected first parameter to be an array of layers')
  }
  if (typeof propertyPath !== 'string') {
    throw new Error(
      'Expected second parameter to be a string representing the property path'
    )
  }
  const properties = propertyPath.split('.')
  for (var i = 0; i < layers.length; i++) {
    var obj = layers[i]
    for (var j = 0; j < properties.length - 1; j++) {
      obj = obj[properties[j]]
    }
    obj[properties[properties.length - 1]] = value
  }
}

/**
 * setMethod function
 *
 * @param {Array} layers - An array of layers to apply the method
 * @param {String} propertyPath - The property path to access the property containing the method, for example "transform.scale"
 * @param {String} methodName - The method name to be called, for example "setValueAtTime"
 * @param {Array} args - An array of arguments to be passed to the method
 */
function setMethod(layers, propertyPath, methodName, args) {
  if (layers.constructor !== Array) {
    throw new Error('Expected first parameter to be an array of layers')
  }
  if (typeof propertyPath !== 'string') {
    throw new Error(
      'Expected second parameter to be a string representing the property path'
    )
  }
  if (typeof methodName !== 'string') {
    throw new Error(
      'Expected third parameter to be a string representing the method name'
    )
  }
  if (args.constructor !== Array) {
    throw new Error('Expected fourth parameter to be an array of arguments')
  }
  const properties = propertyPath.split('.')
  for (var i = 0; i < layers.length; i++) {
    var obj = layers[i]
    for (var j = 0; j < properties.length; j++) {
      obj = obj[properties[j]]
    }
    obj[methodName].apply(obj, args)
  }
}
/**
 * Apply preset and expressions in selected properties
 * @param {string} preset - path of the preset
 * @param {string} exp - expression to be applied
 */
function applyFFXExpression(preset, exp) {
  var comp = app.project.activeItem
  var selected = comp.selectedLayers
  var presetLayers = [],
    propLayers = [],
    propNames = []
  var ind, numProps
  for (var i = 0; i < selected.length; i++) {
    var prop = selected[i].selectedProperties
    for (var j = 0; j < prop.length; j++) {
      var myProperty = prop[j]
      var myLayer = myProperty.propertyGroup(myProperty.propertyDepth)
      if (prop[j].value != undefined && myLayer.index == selected[i].index) {
        var propName = prop[j].name
        var propExp = exp
        prop[j].expression = propExp.replace(/Name/g, propName)
        propNames.push(propName)
      }
    }
    ind = selected[i].index
    numProps = selected[i].property('ADBE Effect Parade').numProperties
    propLayers.push(ind, numProps, propNames)
    presetLayers.push(propLayers)
    propLayers = []
    propNames = []
  }

  for (var k = 0; k < selected.length; k++) {
    selected[k].selected = false
  }

  var presetPath = getPath(preset)
  for (var j = 0; j < presetLayers.length; j++) {
    var layInd = presetLayers[j]
    var lay = comp.layer(layInd[0])
    var localProps = presetLayers[j][2]
    for (var l = 0; l < localProps.length; l++) {
      lay.selected = true
      comp.applyPreset(presetPath)
      var propAdd = lay
        .property('ADBE Effect Parade')
        .property(layInd[1] + l + 1)
      propAdd.selected = false
      propAdd.name = propAdd.name.replace(/Name/g, localProps[l])
      lay.selected = false
    }
  }
}

/**
 * Get the path of the preset
 * @param {string} presetName - name of the preset
 * @return {string} path of the preset
 */
function getPath(presetName) {
  var folderObj = new Folder(
    new File($.fileName).parent.fsName + '/' + presetName
  )
  return folderObj
}


/**
 * offsetLayers function
 *
 * @param {Array} layers - An array of layers to offset
 * @param {Number} delay - The delay in seconds between each layer
 * @param {String} mode - The offset mode: 'normal', 'reverse', 'center', 'top', 'bottom' or 'random'
 */
function offsetLayers(layers, delay, mode) {
  var comp = app.project.activeItem;
  var offset = delay * comp.frameDuration;

  switch (mode) {
      case "normal":
          for (var i = 0; i < layers.length; i++) {
              layers[i].startTime += offset * i;
          }
          break;
      case "reverse":
          for (var i = 0; i < layers.length; i++) {
              layers[i].startTime += offset * (layers.length - (i + 1));
          }
          break;
      case "center":
          var mid = layers.length / 2;
          for (var i = 0; i < layers.length; i++) {
              layers[i].startTime += offset * (i - mid);
          }
          break;
      case "top":
          var half = layers.length / 2;
          for (var i = 0; i < half; i++) {
              layers[i].startTime += offset * i;
          }
          for (var i = half; i < layers.length; i++) {
              layers[i].startTime += offset * (layers.length - (i + 1));
          }
          break;
      case "bottom":
          var half = layers.length / 2;
          for (var i = 0; i < half; i++) {
              layers[i].startTime += offset * (layers.length - (i + 1));
          }
          for (var i = half; i < layers.length; i++) {
              layers[i].startTime += offset * i;
          }
          break;
      case "random":
          var randomOffsets = [];
          for (var i = 0; i < layers.length; i++) {
              randomOffsets.push(Math.random() * offset);
          }
          randomOffsets.sort();
          for (var i = 0; i < layers.length; i++) {
              layers[i].startTime += randomOffsets[i];
          }
          break;
      default:
          throw new Error("Invalid offset mode: " + mode);
  }
}
