const firstCharacter = $('<div>')
  .addClass('character first-character');
const firstCharacterSpeech = $('<div>')
  .addClass('character-speech first-character__speech')
  .appendTo(firstCharacter);

const monsterCharacter = $('<div>')
  .addClass('character monster-character');
const monsterCharacterSpeech = $('<div>')
  .addClass('character-speech monster__speech')
  .appendTo(monsterCharacter);

const firstSceneCharacters = { firstCharacter, monsterCharacter };
export default firstSceneCharacters;
