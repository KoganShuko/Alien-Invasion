import monsterExport from '../Monsters/monsters';
import firstSceneCharacters from './firstSceneCharacters';

const { Monster } = monsterExport;
const monstersPromise = [];

const monstersCoordsX = ['20%', '50%', '70%'];
const monstersCoordsY = ['10%', '15%', '13%'];

function prepareMonsters() {
  for (let i = 0; i < 3; i++) {
    const monster = new Monster({
      containerTag: '.main-field__content',
      coords: {
        x: monstersCoordsX[i],
        y: monstersCoordsY[i],
      },
      hp: 10,
    });
    monstersPromise
      .push(monster);
  }
}

async function firstSceneInvasion() {
  prepareMonsters();
  // eslint-disable-next-line no-restricted-syntax
  for (const monster of monstersPromise) {
    // eslint-disable-next-line no-await-in-loop
    await monster.show();
  }
}

async function characterSpeech(character, speechTag) {
  await new Promise((res) => {
    character
      .appendTo('.main-field')
      .animate({
        opacity: 1,
      }, 500, () => {
        res();
      });
  });
  await new Promise((res) => {
    $(speechTag)
      .animate({
        width: '50%',
        height: '40%',
        opacity: 1,
      }, 300, () => {
        res();
      });
  });
}

class NextButton {
  constructor(containerTag) {
    this.containerTag = containerTag;
    this.button = $('<div>')
      .addClass('next-button');
  }

  async activate() {
    await new Promise((res) => {
      this.button
        .appendTo(this.containerTag)
        .delay(400)
        .animate({
          opacity: 1,
        }, 300, res);
    });
    await new Promise((res) => {
      this.button.on('click', () => {
        this.button.remove();
        $('.character-speech')
          .animate({
            width: 0,
            height: 0,
            opacity: 0,
          }, 200, res);
      });
    });
  }
}

async function endFirstScene() {
  await new Promise((res) => {
    $('.main-field__content')
      .removeClass('field-blur');
    if (document.documentMode || /Edge/.test(navigator.userAgent)) {
      $('#blurIE')
        .animate({
          opacity: 0,
        }, 1000, function () {
          $(this).remove();
        });
    }
    $(firstSceneCharacters.firstCharacter)
      .css({
        transform: 'translateY(100%)',
        'transition-duration': '0.5s',
      });
    $(firstSceneCharacters.monsterCharacter)
      .css({
        transform: 'translateX(100%)',
        'transition-duration': '0.5s',
      });
    $(firstSceneCharacters.firstCharacter).on('transitionend', function () {
      $(this).remove();
    });
    $(firstSceneCharacters.monsterCharacter).on('transitionend', function () {
      $(this).remove();
      res();
    });
  });
  monstersPromise.forEach((monster) => {
    monster.attack();
  });
}

async function firstSceneAnimation() {
  await firstSceneInvasion();
  $('.main-field__content')
    .addClass('field-blur');

  // greymask for ie (blur)
  if (document.documentMode || /Edge/.test(navigator.userAgent)) {
    const blurIE = $('<div>')
      .css({
        width: '100%',
        height: '100%',
        'background-color': 'grey',
        position: 'absolute',
        top: '0%',
        'z-index': 4,
        opacity: 0,
      })
      .attr({
        id: 'blurIE',
      })
      .appendTo('.main-field__content');
    blurIE
      .animate({
        opacity: 0.4,
      }, 1000);
  }

  await characterSpeech(firstSceneCharacters.firstCharacter, '.first-character__speech');
  await new NextButton('.main-field')
    .activate();
  await characterSpeech(firstSceneCharacters.monsterCharacter, '.monster__speech');
  await new NextButton('.main-field')
    .activate();
  await endFirstScene();
}

export default firstSceneAnimation;
