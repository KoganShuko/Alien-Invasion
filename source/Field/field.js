import * as rocketLauncherSVG from '../pics/rocketLauncher.svg';

class createField {
  constructor() {
    this.field = $('<div>')
      .addClass('main-field');
    this.fieldContent = $('<div>')
      .addClass('main-field__content')
      .appendTo(this.field);

    const canvas = Snap(0, 0); // for path drawing and create rocket's animation
    canvas
      .attr({
        id: 'canvas',
      })
      .addClass('canvas');
    $('#canvas')
      .appendTo(this.fieldContent);

    this.createRocketLauncherSVG('13%', '87%', 1);
    this.createRocketLauncherSVG('30%', '87%', 2);
    this.createRocketLauncherSVG('70%', '85%', 3);
    this.createRocketLauncherSVG('85%', '86%', 4);

    const gunContainer = $('<div>')
      .css({
        height: '10%',
        width: '10%',
        position: 'absolute',
        left: '50%',
        top: '77%',
        transform: 'translateX(-50%)',
      })
      .appendTo(this.fieldContent);
    const gunBody = $('<div>')
      .css({
        height: '50%',
        width: '100%',
        position: 'absolute',
        left: '50%',
        bottom: '0%',
        transform: 'translateX(-50%)',
        border: '1px solid black',
        'border-top-left-radius': '50%',
        'border-top-right-radius': '50%',
        'z-index': 5,
        'background-color': 'white',
      })
      .appendTo(gunContainer);
    const gun = $('<div>').css({
      height: '80%',
      width: '20%',
      position: 'absolute',
      left: '50%',
      bottom: '20%',
      border: '1px solid black',
      transform: 'translateX(-50%)',
      'border-top-left-radius': '50%',
      'border-top-right-radius': '50%',
      'z-index': '-1',
      'background-color': 'white',
    })
      .attr({
        id: 'machineGun',
      })
      .appendTo(gunContainer);


  }

  createRocketLauncherSVG(left, top, id) {
    $(rocketLauncherSVG)
      .css({
        position: 'absolute',
        left,
        top,
      })
      .attr({
        id: `launcher${id}`,
        width: '3%', // need both width and heigth for ie
        height: '8%',
      })
      .appendTo(this.fieldContent);
  }

  appendTo(containerTag) {
    this.field.appendTo(containerTag);
  }
}

export default createField;
