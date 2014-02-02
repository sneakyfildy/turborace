var tz = TurbulenzEngine;

function Game(){
	var me = this;

	this.fps = 60;

	tz.onload = onloadTZ;

	function onloadTZ(){
		//console.log('load');
		//try{
			me.setupComponents();
		//}catch(e){
		//	if ( window.DEBUG ){
		//		console.error(e.message || e);
		//	}
		//	return;
		//}
	}

	function update() {
		me.fpsStats.begin();

		me.physics.update();
		me.graphics.update();

		me.fpsStats.end();
	}

	this.onAssetLoaded = function(){
		me.physics.reset();
		me.intervalId = TurbulenzEngine.setInterval(update, 1000 / me.FPS);
	};

	this.setupComponents = function(){
		me.fpsStats = new StatsJS.Main();
		me.fpsStats.domElement.style.position = 'absolute';
		me.fpsStats.domElement.style.left = '0px';
		me.fpsStats.domElement.style.top = '0px';

		document.body.appendChild(this.fpsStats.domElement);

		me.componentsInitPending = 2;

		me.graphics = new Graphics(
			{
				game    : me
			}
		);

		me.physics = new Physics(
			{
				game    : me
			}
		);

		me.assetLoader = new AssetLoader(
			{
				game    : me
			}
		);

		//me.graphics.init();
		//me.physics.init();
		me.assetLoader.init();

		me.assetLoader.load();
	};
}

