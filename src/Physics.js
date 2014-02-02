
var Physics = function(config){
	var me = this;

	config = config || {};

	if ( !config.game ){
		throw 'Invalid config supplied. Game is required';
	}

	this.game = config.game;

	this.htmlControls = {};
	this.debugEnabled = true;
	this.contactsEnabled = false;

	this.textureSrc = 'assets/textures/physics2d.png';

	// texture rectangles for above shapes.
	this.textureRectangles = [
		//[130, 130, 255, 255],
		[5, 132, 125, 252]
		//[131, 3, 251, 123],
		//[5, 5, 125, 125]
	];

	this.mathDevice = TurbulenzEngine.createMathDevice({});


	this.phys2D = Physics2DDevice.create({});

	// size of physics stage.
	this.stageWidth = 10;
	this.stageHeight = 10;

	this.draw2D = Draw2D.create({
		graphicsDevice: this.game.graphics.graphicsDevice
	});

	this.debug = Physics2DDebugDraw.create({
		graphicsDevice: this.game.graphics.graphicsDevice
	});

	// Configure draw2D viewport to the physics stage.
	// As well as the physics2D debug-draw viewport.
	this.draw2D.configure({
		viewportRectangle: [0, 0, this.stageWidth, this.stageHeight],
		scaleMode: 'scale'
	});

	this.debug.setPhysics2DViewport([0, 0, this.stageWidth, this.stageHeight]);

	var world = this.phys2D.createWorld({
		gravity: [0, 10]
	});

	var heavyMaterial = this.phys2D.createMaterial({
		density: 0.5
		,elasticity: 3
		,staticFriction :  1
	});
	me.shapeSize = 0.6;

	var shapeFactory = [
		this.phys2D.createPolygonShape({
			vertices: this.phys2D.createBoxVertices(me.shapeSize, me.shapeSize),
			material: heavyMaterial
		})
	];

	this.reset = function(){
		// Remove all bodies and constraints from world.
		world.clear();
		//handConstraint = null;

		// Create a static border body around the stage to stop objects leaving the viewport.
		var thickness = 0.1;
		var border = me.phys2D.createRigidBody({
			type: 'static',
			restitution : 0,
			shapes: [
				me.phys2D.createPolygonShape({
					vertices: me.phys2D.createRectangleVertices(0.01, 0.01, thickness, me.stageHeight)
				}),

				me.phys2D.createPolygonShape({
					vertices: me.phys2D.createRectangleVertices((me.stageWidth - thickness), 0, me.stageWidth, me.stageHeight)
				}),
				me.phys2D.createPolygonShape({
					vertices: me.phys2D.createRectangleVertices(0.01, (me.stageHeight - thickness), me.stageWidth, me.stageHeight)
				})
			]
		});

		world.addRigidBody(border);

		me.animationState = 0;

		// Create piles of each factory shape.
		var x, y;
		var xCount = Math.floor(me.stageWidth / me.shapeSize);

		for (x = 0; x < 2; x += 1) {
			for (y = 0; y < 1; y += 1) {
				var index = (y % shapeFactory.length);
				var shape = shapeFactory[index];
				var body = me.phys2D.createRigidBody({
					shapes: [shape.clone()],
					position: [
						me.stageWidth / 2,
						(y + 0.5) * me.shapeSize
					],
					rotation: Math.PI / 3,
					userData: Draw2DSprite.create({
						width: me.shapeSize,
						height: me.shapeSize,
						origin: [me.shapeSize / 2, me.shapeSize / 2],
						textureRectangle: me.textureRectangles[index],
						texture: me.game.assetLoader.textures[me.textureSrc]
					})
				});

				world.addRigidBody(body);
			}
		}
	};

	var realTime = 0;
	var prevTime = TurbulenzEngine.time;

	this.update = function(){
		if (!me.game.graphics.graphicsDevice.beginFrame()) {
			return;
		}

		//inputDevice.update();
		//graphicsDevice.clear([0.3, 0.3, 0.3, 1.0]);

		var body;
		/*
		if (handConstraint) {
			body = handConstraint.bodyB;
			handConstraint.setAnchorA(draw2D.viewportMap(mouseX, mouseY));

			// Additional angular dampening of body being dragged.
			// Helps it to settle quicker instead of spinning around
			// the cursor.
			body.setAngularVelocity(body.getAngularVelocity() * 0.9);
		}
		*/

		var curTime = TurbulenzEngine.time;
		var timeDelta = (curTime - prevTime);

		if (timeDelta > (1 / 20)) {
			timeDelta = (1 / 20);
		}

		realTime += timeDelta;
		prevTime = curTime;

		while (world.simulatedTime < realTime) {
			if (me.animationState === 0) {
				// Start of animatino, set velocity of lift to move up to the target
				// in 3 seconds.
				//lift.setVelocityFromPosition([me.stageWidth - 4.5, 10], 0, 3);
				me.animationState = 1;
			} else if (me.animationState === 1) {
				/*
				if (lift.getPosition()[1] <= 10) {
					// Reached target position for lift.
					// Set position incase it over-reached and zero velocity.
					lift.setPosition([stageWidth - 4.5, 10]);
					lift.setVelocity([0, 0]);

					// Start pusher animation to move left.
					pusher.setVelocityFromPosition([stageWidth - 4.5, 5], 0, 1.5);
					animationState = 2;
				}
				*/
			}else if (me.animationState === 2) {
				/*
				if (pusher.getPosition()[0] <= (stageWidth - 4.5)) {
					// Reached target position for pusher.
					// Set velocities of pusher and lift to both move right off-screen.
					pusher.setVelocityFromPosition([stageWidth + 4.5, 5], 0, 1);
					lift.setVelocityFromPosition([stageWidth + 4.5, 10], 0, 1);
					animationState = 3;
				}
				*/
			}else if (me.animationState === 3) {
				/*
				if (pusher.getPosition()[0] >= stageWidth + 4.5) {
					// Reached target.
					// Reset positions and velocities and begin animation afresh.
					pusher.setPosition([stageWidth + 4.5, 5]);
					pusher.setVelocity([0, 0]);
					lift.setPosition([stageWidth - 4.5, stageHeight]);
					lift.setVelocity([0, 0]);
					animationState = 0;
				}
				*/
			}

			world.step(1 / 60);
		}

		// draw2D sprite drawing.
		var bodies = world.rigidBodies;
		var limit = bodies.length;
		var i;
		if (!me.debugEnabled) {
			me.draw2D.begin('alpha', 'deferred');
			var pos = [];
			for (i = 0; i < limit; i += 1) {
				body = bodies[i];
				if (body.userData) {
					body.getPosition(pos);
					var sprite = body.userData;
					sprite.x = pos[0];
					sprite.y = pos[1];
					sprite.rotation = body.getRotation();
					me.draw2D.drawSprite(sprite);
				}
			}
			me.draw2D.end();
		}

		// physics2D debug drawing.
		me.debug.setScreenViewport(me.draw2D.getScreenSpaceViewport());
		me.debug.showRigidBodies = me.debugEnabled;
		me.debug.showContacts = me.contactsEnabled;

		me.debug.begin();
		if (!me.debugEnabled) {
			for (i = 0; i < limit; i += 1) {
				body = bodies[i];
				if (!body.userData) {
					me.debug.drawRigidBody(body);
				}
			}
		}
		me.debug.drawWorld(world);
		me.debug.end();

		me.game.graphics.graphicsDevice.endFrame();

		/*
		if (fpsElement) {
			var fpsText = (graphicsDevice.fps).toFixed(2);
			if (lastFPS !== fpsText) {
				lastFPS = fpsText;

				fpsElement.innerHTML = fpsText + " fps";
			}
		}
		*/

		/*
		if (bodiesElement) {
			if (lastNumBodies !== limit) {
				lastNumBodies = limit;

				bodiesElement.innerHTML = lastNumBodies + "";
			}
		}
		*/
	};

	//this.intervalID = false;

	function start() {
		me.reset();
		//me.intervalID = TurbulenzEngine.setInterval(update, 1000 / 60);
	}
};