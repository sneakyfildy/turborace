/*{{ javascript("../jslib/utilities.js") }}*/
/*{{ javascript("../jslib/camera.js") }}*/
/*{{ javascript("../jslib/drawprimitives.js") }}*/

var AssetLoader = function(config){
	var me = this;
	config = config || {};

	if ( !config.game || !config.game.graphics ){
		throw 'Invalid config supplied. Game and graphics are required';
	}

	this.game = config.game;

	this.init = function(){
		me.setupAssetsLists();
	};

	/**
	 * Sets up assets list, lol. Ok, it just refreshes defined
	 * assets store variables. May be called if assets change is needed.
	 */
	this.setupAssetsLists = function(){
		me.textures = me.getTexturesList() || [];
		me.shaders = me.getShadersList() || [];

		this.pendingAssets = this.textures.length + this.shaders.length;
	};

	this.load = function(){
		var loadParams;

		for (var i = 0, l = me.textures.length; i < l; i++){
			loadParams = {
				src         : me.textures[i]
				,mipmaps    : true
				,onload     : onTextureLoad
			};

			me.game.graphics.graphicsDevice.createTexture(loadParams);
		}

		i = 0;
		l = me.shaders.length;

		for (; i < l; i++){
			TurbulenzEngine.request(me.shaders[i], onShaderLoad);
		}

		me.intervalId = TurbulenzEngine.setInterval(loadingLoopFn, 1000 / 10);
	};

	this.onFinishLoad = function(){
		//console.log('assets loaded');
		me.game.onAssetLoaded();
	};

	function loadingLoopFn(){
		if (me.pendingAssets === 0){
			TurbulenzEngine.clearInterval(me.intervalId);
			me.onFinishLoad();
		}
	}

	/**
	 * Texture load callback
	 * @scope - texture
	 * @param {string} texture Loaded texture
	 */
	function onTextureLoad(texture){
		me.textures[this.src] = texture;
		me.pendingAssets -= 1;
	}

	/**
	 * Shader load callback
	 * @scope - texture
	 * @param {string} jsonData Loaded shader
	 */
	function onShaderLoad(jsonData){
		// Shader data passed to function as a JSON object
		if (jsonData){
			var shaderParameters = JSON.parse(jsonData);
			me.shaders[shaderParameters.name] = me.game.graphics.graphicsDevice.createShader(shaderParameters);
			me.pendingAssets -= 1;
		}
	}

	this.destroyFn = function(){
		TurbulenzEngine.clearInterval(me.intervalId);
		me.textures = null;
		me.shaders = null;

		TurbulenzEngine.flush();
	};

	this.getTexturesList = function(){
		return [
			'assets/textures/crate.jpg'
			,'assets/textures/stones.jpg'
			,'assets/textures/brick.png'
			,'assets/textures/physics2d.png'
		];
	};

	this.getShadersList = function(){
		return [
			'assets/shaders/generic2D.cgfx.json'
		];
	};
};