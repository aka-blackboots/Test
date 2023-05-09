import { BaseScene } from "./scene.js";
import { IfcManager } from "./manager.js";

const ifcModels = []
const baseScene = new BaseScene()
const ifcManager = new IfcManager(baseScene.scene, ifcModels, baseScene.camera)