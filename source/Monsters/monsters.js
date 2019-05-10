import * as monsterSVG from '../pics/monster.svg';
import * as blobSVG from '../pics/blob.svg';


const monsterCounter = {};
const blobCounter = {};
const destroyableList = {}; // for searching monster by id
let globalMonsterInvasionTimer = null;
let globalMaxMonstersCount;
let globalInvasionInterval;

class Monster {
  constructor(options) {
    this.scale = options.scale || 1;
    this.direcstion = options.direction || 0;
    this.hp = options.hp;
    this.monsterSvg = monsterSVG;
    this.containerTag = options.containerTag;
    this.coords = options.coords;
    function getId() {
      let id = 0;
      while (monsterCounter[id]) {
        id++;
      }
      monsterCounter[id] = true;
      return id;
    }
    this.idNumber = getId();
    this.id = `monster${this.idNumber}`;

    const checkMonstersCount = () => {
      let monsterCount = 0;
      for (const monster in monsterCounter) {
        if (Object.prototype.hasOwnProperty.call(monsterCounter, monster)) {
          monsterCount++;
        }
      }
      if (monsterCount > globalMaxMonstersCount) {
        window.clearInterval(globalMonsterInvasionTimer);
        globalMonsterInvasionTimer = null;
      }
    };
    checkMonstersCount();
  }

  insertToList = (id, monster) => {
    destroyableList[id] = {
      instance: monster,
    };
  }

  static activateInvasion(interval, maxMonstersCount) {
    globalInvasionInterval = interval;
    globalMaxMonstersCount = maxMonstersCount || 10;
    function getRandomCoords() {
      const x = `${Math.random() * 90 + 5}%`;
      const y = `${Math.random() * 20 + 5}%`;
      return { x, y };
    }
    globalMonsterInvasionTimer = window.setInterval(() => {
      const monster = new Monster({
        containerTag: '.main-field__content',
        coords: {
          x: getRandomCoords().x,
          y: getRandomCoords().y,
        },
        hp: 10,
      });
      monster.show();
      monster.attack();
    }, interval);
  }

  show = () => {
    return new Promise((res) => {
      $(this.monsterSvg)
        .attr({
          width: '4%',
          height: '4%',
          id: this.id,
        })
        .css({
          position: 'absolute',
          top: this.coords.y,
          left: this.coords.x,
          opacity: 0,
        })
        .addClass('destroyable')
        .appendTo(this.containerTag)
        .animate({
          opacity: 1,
        }, 1000, () => {
          res();
        });
      this.insertToList(this.id, this);
    });
  }

  async attack() {
    function getRandomAttackDelay() {
      const num = Math.random() * 8000 + 3000;
      return num;
    }
    while (this.hp > 0) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((res) => {
        const blob = new Blob({
          container: this.containerTag,
          monsterId: this.id,
        });
        blob.fall();
        window.setTimeout(() => res(), getRandomAttackDelay());
      });
    }
  }

  wound = (damageValue) => {
    this.hp -= damageValue;
    if (this.hp <= 0) {
      this.death();
    }
  }

  death = () => {
    $(`#${this.id}`).remove();
    delete destroyableList[this.id];
    delete monsterCounter[this.idNumber];
    if (!globalMonsterInvasionTimer) {
      Monster.activateInvasion(globalInvasionInterval, globalMaxMonstersCount);
    }
  }
}


class Blob {
  constructor(options) {
    this.hp = 0.1;
    this.container = options.container;
    this.fallTimer = null;
    this.monsterId = options.monsterId;
    this.coords = $(`#${this.monsterId}`).offset();
    function getId() {
      let id = 0;
      while (blobCounter[id]) {
        id++;
      }
      blobCounter[id] = true;
      return id;
    }
    this.idNumber = getId();
    this.id = `blob${this.idNumber}`;
    this.blobSVG = $(blobSVG)
      .attr({
        width: '2%',
        height: '3.6%',
        id: this.id,
      })
      .css({
        left: `${this.coords.left - $('body').offset().left}px`,
        top: `${this.coords.top}px`,
        position: 'absolute',
      })
      .addClass('monster-part')
      .appendTo(this.container);
    this.insertToList(this.id, this);
    this.stepValue = 0.8;
  }

  insertToList = (id, blob) => {
    destroyableList[id] = {
      instance: blob,
    };
  }

  fall = () => {
    this.coords.top = this.coords.top + this.stepValue;
    $(this.blobSVG)
      .css({
        top: `${this.coords.top}px`,
      });
    if (this.coords.top < 500) {
      this.fallTimer = requestAnimationFrame(this.fall);
    } else {
      this.death();
      cancelAnimationFrame(this.fallTimer);
    }
  }

  wound = (damageValue) => {
    this.hp -= damageValue;
    if (this.hp <= 0) {
      this.death();
    }
  }

  death = () => {
    $(`#${this.id}`).remove();
    console.log(destroyableList[this.id])
    delete destroyableList[this.id];
    delete blobCounter[this.id];
  }
}

const monsterExport = { Monster, destroyableList };

export default monsterExport;
