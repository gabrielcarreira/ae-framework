function getFrame() {
  var comp = app.project.activeItem;
  var select = comp.selectedLayers;

  var sel = [],
    selPos = [];
  for (var i = 0; i < select.length; i++) {
    sel.push({
      pos: select[i].transform.position,
      rot: select[i].transform.rotation,
      sca: select[i].transform.scale,
      opa: select[i].transform.opacity,
      anc: select[i].transform.anchorPoint,
    });
    selPos.push(select[i].transform.position);
  }

  const obj = {
    comp: comp,
    select: select,
    sel: sel,
    selPos: selPos,
  };

  return obj;
}

function changeName(lays, base, init, count) {
  if (init == undefined) init = 1;
  if (count == undefined) count = 1;
  for (var i = 0; i < lays.length; i++) {
    lays[i].name = base + " " + (count * i + init);
  }
}

function setProp(lays, prop, val) {
  const props = prop.split(".");
  for (var i = 0; i < lays.length; i++) {
    var obj = lays[i];
    for (var j = 0; j < props.length-1; j++) {
        obj = obj[props[j]];
    }
    obj[props[props.length-1]] = val;
  }
}


function setMethod(lays, prop, method, val) {
  const props = prop.split(".");
  var obj = {};
  for (var i = 0; i < lays.length; i++) {
    obj = lays[i];
    for (var j = 0; j < props.length; j++) {
      obj = obj[props[j]];
    }
    try {
      obj[method].apply(obj, val);
    } catch (e) {
      alert(e);
    }
  }
}

function applyExpression(preset, exp) {
  var comp = app.project.activeItem;
  var selected = comp.selectedLayers;
  var presetLayers = [],
    propLayers = [],
    propNames = [];
  var ind, numProps;
  for (var i = 0; i < selected.length; i++) {
    var prop = selected[i].selectedProperties;
    for (var j = 0; j < prop.length; j++) {
      var myProperty = prop[j];
      var myLayer = myProperty.propertyGroup(myProperty.propertyDepth);
      if (prop[j].value != undefined && myLayer.index == selected[i].index) {
        var propName = prop[j].name;
        var propExp = exp;
        prop[j].expression = propExp.replace(/Name/g, propName);
        propNames.push(propName);
      }
    }
    ind = selected[i].index;
    numProps = selected[i].property("ADBE Effect Parade").numProperties;
    propLayers.push(ind, numProps, propNames);
    presetLayers.push(propLayers);
    propLayers = [];
    propNames = [];
  }

  for (var k = 0; k < selected.length; k++) {
    selected[k].selected = false;
  }

  var presetPath = getPath(preset);
  for (var j = 0; j < presetLayers.length; j++) {
    var layInd = presetLayers[j];
    var lay = comp.layer(layInd[0]);
    var localProps = presetLayers[j][2];
    for (var l = 0; l < localProps.length; l++) {
      lay.selected = true;
      comp.applyPreset(presetPath);
      var propAdd = lay
        .property("ADBE Effect Parade")
        .property(layInd[1] + l + 1);
      propAdd.selected = false;
      propAdd.name = propAdd.name.replace(/Name/g, localProps[l]);
      lay.selected = false;
    }
  }
}

function getPath(presetName) {
  var folderObj = new Folder(new File($.fileName).parent.fsName + presetName);
  return folderObj;
}
