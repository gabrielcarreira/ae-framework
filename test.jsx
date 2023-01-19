//@include 'framework.jsx'

app.beginUndoGroup('Framework Test')
testLib()
app.endUndoGroup()

function testLib() {
  const frame = new getFrame()

  //applyFFXExpression('test.ffx', 'wiggle(1, effect("Test (Name)")(1))')
  setProperty(frame.sel, 'pos.expression', 'wiggle(1, 20)')
  setProperty(frame.sel, 'rot.expression', 'wiggle(1, 10)')

  setMethod(frame.sel, 'sca', 'setValueAtTime', [0, [0, 0]])
  setMethod(frame.sel, 'sca', 'setValueAtTime', [1, [100, 100]])
  var ease = new KeyframeEase(0, 80)
  var easeScale = [ease, ease, ease]
  setMethod(frame.sel, 'sca', 'setTemporalEaseAtKey', [2, easeScale, easeScale])

  offsetLayers(frame.select, 4, 'convex')
}
