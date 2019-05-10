import RocketLauncher from '../Rockets/rockets';
import monsterExport from '../Monsters/monsters';
import MachineGun from '../machineGun/machineGun';

function mainGame() {
  const firstLauncher = new RocketLauncher('launcher1');
  const secondLauncher = new RocketLauncher('launcher2');
  const thirdLauncher = new RocketLauncher('launcher3');
  const forthLauncher = new RocketLauncher('launcher4');
  RocketLauncher.activate();
  const machineGun = new MachineGun('#machineGun', 2000);
  machineGun.activate();
  monsterExport.Monster.activateInvasion(2000, 10);
}

export default mainGame;
