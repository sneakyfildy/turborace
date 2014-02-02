var Graphics = function(){
	var me = this;

	this.mathDevice = TurbulenzEngine.createMathDevice({});
	this.graphicsDevice = TurbulenzEngine.createGraphicsDevice({});


	// Set the initial previous frametime for the first loop
	this.previousFrameTime = TurbulenzEngine.time;
	this.clearColor = [0.0, 0.0, 0.0, 1.0];

	this.update = function updateFn() {
		// Gets the currentTime to be used in calculations for this frame
		var currentTime = TurbulenzEngine.time;

		// Delta is calculated to be used by update functions that require the elapsed time since they were last called
		var deltaTime = (currentTime - me.previousFrameTime);

		if (deltaTime > 0.1) {
			deltaTime = 0.1;
		}

		//if (doBlend) {
		//updateColor(deltaTime);
		//}



		if (me.graphicsDevice.beginFrame()) {
			//me.graphicsDevice.clear(me.clearColor, 1.0, 0);

			me.graphicsDevice.endFrame();
		}

		/*
		if (me.graphicsDevice.beginFrame()) {
			me.graphicsDevice.setScissor(0, 0, 320, 480);
			me.graphicsDevice.clear([1.0, 1.0, 1.0, 1.0], 1.0, 0);

			me.graphicsDevice.endFrame();
		}
		*/

		me.previousFrameTime = currentTime;
	};
};