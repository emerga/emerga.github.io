
    /**
    * 
    */
    class StateElement {
       constructor(machine, state, callback) {
           this._machine = machine;
           this._state = state;
           this.callback = callback;
       }
       get machine() { return this._machine; }
       get state() { return this._state; }
       execute(iteration) {
           if (this.callback) {
               return this.callback(this, iteration);
           }
       }
   }
   /**
    * 
    */
   class StateMachineCollection {
       constructor(machine) {
           this.machine = machine;
           this._elements = [];
       }
       get elements() { return this._elements; }
       set elements(s) { this._elements = s; }
       add(el) {
           var self = this;
           if (el) {
               var toUpdate = [];
               if (!Array.isArray(el)) {
                   toUpdate = [el];
               } else {
                   toUpdate = el;
               }
               toUpdate.forEach((tu) => self.elements.push(tu));
           }
           return this;
       }
       clear() { this._elements = []; }
       toArray() { return this.elements; }
   }
   /**
    * 
    */
   class StateMachineAssociativeCollection extends StateMachineCollection {
       constructor(machine) {
           super(machine);
           this._elements = {};
       }
       add(key, el) {
           this._elements[key] = el;
           return this;
       }
       get(key) { return this._elements[key]; }
       clear() { this._elements = {}; }
       toArray() { return Object.values(this._elements); }
   }
   /**
    * 
    */
   class EntityElement extends StateElement {
       constructor(machine, state, callback) {
           super(machine, state, callback);
           this.state.children = [];
       }
       get x() { return this.state.x; }
       set x(v) { this.state.x = v; }
       get y() { return this.state.y; }
       set y(v) { this.state.y = v; }
       get parent() { return this.state.parent; }
       set parent(p) {  this.state.parent = p; }
       get children() { return this.state.children; }
   }
   /**
    * 
    */
   class StateRenderer extends StateElement {
       execute(iteration, el) {
           if (this.callback) {
               return this.callback(el, iteration);
           }
       }
   }
   /**
    * 
    */
   class StateBuilder extends StateElement {}
   const StateMachineBreakException = {};
   /**
    * 
    */
   class StateMachine {
       constructor() {
           this.remIterations = 0;
           this._iteration = 1;
           this.maxIterations = 10;
           this.halt = false;
           this.pause = false;
           this._cadence = 0
           this.throttle = 1000;
           this._asyncCompute = false;
           this._postIteration = null;
           this.buildCollections();
       }
       buildCollections() {
           this.stateElements = new StateMachineCollection(this);
           this.stateBuilders = new StateMachineCollection(this);
           this.stateRenderers = new StateMachineCollection(this);
           this.curElements = [];
           this.newElements = [];
       }
       get iteration() { return this._iteration; }
       get elements() { return this.stateElements; }
       set elements(v) { this.stateElements = v; }
       get builders() { return this.stateBuilders; }
       get cadence() { return this._cadence; }
       get renderers() { return this.stateRenderers; }
       get postIteration() { return this._postIteration; }
       set postIteration(x) { this._postIteration = x; }
       set iteration(x) { this._iteration = x; }
       get halted() { return this.halt; }
       get paused() { return this.pause; }
       get remainingIterations() { return this.remIterations; }
       get asyncCompute() { return this._asyncCompute; }
       set asyncCompute(v) { this._asyncCompute = v; }
       set cadence(v) { this._cadence = v; }
       get requestedIterations() { return this.reqIterations; }
       set requestedIterations(v) { this.reqIterations = v; }
       reset() {
           this.halt = true;
           this.remIterations = 0;
           this.requestedIterations = 0;
           this.iteration = 1;
           this.buildCollections();
       }
       run(iterations) {
           this.halt = false;
           this.pause = false;
           this.builders.elements[0].execute(1);
           this.advance(iterations);
       }
       pause() {
           this.pause = true;
       }
       stop() {
           this.halt = true;
           this.pause = false;
       }
       operateOnElement(stateEl) {
           return stateEl.execute(this.iteration);
       }
       renderElement(stateEl) {
           rendeEl(this.iteration, stateEl);
       }
       processElement() {
           var machine = this;
           if (this.paused) {
               return setTimeout(() => machine.processElement(), 100);
           }
           if (this.halt) {
               return;
           }
           if (this.curElements.length === 0) {
               this.postIteration(this, this.newElements, this.iteration);
               this.iteration++;
               this.remIterations = this.remIterations > 0 ?
                   this.remIterations - 1 :
                   this.remIterations;
               return Promise.resolve().then(() => machine._advance());
           }
           const curElement = this.curElements.pop();
           const els = this.operateOnElement(curElement);
           this.renderElement(curElement);
           this.newElements = this.newElements.concat(els);
           tickCounter++;
           if(asyncRun || tickCounter>=1000) {
              tickCounter = 0;
              setTimeout(() => machine.processElement(),0)
           }
           else
             Promise.resolve().then(() => machine.processElement());
       }

       processElementAsync() {
           var machine = this;
           if (this.paused) {
               return setTimeout(() => machine.processElementAsync(), 100);
           }
           if (this.halt) {
               return;
           }
           if (this.curElements.length === 0) {
               this.postIteration(this, this.newElements, this.iteration);
               this.iteration++;
               this.remIterations = this.remIterations > 0 ?
                   this.remIterations - 1 :
                   this.remIterations;
               return setTimeout(() => machine._advance(), this.cadence);
           }
           const curElement = this.curElements.pop();
           setTimeout(() => {
               const els = this.operateOnElement(curElement);
               this.renderElement(curElement);
               this.newElements = this.newElements.concat(els);
               machine.processElementAsync();
           }, 0);
       }
       _advance() {
           const machine = this;
           if (this.remIterations === 0 ||
               this.halt) {
               return;
           }
           this.curElements = this.elements.toArray();
           Promise.resolve().then(() => machine.asyncCompute ? machine.processElementAsync() : machine.processElement());
       }
       advance(iterations) {
           var machine = this;
           this.remIterations = this.requestedIterations = iterations;
           this.newElements = [];
           machine._advance();
       }
   }
   var tickCounter = 0;
   const asyncRun = false;

   class BloomElement extends EntityElement {
       constructor(machine, state, callback) {
           super(machine, state, callback);
       }
       get id() { return this.state.id; }
       get angle() { return this.state.angle; }
       get segments() { return this.state.segments; }
   
       toString() {
           return JSON.stringify({
               id: this.id,
               parent_id: this.parent ? this.parent.id : null,
               x: this.x,
               y: this.y,
               angle: this.angle,
               segments: this.segments,
               children: this.children.length
           });
       }
       origin(scale) {
           return [this.x*scale, this.y*scale];
       }
       logPoint(p1,p2) {
           return '{,`$p1[0]`,`$p1[1]`,`$p2[0]`,`$p2[1]`}';
       }
       static bloom(el, iter, cb) {
           var self = this.state.settings;
           var getCartesianCoordinates = (angle, radius) => {
               return [Math.cos(angle*Math.PI/180)*radius, Math.sin(angle*Math.PI/180)*radius];
           };
           var start = self.segmentStartIndex;
           var end = el.segments + self.segmentStartIndex;
           for(var i=start; i<end; i++) {
               var _id = el.id + i.toString();
               var angle = el.angle + (self.branchAngle * (1/2+i-self.segments/2) );
               angle += (self.branchAngle/2 * self.twistFactor);
               angle = self.flipNegatives && angle < 0 ? 
                   360 - angle : 
                   angle;
               angle = self.skew && angle < self.skewAngle ? 
                   self.skewAngle - angle : 
                   angle;
               var ccoords = getCartesianCoordinates(angle, 1);
               if(el.parent !== el) 
                   el.children.push(new BloomElement(
                       el.machine, { 
                           settings: self,
                           id: _id, 
                           x: el.x + (ccoords[0]/iter), 
                           y: el.y + (ccoords[1]/iter), 
                           parent: el, 
                           angle: angle,  
                           segments: self.segments,
                           iteration: iter},
                           BloomElement.bloom));
           }
           el.state.parent = el;
           if(cb) cb(el.children);
           else return el.children;
       }
   }
   
   class GenerativeStateMachineRules {
       constructor(machine) {
           this.machine = machine;
           this._branchAngle = 120;
           this._segments = 3;
           this._flipNegatives = false;
           this._skew = false;
           this._skewAngle = 0;
           this._twistFactor = 0;
           this._segmentStartIndex = 1;
           this._numIterations = 5;
           this._asyncRender = false;
           this._scaleFactor = 1;
           this._offset = 0;
           this._usePoints = false;
           this._useLines = true;
           this._squared = true;
           this._pointScale = 16;
           this._variablePointSize = false;
           this._variableLineThickness = false;
           this._variableOpacity = true;
           this._lineThickness = 1;
           this._sceneOpacity = 1;
           this._colorHue = 0;
           this._globalCompositeOperation = 'darker';
           this._animationProperty = '_branchAngle';
           this._animationStart = 0
           this._animationEnd = 360
           this._animationSteps = 360
           this._animationReverse = false;
           this._animationLoop = false;
           this._animationAnimate = false;
           this._animationStepTime = 1000;  
           this._rotation = 0;  
           this._backgroundColor = new function() {
               const self = this
               this.color = [ 0, 0, 0, 255 ]; // RGB with alpha
               this.updated = () => {
                   const c = self.color;
                   const torgbh = (a) => {
                       const mr = Math.round
                       var o = '#', 
                           r = mr(a[0]).toString(16), 
                           g = mr(a[1]).toString(16), 
                           b = mr(a[2]).toString(16), 
                           h = mr(a[3]).toString(16);
                       o += r.length === 1 ? '0' + r : r
                       o += g.length === 1 ? '0' + g : g
                       o += b.length === 1 ? '0' + b : b
                       o += h.length === 1 ? '0' + h : h
                       return o
                   }
                   //document.body.style.background = torgbh(c);
               }
           };
       }
       get animationProperty() {return this._animationProperty;} 
       get animationStart() {return this._animationStart;} 
       get animationEnd() {return this._animationEnd;} 
       get animationSteps() {return this._animationSteps;} 
       get animationReverse() {return this._animationReverse;} 
       get animationLoop() {return this._animationLoop;} 
       get animationAnimate() {return this._animationAnimate;} 
       get animationStepTime() {return this._animationStepTime;} 
       get backgroundColor() {return this._backgroundColor;} 
       get rotation() {return this._rotation;} 
   
       get flipNegatives() {return this._flipNegatives;} 
       get segments() {return this._segments;}
       get skew() {return this._skew;}
       get skewAngle() {return this._skewAngle;}
       get branchAngle() {return this._branchAngle;}
       get segments() {return this._segments;}
       get twistFactor() {return this._twistFactor;}
       get segmentStartIndex() {return this._segmentStartIndex;}
       get asyncRender() { return this._asyncRender; }
       get numIterations() { return this._numIterations; }
       get scaleFactor() { return this._scaleFactor; }
       get offset() {  return this._offset; }
       get usePoints() { return this._usePoints; }
       get squared() { return this._squared; }
       get useLines() { return this._useLines; }
       get pointScale() { return this._pointScale; }
       get variablePointSize() { return this._variablePointSize; }
       get variableLineThickness() { return this._variableLineThickness; }
       get variableOpacity() { return this._variableOpacity; }
       get lineThickness() { return this._lineThickness; }
       get sceneOpacity() { return this._sceneOpacity; }
       get colorHue() { return this._colorHue; }
       get globalCompositeOperation() { return this._globalCompositeOperation; }
       set branchAngle(v) {this._branchAngle=v;this.settingsUpdated();}
       set segments(v) {this._segments=v;this.settingsUpdated();}
       set flipNegatives(v) {this._flipNegatives=v;this.settingsUpdated();}
       set skew(v) {this._skew=v;this.settingsUpdated();}
       set skewAngle(v) {this._skewAngle=v;this.settingsUpdated();}
       set twistFactor(v) {this._twistFactor=v;this.settingsUpdated();}
       set segmentStartIndex(v) {this._segmentStartIndex=v;this.settingsUpdated();}
   
       set animationProperty(v) {
           this._animationProperty = v;
           this.animationUpdated();
       }
       set animationStart(v) {
           this._animationStart = v;
           this.animationUpdated();
       }
       set animationEnd(v) {
           this.animationEnd = v;
           this.animationUpdated();
       }
       set animationSteps(v) {
           this._animationSteps = v;
           this.animationUpdated();
       }
       set animationReverse(v) {
           this._animationReverse = v;
           this.animationUpdated();
       }
       set animationLoop(v) {
           this._animationLoop = v;
           this.animationUpdated();
       }
       set animationAnimate(v) {
           this._animationAnimate = v;
           this.animationUpdated();
       }
       set animationStepTime(v) {
           this._animationStepTime = v;
           this.animationUpdated();
       }
       set numIterations(v) {
           this._numIterations = v;
           this.settingsUpdated();
       }
       set asyncRender(v) {
           this._asyncRender = v;
           asyncRun = v;//this.settingsUpdated();
       }
       set scaleFactor(v) {
           this._scaleFactor = v;
           this.scalingUpdated();
       }
       set offset(v) {
           this._offset = v;
           this.settingsUpdated();
       }
       set usePoints(v) {
           this._usePoints = v;
           this.settingsUpdated();
       }
       set useLines(v) {
           this._useLines = v;
           this.settingsUpdated();
       }
       set squared(v) {
           this._squared = v;
           this.settingsUpdated();
       }
       set pointScale(v) {
           this._pointScale = v;
           this.settingsUpdated();
       }
       set variablePointSize(v) {
           this._variablePointSize = v;
           this.settingsUpdated();
       }
       set variableLineThickness(v) {
           this._variableLineThickness = v;
           this.settingsUpdated();
       }
       set variableOpacity(v) {
           this._variableOpacity = v;
           this.settingsUpdated();
       }
       set lineThickness(v) {
           this._lineThickness = v;
           this.settingsUpdated();
       }
       set sceneOpacity(v) {
           this._sceneOpacity = v;
           this.opacityUpdated();
       }
       set colorHue(v) {
           this._colorHue = v;
           this.settingsUpdated();
       }
       set rotation(v) {
          this._rotation = v;
          this.rotationChanged();
       }
       set globalCompositeOperation(v) {
           this._globalCompositeOperation = v;
           this.settingsUpdated();
       }
       settingsUpdated() {
           stateMachine.stop();
           stateMachine.doEmitReset();
       }
       scalingUpdated() {
           foreground.scale.x = foreground.scale.y = this._scaleFactor;
       }
       opacityUpdated() {
           foreground.alpha = this._sceneOpacity;
       }
       rotationChanged() {
        foreground.angle =  this._rotation;
       }  
       animationUpdated() {
   
       }  
   }
   
   const initControls = (pxi_app) => {
       g = new this.dat.GUI()
       var folder = g.addFolder('Starting Conditions');
       folder.add(pxi_app, 'segments').min(2).step(1).onChange(pxi_app.settingsUpdated());
       folder.add(pxi_app, 'numIterations').min(1).step(1).onChange(pxi_app.settingsUpdated());
       folder.add(pxi_app, 'branchAngle', 1, 359).onChange(pxi_app.settingsUpdated());
       folder.add(pxi_app, 'twistFactor', -10, 10).onChange(pxi_app.settingsUpdated());
       folder.add(pxi_app, 'segmentStartIndex', 0, 5).onChange(pxi_app.settingsUpdated());
       folder.add(pxi_app, 'flipNegatives', 0, 5).onChange(pxi_app.settingsUpdated());
       folder.add(pxi_app, 'skew').onChange(pxi_app.settingsUpdated());
       folder.add(pxi_app, 'skewAngle', -359, 359).onChange(pxi_app.settingsUpdated());
       folder.open();
       folder = g.addFolder('Animator');
       folder.add(pxi_app, 'animationProperty', [
           'branchAngle',
           'skewAngle',
           'twistFactor',
           'segments'
       ]).onChange(pxi_app.settingsUpdated());
       folder.add(pxi_app, 'animationStart').onChange(pxi_app.animationUpdated());
       folder.add(pxi_app, 'animationEnd').onChange(pxi_app.animationUpdated());
       folder.add(pxi_app, 'animationSteps').onChange(pxi_app.animationUpdated());
       folder.add(pxi_app, 'animationReverse').onChange(pxi_app.animationUpdated());
       folder.add(pxi_app, 'animationLoop').onChange(pxi_app.animationUpdated());
       folder.add(pxi_app, 'animationStepTime',10, 10000).onChange(pxi_app.animationUpdated());
       folder.add(pxi_app, 'animationAnimate').onChange(pxi_app.animationUpdated());
       folder.open();
       folder = g.addFolder('Rendering');
       folder.add(pxi_app, 'asyncRender').onChange(pxi_app.settingsUpdated());
       folder.add(pxi_app, 'usePoints').onChange(pxi_app.settingsUpdated());
       folder.add(pxi_app, 'useLines').onChange(pxi_app.settingsUpdated());
       folder.add(pxi_app, 'pointScale').onChange(pxi_app.settingsUpdated());
       folder.add(pxi_app, 'variablePointSize').onChange(pxi_app.settingsUpdated());
       folder.add(pxi_app, 'variableLineThickness').onChange(pxi_app.settingsUpdated());
       folder.add(pxi_app, 'variableOpacity').onChange(pxi_app.settingsUpdated());
       folder.add(pxi_app, 'lineThickness').onChange(pxi_app.settingsUpdated());
       folder.add(pxi_app, 'sceneOpacity', 0, 1).onChange(pxi_app.opacityUpdated());
       folder.add(pxi_app, 'squared').onChange(pxi_app.opacityUpdated());
       folder.add(pxi_app, 'colorHue', 0, 256).onChange(pxi_app.settingsUpdated());
       folder.add(pxi_app, 'globalCompositeOperation', [
           'source-over',
           'source-in',
           'source-out',
           'source-stop',
           'destination-over',
           'destination-in',
           'destination-out',
           'destination-stop',
           'lighter',
           'darker',
           'copy',
           'xor',
           'multiply',
           'screen',
           'overlay',
           'darken',
           'lighten',
           'color-dodge',
           'color-burn',
           'hard-light',
           'difference',
           'exclusion',
           'hue',
           'saturation',
           'color',
           'luminosity'
       ]).onChange(pxi_app.settingsUpdated());
       folder.open();
       g.remember(window.fractalOfLife);
       folder = g.addFolder('Scaling');
       folder.add(pxi_app, 'scaleFactor', 0.01, 10.0).onChange(() => pxi_app.scalingUpdated());
       folder.add(pxi_app, 'rotation', 0, 260).onChange(() => pxi_app.rotationUpdated());
       folder.addColor(pxi_app.backgroundColor, 'color');
       folder.add(pxi_app, 'backgroundColor', () => { pxi_app.backgroundColor.updated()});  
       folder.open();
   };
   
   var singleton;
   
   class GenerativeStateMachine extends StateMachine {
       constructor() {
           super();
           singleton = this;
           this._onEmitElement = null;
           this._onEmitIteration = null;
           this._onEmitReset = null;
           this._rules = new GenerativeStateMachineRules(this);
           var machine = this;
           this.builders.add(new StateBuilder(machine, null, (el, iter) => {
               var nel = new BloomElement(
                   machine, {
                       settings: machine.rules, 
                       id: '', 
                       x: 0, 
                       y: 0, 
                       parent: null, 
                       angle: 0,
                       segments: machine.rules.segments},
                       BloomElement.bloom);
               machine.elements.add(nel);
           }));
           this.postIteration = (machine, els, iter) => {
               machine.doEmitIteration(els);
               machine.elements.clear();
               machine.elements.add(els);
           };
           this.renderers.add(new StateRenderer(machine, null, (el) =>
               machine.doEmitElement(el)
           ));
       }
       get rules () { return this._rules; }
       set rules (v) { this._rules = v; }
       get onEmitElement () { return this._onEmitElement; }
       set onEmitElement (v) { this._onEmitElement = v; }
       get onEmitIteration () { return this._onEmitIteration; }
       set onEmitIteration (v) { this._onEmitIteration = v; }
       get onEmitReset () { return this._onEmitReset; }
       set onEmitReset (v) { this._onEmitReset = v; }
       doEmitElement(el) {
           if(this.onEmitElement)
               this.onEmitElement(this, el);
       }
       doEmitIteration(els) {
           if(this.onEmitIteration)
               this.onEmitIteration(this, els);
       }
       doEmitReset() {
           if(this.onEmitReset)
               this.onEmitReset(this);
       }
   }
   var offset = (a, o) => {
     o = 0
       return [a[0] + o * 1.5, a[1] + o];
   };

   var graphics;
   var elem = document.body;
   var stats = new Stats();
   var scale = 1;
   var interval = 0.01;
   var dir = false;
   var g;
   var isBackground = false;
   var stateMachine = new GenerativeStateMachine();
   var colors;

   const rendeEl = (pxi_app, el) => {
       var iter = stateMachine.iteration;    
       var cb = stateMachine.rules
       var strokeWidth = cb.lineThickness;
       var varThick = cb.squared ? iter * iter : iter;
       strokeWidth = cb.variableLineThickness ?
           (cb.lineThickness / varThick) :
           cb.lineThickness;
       var strokeStyle = parseInt ('0x' + colors[iter]); //random_rgba(255 / iter, 255 / iter, 255 / iter, 255 / iter);
       var pointSize =
           cb.variablePointSize ?
           (256 * cb.scaleFactor) / (varThick * cb.pointScale) : cb.pointScale;
       var drawLine = (start, end) => {
           const opa = 0.5 * cb.variableOpacity ? 1 / varThick : 0.5;
           if (cb.useLines) {
               graphics = new PIXI.Graphics()
                 .lineStyle(strokeWidth, strokeStyle, opa)
                 .moveTo(start[0], start[1])
                 .beginFill(strokeStyle, opa)
                 .lineTo(end[0], end[1])
                 .endFill();
               //graphics.zOrder = 100 - iter;
               foreground.addChild(graphics);
           }
           if(cb.usePoints) {
               graphics = new PIXI.Graphics()
                 .lineStyle(0)
                 .beginFill(strokeStyle, opa)
                 .drawCircle(start[0], start[1], pointSize)
               //graphics.zOrder = 100 - iter;
               foreground.addChild(graphics);
              //  graphics = new PIXI.Graphics()
              //    .lineStyle(0)
              //    .beginFill(strokeStyle, opa)
              //    .drawCircle(start[0], start[1], pointSize)
              //  //graphics.zOrder = 100 - iter;
              //  foreground.addChild(graphics);
           }
       };
       if (stateMachine.halted) { return clearCanvas(pxi_app); }
       if(iter < 100) {
            var originCoords = offset(el.origin(256 * cb.scaleFactor), 256 * cb.scaleFactor);
            el.children.forEach((child) => {
                var childCoords = offset(child.origin(256 * cb.scaleFactor), 256 * cb.scaleFactor);
                drawLine(originCoords, childCoords);
            });
       }
   };

   const renderElement = (el) => {
       if (Array.isArray(el)) {
           el.forEach((e) => setTimeout(()=>rendeEl(stateMachine.rules, e), 0))
       } else { rendeEl(stateMachine.rules, el); }
   };

   const setupStateMachine = (callback) => {
     var scheme = new ColorScheme;
         scheme.from_hue(stateMachine.rules.colorHue)         
               .scheme('tetrade')   
               .variation('hard');
         colors = scheme.colors();
     var smRules = null;
     if (stateMachine) { smRules = stateMachine.rules; }
     stateMachine = new GenerativeStateMachine();
     if (smRules) { stateMachine.rules = smRules; }
     stateMachine.asyncCompute = smRules.asyncRender;
     stateMachine.onEmitIteration = (machine, el) => setTimeout(() => renderElement(el), 0);
     stateMachine.onEmitReset = (machine, el) => {
         stateMachine.stop();
         setupStateMachine(callback);
         stateMachine.run(stateMachine.rules.numIterations);
     }
     callback();
 }

