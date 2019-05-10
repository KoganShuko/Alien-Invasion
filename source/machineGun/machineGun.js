/* eslint-disable no-param-reassign */
import monsterExport from '../Monsters/monsters';

class MachineGun {
  constructor(machineGunTag, fireDelay) {
    this.machineGunTag = machineGunTag;
    this.fireDelay = fireDelay || 1500;
    this.angle = 0;
    this.keyStatus = {
      65: {
        status: false,
        function: this.rotate.bind(null, 65),
        timer: null,
        animationSpeed: 30,
      },
      68: {
        status: false,
        function: this.rotate.bind(null, 68),
        timer: null,
        animationSpeed: 30,
      },
      32: {
        status: false,
        function: this.fire,
        timer: null,
        animationSpeed: 150,
      },
    };
  }

  activate = () => {
    $(window).on('keydown', (event) => {
      const keyObj = this.keyStatus[event.which];
      if (keyObj) {
        if (!keyObj.status) {
          keyObj.status = true;
          keyObj.timer = window.setInterval(() => {
            keyObj.function();
          }, keyObj.animationSpeed);
        }
      }
    });
    $(window).on('keyup', (event) => {
      const keyObj = this.keyStatus[event.which];
      if (keyObj) {
        if (keyObj.status) {
          keyObj.status = false;
          window.clearInterval(keyObj.timer);
        }
      }
    });
  }

  rotate = (key) => {
    if (key === 65) { // 65 === a или ф
      if (this.angle < -60) {
        return false;
      }
      this.angle = this.angle - 2;
    }
    if (key === 68) { // 68 === d или в
      if (this.angle > 60) {
        return false;
      }
      this.angle = this.angle + 2;
    }

    $(this.machineGunTag).css({
      transform: `rotate(${this.angle}deg)  translateX(-50%)`,
      'transform-origin': 'left bottom',
    });
    return false;
  };

  fire = () => {
    const bullet = new Bullet({
      angle: this.angle,
      machineGunTag: this.machineGunTag,
      fireDelay: this.fireDelay,
    });
    bullet.fly();
  }
}

class Bullet {
  constructor(options) {
    this.bodyOffset = document.querySelector('body')
      .getBoundingClientRect().left;
    this.fireDelay = options.fireDelay;
    this.damageValue = 0.1;
    this.damageAreaWidth = '2%';
    this.angle = options.angle;
    const machineGunWidth = parseInt($(document.querySelector(options.machineGunTag)).css('width'), 10);
    const machineGunHeight = parseInt($(document.querySelector(options.machineGunTag)).css('height'), 10);
    const machineGunCoords = $(options.machineGunTag).offset();
    const startPointOffsetX = machineGunWidth * Math.cos(this.angle * Math.PI / 180) / 2;
    const startPointOffsetY = machineGunWidth * Math.sin(this.angle * Math.PI / 180) / 2;

    this.startPoint = {
      x: this.angle > 0 ? machineGunCoords.left + startPointOffsetX - this.bodyOffset
        : machineGunCoords.left + Math.abs(machineGunHeight * Math.sin(this.angle * Math.PI / 180))
        + startPointOffsetX - this.bodyOffset,
      y: machineGunCoords.top + machineGunHeight * Math.cos(this.angle * Math.PI / 180)
        + Math.abs(startPointOffsetY),
    };
    this.endPoint = {
      x: this.angle > 0 ? machineGunCoords.left - this.bodyOffset
        + Math.abs(machineGunHeight * Math.sin(this.angle * Math.PI / 180)) + startPointOffsetX
        : machineGunCoords.left + startPointOffsetX - this.bodyOffset,
      y: machineGunCoords.top + Math.abs(startPointOffsetY),
    };
    this.damageArea = $('<div>')
      .addClass('damageArea')
      .css({
        height: `${parseFloat(this.damageAreaWidth) * 1.25}%`,
        width: this.damageAreaWidth,
      })
      .appendTo('.main-field__content'); // bullet and damageArea in mainGame less
    if (this.angle > 0) {
      this.damageArea
        .css({
          transform: `translate(-50%, -50%) rotate(${this.angle}deg)`,
        });
    } else {
      this.damageArea.css({
        transform: `translate(-25%, -25%) rotate(${this.angle}deg)`,
      });
    }
    const bulletPic = $('<div>')
      .addClass('bullet')
      .appendTo(this.damageArea);

    this.getBulletPathLength = () => {
      const bodyWidth = parseFloat($('body').css('width'));
      const maxXPath = Math.max(this.startPoint.x, bodyWidth - this.startPoint.x);
      const totalPath = Math.sqrt((this.startPoint.y ** 2) + (maxXPath ** 2));
      const coordsOffset = {
        x: totalPath * Math.abs(Math.sin(this.angle * Math.PI / 180)),
        y: totalPath * Math.abs(Math.cos(this.angle * Math.PI / 180)),
      };
      return coordsOffset;
    };
    this.pathX = this.getBulletPathLength().x;
    this.pathY = this.getBulletPathLength().y;
    this.stepXValue = this.pathX / 50;
    this.stepYValue = this.pathY / 50;
    this.stepX = 0;
    this.stepY = 0;
    this.animationId = null;
  }

  fly = () => {
    // (y2 - y2) * (x - x1) / (x2 - x1) + y1 = y
    const equation = this.angle >= 0 ? {
      x: this.endPoint.x + this.stepX,
      y: this.angle !== 0 ? (this.endPoint.y - this.startPoint.y)
        * (this.endPoint.x + this.stepX - this.startPoint.x)
        / (this.endPoint.x - this.startPoint.x) + this.startPoint.y
        : this.endPoint.y - this.stepY,
    } : {
      x: this.endPoint.x - this.stepX,
      y: (this.endPoint.y - this.startPoint.y)
          * (this.endPoint.x - this.stepX - this.startPoint.x)
          / (this.endPoint.x - this.startPoint.x) + this.startPoint.y,
    };
    this.stepX += this.stepXValue;
    this.stepY += this.stepYValue;

    this.damageArea.css({
      left: `${equation.x}px`,
      top: `${equation.y}px`,
    });
    if (this.stepY <= this.pathY) {
      this.targetSearch();
      this.animationId = requestAnimationFrame(this.fly);
    } else {
      cancelAnimationFrame(this.animationId);
      this.damageArea.remove();
    }
  }

  targetSearch = () => {
    const coords = this.damageArea.offset();
    if (!coords.left) {
      return;
    }
    const damageAreaSizePx = {
      width: parseFloat(window.getComputedStyle(this.damageArea[0]).width),
      height: parseFloat(window.getComputedStyle(this.damageArea[0]).height),
    };
    console.log(damageAreaSizePx, coords);
    const pointOne = $(document.elementFromPoint(coords.left - 2,
      coords.top + damageAreaSizePx.height + 2));
    const pointTwo = $(document.elementFromPoint(coords.left + damageAreaSizePx.width + 2,
      coords.top + damageAreaSizePx.height + 2));
    const pointThree = $(document.elementFromPoint(coords.left + damageAreaSizePx.width / 2,
      coords.top + damageAreaSizePx.height + 2));
    if (pointOne.hasClass('monster-part')) {
      this.damageArea.remove();
      this.damage(pointOne);
      return;
    }
    if (pointTwo.hasClass('monster-part')) {
      this.damageArea.remove();
      this.damage(pointTwo);
      return;
    }
    if (pointThree.hasClass('monster-part')) {
      this.damageArea.remove();
      this.damage(pointThree);
    }
  }

  damage(target) {
    const damagedSVG = target[0].farthestViewportElement ? target[0].farthestViewportElement
      : target[0];
    const damagedObj = monsterExport.destroyableList[$(damagedSVG).attr('id')];
    if (damagedObj.instance) {
      damagedObj.instance
        .wound(this.damageValue);
    }
  }
}

export default MachineGun;
