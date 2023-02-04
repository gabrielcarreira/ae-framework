//@include 'framework.jsx'
 
app.beginUndoGroup('Framework Test')
testLib()
app.endUndoGroup()

function testLib() {
  const frame = new getFrame()

  changeAnchorPoint(frame.select, 0, 0)
  //applyFFXExpression('test.ffx', 'wiggle(1, effect("Test (Name)")(1))')
  setProperty(frame.sel, 'pos.expression', 'wiggle(0.5, 10)')
  setProperty(frame.sel, 'rot.expression', 'wiggle(0.5, 5)')

  setMethod(frame.sel, 'sca', 'setValueAtTime', [0, [0, 0]])
  setMethod(frame.sel, 'sca', 'setValueAtTime', [1, [100, 100]])
  setMethod(frame.sel, 'rot', 'setValueAtTime', [0, -180])
  setMethod(frame.sel, 'rot', 'setValueAtTime', [1, 0])
  var ease = new KeyframeEase(0, 80)
  var easeScale = [ease, ease, ease]
  setMethod(frame.sel, 'sca', 'setTemporalEaseAtKey', [2, easeScale, easeScale])
  setMethod(frame.sel, 'rot', 'setTemporalEaseAtKey', [2, [ease], [ease]])

  offsetLayers(frame.select, 6, 'convex')
}
