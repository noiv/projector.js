/*jslint forin: true, bitwise: true, browser: true, devel: true, debug: true, nomen: true, plusplus: true, sloppy: true, vars: true, white: true, indent: 2 */
/*globals  namedColors, H, Colors */


function Filter(cfg){

  var p, self = this;

  this.gcos = {
    "cop": "copy",
    "xor": "xor",
    "lig": "lighter",
    "sov": "source-over",
    "sin": "source-in",
    "sou": "source-out",
    "sat": "source-atop",
    "dov": "destination-over",
    "din": "destination-in",
    "dou": "destination-out",
    "dat": "destination-atop"
  };

  this.parent = null;
  
  this.width  = 1;
  this.height = 1;

  this.cfg = cfg || {};
  this.dom = false;
  this.projector = null;
  this.lastFrame = 0;
  this.curFrame  = 0;

  this.source = document.createElement("canvas");
  this.source.style.background = "transparent";
  this.ctx = this.source.getContext("2d");

  this.lastRect   = [];
  this.lastTrans  = [];
  this.lastInfo   = [];
  this.lastOps    = {};

  this.ops = { // overwrite to have out of the box working effects
    a: 0.9,    // alpha
    c: "",     // blendColor, "" => not active
    o: "sov",  // see gcos
    r: 0.0,    // rotation
    p: "rel",  // position: relative, center, dynamic, fil
    l: 0.5,    // left relative to target canvas
    t: 0.5,    // top
    w: 0.8,    // width
    h: 0.8     // height
  };

  for (p in cfg) {
    this[p] = cfg[p];}

}

Filter.prototype = {
  tick:         null,  /* gets show wide called, if defined, see mouse */
  load:         function (onloaded){onloaded();  /* probable overwrite, remember the callback */ },
  resize:       new Function(), // overwrite me if needed, see Feedback
  beforeDraw:   new Function(), // overwrite me for painting, see Delay, Spectrum
  afterDraw:    new Function(), // overwrite me for arithmetic, see Video
  afterRender:  new Function(), // overwrite me for very special features, see Feedback
  init: function (projector, onloaded){
    this.projector = projector;
    if(this.dom){
      document.getElementById("hidden").appendChild(this.source);
      this.source.title = this.name;
    }
    this.load(onloaded);
  },
  type: function() { 
     var funcNameRegex = /function (.{1,})\(/;
     var results = (funcNameRegex).exec((this).constructor.toString());
     return (results && results.length > 1) ? results[1] : "";
  },
  resizeToParent:   function (cvss){
    var self = this;
    cvss.forEach(function(cvs){
      if (typeof self.width === "string"){
        cvs.width  = self.width;
      } else {
        cvs.width  = self.parent.source.width  * self.width;
      }
      if (typeof self.height === "string"){
        cvs.height  = self.height;
      } else {
        cvs.height  = self.parent.source.height  * self.height;
      }

    });
  },
  applyFillColor:   function (color){
    this.ctx.fillStyle = Colors.read(color);
  },
  applyStrokeColor: function (color){
    this.ctx.strokeStyle = Colors.read(color);
  },
  applyFont:        function (font){

    // in:  [style,    weight, size,   align, font-family]
    // ex:  ["normal", "bold", 72/0.5,  "left", "sans-serif"],

    var f = font, size;

    // very basic check
    if (f.length !== 5){
      throw (this.name + ": can't handle font: " + f.join(", ")); }

    size = ~~( (typeof f[2] === "string") ? Number(f[2]) : this.parent.source.height * f[2]);

    this.ctx.font = [f[0], f[1], size+"px", f[4]].join(" ");
    this.ctx.textAlign = f[3];                                   
    this.ctx.textBaseline = "middle"; // always !!!!                                    

  },
  calcParams:      function (target, ops){

    var dX=0, dY=0, sX=1, sY=1, n=this.name,
        tw  = target.canvas.width,
        th  = target.canvas.height,
        sw  = (typeof ops.w === "string") ? ~~ops.w : tw * ops.w,
        sh  = (typeof ops.h === "string") ? ~~ops.h : th * ops.h,
        tl  = (typeof ops.l === "string") ? ~~ops.l : tw * ops.l,
        tt  = (typeof ops.t === "string") ? ~~ops.t : th * ops.t,
        r1  = -sw/2, r2 = -sh/2, r3 = sw, r4 = sh,
        rot =  ops.r / (180/Math.PI),
        as  = this.source.width / this.source.height,
        at  = tw / th;

    switch (ops.p) {

      case "cnt" :
        dX =  tw/2; dY =  th/2;
        break;

      case "dyn" :
      case "rel" :
        dX =  tl; dY = tt;
        break;

      case "fil":
        r1 = 0; r2 = 0; r3 = tw; r4 = th;
        break;

    }

    return [[r1, r2, r3, r4], [dX, dY, sX, sY, rot]];

  },
  connect: function( /* arguments */ ){

    var self = this, childs = [], drawOps,
        a, arg, args = Array.prototype.slice.call(arguments);

    for (a in args){
      arg = args[a];
      if (typeof        arg === "function"){
        childs.push(arg);
      } else if (typeof arg === "object"){
        drawOps = arg;
      } else {
        console.log("WTF");
      }
    }

    return function(message){

      var o, c, params, n = self.name,
          ops = H.clone(self.ops),
          ctx, frame, sector;

      if (message.command === "collect") {
        message.filters.push(self);
        for (c in childs){
          childs[c](message);}
        return;}

      if (message.command === "link") {
        self.parent = message.parent;
        self.resize();
        for (c in childs){
          message.parent = self;
          childs[c](message);}
        return;}

  // only command = 'render' left
      ctx = message.ctx;
      frame = message.frame;
      sector = message.sector;

      for (c in childs){
        message.ctx = self.ctx;
        childs[c](message);}

      for (o in drawOps) {
        if (o in self.ops){
          if (typeof drawOps[o] === "function") {
            ops[o] = drawOps[o]();
          } else {
            ops[o] = drawOps[o];
          }
        } else if (typeof self[o] !== "undefined") {
          if (typeof drawOps[o] === "function") {
            self[o] = drawOps[o]();
          } else {
            self[o] = drawOps[o];
          }
        } else {
          throw("|Filter: " + self.name + "|EFX operand: '" + o + "' not implemented");
        }
      }

      self.curFrame = frame;
      self.beforeDraw(ops, ctx);

      // turns ops into real pixel
      params = self.calcParams(ctx, ops, frame, sector);

      self.lastRect  = params[0].slice(0);
      self.lastTrans = params[1];
      self.lastOps   = ops;

      params[0].unshift(self.source);

      ctx.save();

      ctx.globalAlpha = ops.a;
      ctx.globalCompositeOperation = self.gcos[ops.o];

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(self.lastTrans[0], self.lastTrans[1]);
      ctx.scale(self.lastTrans[2], self.lastTrans[3]);
      ctx.rotate(self.lastTrans[4]);

      ctx.drawImage.apply(ctx, params[0]);

      if (ops.bc) {
        ctx.globalCompositeOperation = "source-atop";
        ctx.fillStyle = Colors.read(ops.bc);
        ctx.fillRect.apply(ctx, self.lastRect);}

      if (ops.c !== "") {
        ctx.fillStyle = Colors.read(ops.c);
        ctx.fillRect.apply(ctx, self.lastRect);}

      ctx.restore();

      self.afterDraw();

      self.lastFrame = frame;

    };
    
  }


};



// function createEffect(prototype){

//   var p, Effect = function(cfg){
//     Filter.apply(Effect, [cfg]);
//     for (p in prototype){
//       Effect.prototype[p] = prototype[p];
//     }
//   };

//   Effect.prototype = new Filter();
//   Effect.constructor = Effect;

//   return Effect;

//   // return function(cfg){
//   //   Filter.apply(obj, [cfg]);
//   //   for (p in prototype){
//   //     obj.prototype[p] =  prototype[p];
//   //   }
//   // };

// }
