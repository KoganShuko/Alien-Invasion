import ControlPanel from '../ControlPanlel/controlPanel';

class StartScreen {
  constructor() {
    this.startScreen = $('<div>').addClass('startScreen');
    this.contentContainer = $('<div>').addClass('startScreen__container')
      .appendTo(this.startScreen);
    const buttonContainer = $('<div>').addClass('button__container')
      .appendTo(this.contentContainer);
    this.buttonStart = $('<button>').addClass('startScreen__button start-button').html('Start')
      .appendTo(buttonContainer);
    this.buttonControl = $('<button>').addClass('startScreen__button control-button').html('Controls')
      .appendTo(buttonContainer);
    this.title = $('<div>').addClass('startScreen__title').html('ALIENS')
      .appendTo(this.contentContainer);

    $(this.buttonStart).on('mousedown', (event) => {
      event.preventDefault();
    });
    $(this.buttonControl).on('mousedown', (event) => {
      event.preventDefault();
    });

    const controlPanel = new ControlPanel({
      container: this.contentContainer, // control panel container
      button: this.buttonControl, // control panel activation button
    });
    return this;
  }

  appendTo = (containerTag) => {
    this.startScreen.appendTo(containerTag);
  }

  startGame = async () => {
    await new Promise((res) => {
      $(this.buttonStart).on('click', () => {
        res();
      });
    });
    await $(this.startScreen).animate({
      opacity: 0,
    }, 500).promise();
    $(this.startScreen).remove();
  }
}
export default StartScreen;
