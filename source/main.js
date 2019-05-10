import '@babel/polyfill';
import './css.less';
import Snap from 'snapsvg';
import StartScreen from './StartScreen/startScreen';
import Field from './Field/field';
import firstSceneAnimation from './FirstScene/firstScene';
import mainGame from './MainGame/mainGame';


const field = new Field();
field.appendTo('body');
const startScreen = new StartScreen();
startScreen.appendTo('.main-field__content');

async function game() {
  await startScreen.startGame();
  await firstSceneAnimation();
  mainGame();
}


game();
