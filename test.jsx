//@include 'framework.jsx'

testLib();

function testLib() {
  const frame = new getFrame();

  changeName(frame.select, 'frame');
  frame.selPos[1].setValue([0, 0]);
  setExpression(frame.selPos, 'opa');
}
