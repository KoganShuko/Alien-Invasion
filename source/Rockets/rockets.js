import * as rocketSVG from '../pics/rocket.svg';
import * as Boom from '../pics/boom.svg';
import monsterExport from '../Monsters/monsters';

const rocketCounter = {};
const rocketInfoTable = {}; // need to cheack readiness of launchers, they have reload delay

class RoketLauncer {
  constructor(id) {
    const launcherInfo = {
      startPointTag: `#${id} #launcher__first-start-point`,
      reloadStatus: false,
    };
    rocketInfoTable[id] = launcherInfo;
  }

  static activate = () => {
    let readyLaunchers = {};
    function inspectLauncherReadiness() { // launcer can reload
      readyLaunchers = {};
      for (const launcher in rocketInfoTable) {
        if (rocketInfoTable[launcher].reloadStatus === false) {
          readyLaunchers[launcher] = rocketInfoTable[launcher];
        }
      }
    }
    function chooseLauncher() { // choose random launcher
      inspectLauncherReadiness();
      let readyLaunchersAmount = 0;
      for (const launcher in readyLaunchers) {
        if (Object.prototype.hasOwnProperty.call(readyLaunchers, launcher)) {
          readyLaunchersAmount++;
        }
      }
      if (!readyLaunchersAmount) {
        return false;
      }
      const availableID = [];
      for (const launcher in readyLaunchers) {
        if (Object.prototype.hasOwnProperty.call(readyLaunchers, launcher)) {
          availableID.push(launcher);
        }
      }
      function getRandonNumber() {
        return Math.round(Math.random() * (availableID.length - 1));
      }
      const randomId = availableID[getRandonNumber()];
      rocketInfoTable[randomId].reloadStatus = true;
      window.setTimeout(() => {
        rocketInfoTable[randomId].reloadStatus = false;
      }, 1000); // <--reload delay
      return rocketInfoTable[randomId].startPointTag;
    }
    $(document.documentElement).on('click', (event) => {
      const startPointTag = chooseLauncher();
      if (!startPointTag) {
        return;
      }
      const endX = event.pageX - window.pageXOffset;
      const endY = event.pageY - window.pageYOffset;
      const rocket = new Rocket(startPointTag, endX, endY);
      rocket.fly();
    });
  }
}

class Rocket {
  constructor(startPointTag, endX, endY) {
    this.rocketWidth = '3%';
    this.rocketHeight = '3%'; // need both width and height for ie
    this.rocketSizePx = null; // calc after appending
    this.rocketDamageAreaCoef = 0.6; // increasing damage area rocketDamageAreaCoef * rocketWidth
    this.offset = $('body').offset().left; // offset from body left coord
    this.startPoint = $(startPointTag).offset();
    this.startPointX = this.startPoint.left - this.offset;
    this.startPointY = this.startPoint.top;
    this.endX = this.offset ? endX - this.offset : endX;
    this.endY = endY;
    this.damageValue = 5;
    function getId() {
      let id = 0;
      while (rocketCounter[id]) {
        id++;
      }
      rocketCounter[id] = true;
      return id;
    }
    this.id = `rocket${getId()}`;
  }

  fly = () => {
    const getRandomCoordX = () => Math.abs((this.startPointX + this.endX) / 2)
      * (Math.random() + 0.5);
    const getRandomCoordY = () => Math.abs((this.startPointY - 100 + this.endY) / 2)
      * (Math.random() + 0.5);
    const rocketPath = Snap('#canvas')
      .path(`M ${this.startPointX} ${this.startPointY} L${this.startPointX} ${this.startPointY - 100}  
      C ${getRandomCoordX()} ${getRandomCoordY()} ${getRandomCoordX()} ${getRandomCoordY()} ${this.endX} ${this.endY}`)
      .attr({
        fill: 'none',
      });
    const rocket = $(rocketSVG)
      .css({
        position: 'absolute',
        left: this.startPointX,
        top: this.startPointY,
      })
      .appendTo('.main-field__content')
      .attr({
        width: this.rocketWidth,
        height: this.rocketHeight,
        id: this.id,
      });
    this.rocketSizePx = {
      width: parseFloat(window.getComputedStyle(document.querySelector(`#${this.id}`)).width),
      height: parseFloat(window.getComputedStyle(document.querySelector(`#${this.id}`)).height),
    };
    const pathLength = Snap.path.getTotalLength(rocketPath);
    const nextStep = {}; // damage area  (check for monster-part not only on an animation path)
    let target;
    Snap.animate(0, pathLength, (step) => {
      const moveToPoint = Snap.path.getPointAtLength(rocketPath, step);
      nextStep.left = [moveToPoint.x + this.offset - this.rocketDamageAreaCoef * this.rocketSizePx.width
        * Math.abs(Math.sin(moveToPoint.alpha * Math.PI / 180)),
      moveToPoint.y - this.rocketDamageAreaCoef * this.rocketSizePx.height
        * Math.abs(Math.cos(moveToPoint.alpha * Math.PI / 180))];
      nextStep.right = [moveToPoint.x + this.offset + this.rocketDamageAreaCoef * this.rocketSizePx.width
        * Math.abs(Math.sin(moveToPoint.alpha * Math.PI / 180)),
      moveToPoint.y + this.rocketDamageAreaCoef * this.rocketSizePx.height
        * Math.abs(Math.cos(moveToPoint.alpha * Math.PI / 180))];
      nextStep.center = [moveToPoint.x + this.offset, moveToPoint.y];
      $(`#${this.id}`)
        .css({
          top: `${moveToPoint.y - this.rocketSizePx.height / 2}px`,
          left: `${moveToPoint.x - this.rocketSizePx.width / 2}px`,
          transform: `rotate(${moveToPoint.alpha - 90}deg)`,
        });
      // search if a rocket is still on field (animation doesnt end after explosion =( )
      if (document.getElementById(this.id)) {
        const targetLeft = $(document.elementFromPoint(nextStep.left[0], nextStep.left[1]));
        const targetRight = $(document.elementFromPoint(nextStep.right[0], nextStep.right[1]));
        if (targetLeft.hasClass('monster-part')) {
          target = $(document.elementFromPoint(nextStep.left[0], nextStep.left[1]));
          this.explode(moveToPoint.x, moveToPoint.y, rocket, true);
          this.damage(target);
        }
        if (targetRight.hasClass('monster-part')) {
          target = $(document.elementFromPoint(nextStep.right[0], nextStep.right[1]));
          this.explode(moveToPoint.x, moveToPoint.y, rocket, true);
          this.damage(target);
        }
      }
      /* global mina */
    }, 1300, mina.easeout, () => {
      if (document.getElementById(this.id)) {
        this.explode(nextStep.center[0], nextStep.center[1], rocket, false);
      }
      rocketPath.remove();
    });
  }

    explode = (coordX, coordY, containerTag, isHit) => {
      const explosion = $(Boom)
        .attr({
          width: isHit ? `${this.rocketSizePx.width * 2.5}px` : `${this.rocketSizePx.width}px`,
          height: isHit ? `${this.rocketSizePx.height * 2.5}px` : `${this.rocketSizePx.height}px`,
        })
        .css({
          position: 'absolute',
          left: isHit ? coordX - this.rocketSizePx.width * 1.25
            : coordX - this.rocketSizePx.width / 2 - this.offset,
          top: isHit ? coordY - this.rocketSizePx.height * 1.25
            : coordY - this.rocketSizePx.height / 2,
        })
        .attr({
          fill: isHit ? 'red' : 'orange',
        });
      containerTag.replaceWith(explosion);
      explosion.addClass('explosion'); // in mainGame less
      explosion.on('animationend', () => {
        explosion.remove();
      });
    }

    damage(target) {
      const damagedSvg = target[0].farthestViewportElement ? target[0].farthestViewportElement
        : target[0];
      const damagedObj = monsterExport.destroyableList[$(damagedSvg).attr('id')];
      if (damagedObj) {
        damagedObj.instance.wound(this.damageValue);
      }
    }
}

export default RoketLauncer;
