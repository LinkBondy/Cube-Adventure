'use strict'
export const images = {
  stillLoading: 0,
  LoadImages: function () {
    images.WallGrassClassicA = LoadImage('images/WallGrassClassicA.png')
    images.WallGrassClassicA_200x200 = LoadImage('images/WallGrassClassicA_200x200.png')
    images.WallGrassClassicA_400x400 = LoadImage('images/WallGrassClassicA_400x400.png')
    images.WallGrassRockA = LoadImage('images/WallGrassRockA.png')
    images.WallGrassPuddleA = LoadImage('images/WallGrassPuddleA.png')
    images.WallGrassTree = LoadImage('images/WallGrassTree.png')
    images.WallGrassTreeV2 = LoadImage('images/WallGrassTreeV2.png')
    //
    images.UndergroundWallCrystalA = LoadImage('images/UndergroundWallCrystalA.png')
    images.UndergroundWallA = LoadImage('images/UndergroundWallA.png')
    ///
    images.BlueCube = LoadImage('images/BlueCube.png')
    images.BlueCubePyro = LoadImage('images/BlueCubePyro.png')
    images.BlueCubeWooden = LoadImage('images/BlueCubeWooden.png')
    images.BlueCubePoison = LoadImage('images/BlueCubePoison.png')
    ///
    images.BlueCubePlastic = LoadImage('images/BlueCubePlastic.png')
    images.BlueCubePyroPlastic = LoadImage('images/BlueCubePyroPlastic.png')
    images.BlueCubeWoodenPlastic = LoadImage('images/BlueCubeWoodenPlastic.png')
    images.BlueCubePoisonPlastic = LoadImage('images/BlueCubePoisonPlastic.png')
    ///
    images.BlueCube_400x400 = LoadImage('images/BlueCube_400x400.png')
    ///
    images.RedCube = LoadImage('images/RedCube.png')
    images.RedCube_200x200 = LoadImage('images/RedCube_200x200.png')
    images.RedCubePlastic = LoadImage('images/RedCubePlastic.png')
    ///
    images.TeleporterTomato = LoadImage('images/TeleporterTomato.png')
    images.TeleporterTomatoSprite = LoadImage('images/TeleporterTomatoSprite.png')
    images.TeleporterTomatoSprite_200x200 = LoadImage('images/TeleporterTomatoSprite_200x200.png')
    images.TeleporterPurple = LoadImage('images/TeleporterPurple.png')
    images.TeleporterPurpleSprite = LoadImage('images/TeleporterPurpleSprite.png')
    ///
    images.SwitchW1Blue = LoadImage('images/SwitchW1Blue.png')
    images.SwitchW1Blue_200x200 = LoadImage('images/SwitchW1Blue_200x200.png')
    images.SwitchW1Purple = LoadImage('images/SwitchW1Purple.png')
    images.SwitchW1Purple_200x200 = LoadImage('images/SwitchW1Purple_200x200.png')
    images.SwitchW1ActivatedBlue = LoadImage('images/SwitchW1ActivatedBlue.png')
    images.SwitchW1ActivatedPurple = LoadImage('images/SwitchW1ActivatedPurple.png')
    ///
    images.InvisibleWall = LoadImage('images/InvisibleWall.png')
    images.InvisibleWallV2 = LoadImage('images/InvisibleWallV2.png')
    images.InvisibleWall_200x200 = LoadImage('images/InvisibleWall_200x200.png')
    ///
    images.LifeJacket = LoadImage('images/LifeJacket.png')
    images.LifeJacket_80x80 = LoadImage('images/LifeJacket_80x80.png')
    images.LifeJacket_200x200 = LoadImage('images/LifeJacket_200x200.png')
    images.LifeJacketPlastic = LoadImage('images/LifeJacketPlastic.png')
    images.LifeJacketPlastic_80x80 = LoadImage('images/LifeJacketPlastic_80x80.png')
    ///
    images.ThreeBead = LoadImage('images/ThreeBead.png')
    images.ThreeBead_80x80 = LoadImage('images/ThreeBead_80x80.png')
    images.ThreeBeadPlastic = LoadImage('images/ThreeBeadPlastic.png')
    images.ThreeBeadPlastic_80x80 = LoadImage('images/ThreeBeadPlastic_80x80.png')
    ///
    images.Water_Medium2 = LoadImage('images/Water_Medium2.png')
    images.Water_Medium_200x200 = LoadImage('images/Water_Medium_200x200.png')
    ///
    images.UnlockRockPurple = LoadImage('images/UnlockRockPurple.png')
    images.UnlockRockPurple_200x200 = LoadImage('images/UnlockRockPurple_200x200.png')
    images.UnlockedRockPurple = LoadImage('images/UnlockedRockPurple.png')
    images.UnlockRockBlue = LoadImage('images/UnlockRockBlue.png')
    images.UnlockRockBlue_200x200 = LoadImage('images/UnlockRockBlue_200x200.png')
    images.UnlockedRockBlue = LoadImage('images/UnlockedRockBlue.png')
    ///
    images.Hole = LoadImage('images/Hole.png')
    images.UndergroundHole = LoadImage('images/UndergroundHole.png')
    images.Hole_200x200 = LoadImage('images/Hole_200x200.png')
    images.HolePlastic = LoadImage('images/HolePlastic.png')
    ///
    images.UpArrow = LoadImage('images/UpArrow.png')
    images.DownArrow = LoadImage('images/DownArrow.png')
    images.LockedIcon = LoadImage('images/LockedIcon.png')
    ///
    images.BackButton = LoadImage('images/BackButton.png')
    images.PauseButton = LoadImage('images/PauseButton.png')
    images.PlayButton = LoadImage('images/PlayButton.png')
    images.Frame = LoadImage('images/Frame.png')
    images.Clock = LoadImage('images/Clock.png')
    images.WorldTwoLedges = LoadImage('images/WorldTwoLedges.png')
    ///
    images.finishLine = LoadImage('images/finishLine.png')
    ///
    images.activated = LoadImage('images/Activated.png')
    images.notActivated = LoadImage('images/Not-Activated.png')
  }
}

function LoadImage (path) {
  const image = new window.Image()
  image.src = path
  images.stillLoading += 1
  image.onload = function () {
    images.stillLoading -= 1
  }
  return image
}
