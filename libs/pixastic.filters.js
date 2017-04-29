/*
 * Pixastic Lib - Blend - v0.1.1
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.blend = {

	process(params) {
		var amount = parseFloat(params.options.amount);
		var mode = (params.options.mode || "normal").toLowerCase();
		var image = params.options.image;

		amount = Math.max(0,Math.min(1,amount));

		if (!image) return false;

		if (Pixastic.Client.hasCanvasImageData()) {
            var rect = params.options.rect;
            var data = Pixastic.prepareData(params);
            var w = rect.width;
            var h = rect.height;

            params.useData = false;

            var otherCanvas = document.createElement("canvas");
            otherCanvas.width = params.canvas.width;
            otherCanvas.height = params.canvas.height;
            var otherCtx = otherCanvas.getContext("2d");
            otherCtx.drawImage(image,0,0);

            var params2 = {canvas:otherCanvas,options:params.options};
            var data2 = Pixastic.prepareData(params2);
            var dataDesc2 = params2.canvasData;

            var p = w*h;
            var pix = p*4;
            var pix1;
            var pix2;
            var r1;
            var g1;
            var b1;
            var r2;
            var g2;
            var b2;
            var r3;
            var g3;
            var b3;
            var r4;
            var g4;
            var b4;

            var dataChanged = false;

            switch (mode) {
				case "normal" : 
					//while (p--) {
					//	data2[pix-=4] = data2[pix];
					//	data2[pix1=pix+1] = data2[pix1];
					//	data2[pix2=pix+2] = data2[pix2];
					//}
					break;

				case "multiply" : 
					while (p--) {
						data2[pix-=4] = data[pix] * data2[pix] / 255;
						data2[pix1=pix+1] = data[pix1] * data2[pix1] / 255;
						data2[pix2=pix+2] = data[pix2] * data2[pix2] / 255;
					}
					dataChanged = true;
					break;

				case "lighten" : 
					while (p--) {
						if ((r1 = data[pix-=4]) > data2[pix])
							data2[pix] = r1;
						if ((g1 = data[pix1=pix+1]) > data2[pix1])
							data2[pix1] = g1;
						if ((b1 = data[pix2=pix+2]) > data2[pix2])
							data2[pix2] = b1;
					}
					dataChanged = true;
					break;

				case "darken" : 
					while (p--) {
						if ((r1 = data[pix-=4]) < data2[pix])
							data2[pix] = r1;
						if ((g1 = data[pix1=pix+1]) < data2[pix1])
							data2[pix1] = g1;
						if ((b1 = data[pix2=pix+2]) < data2[pix2])
							data2[pix2] = b1;

					}
					dataChanged = true;
					break;

				case "darkercolor" : 
					while (p--) {
						if (((r1 = data[pix-=4])*0.3+(g1 = data[pix1=pix+1])*0.59+(b1 = data[pix2=pix+2])*0.11) <= (data2[pix]*0.3+data2[pix1]*0.59+data2[pix2]*0.11)) {
							data2[pix] = r1;
							data2[pix1] = g1;
							data2[pix2] = b1;
						}
					}
					dataChanged = true;
					break;

				case "lightercolor" : 
					while (p--) {
						if (((r1 = data[pix-=4])*0.3+(g1 = data[pix1=pix+1])*0.59+(b1 = data[pix2=pix+2])*0.11) > (data2[pix]*0.3+data2[pix1]*0.59+data2[pix2]*0.11)) {
							data2[pix] = r1;
							data2[pix1] = g1;
							data2[pix2] = b1;
						}
					}
					dataChanged = true;
					break;

				case "lineardodge" : 
					/*
					otherCtx.globalCompositeOperation = "source-over";
					otherCtx.drawImage(params.canvas, 0, 0);
					otherCtx.globalCompositeOperation = "lighter";
					otherCtx.drawImage(image, 0, 0);
					*/

					while (p--) {
						if ((r3 = data[pix-=4] + data2[pix]) > 255)
							data2[pix] = 255;
						else
							data2[pix] = r3;
						if ((g3 = data[pix1=pix+1] + data2[pix1]) > 255)
							data2[pix1] = 255;
						else
							data2[pix1] = g3;
						if ((b3 = data[pix2=pix+2] + data2[pix2]) > 255)
							data2[pix2] = 255;
						else
							data2[pix2] = b3;
					}
					dataChanged = true;

					break;

				case "linearburn" : 
					while (p--) {
						if ((r3 = data[pix-=4] + data2[pix]) < 255)
							data2[pix] = 0;
						else
							data2[pix] = (r3 - 255);
						if ((g3 = data[pix1=pix+1] + data2[pix1]) < 255)
							data2[pix1] = 0;
						else
							data2[pix1] = (g3 - 255);
						if ((b3 = data[pix2=pix+2] + data2[pix2]) < 255)
							data2[pix2] = 0;
						else
							data2[pix2] = (b3 - 255);
					}
					dataChanged = true;
					break;

				case "difference" : 
					while (p--) {
						if ((r3 = data[pix-=4] - data2[pix]) < 0)
							data2[pix] = -r3;
						else
							data2[pix] = r3;
						if ((g3 = data[pix1=pix+1] - data2[pix1]) < 0)
							data2[pix1] = -g3;
						else
							data2[pix1] = g3;
						if ((b3 = data[pix2=pix+2] - data2[pix2]) < 0)
							data2[pix2] = -b3;
						else
							data2[pix2] = b3;
					}
					dataChanged = true;
					break;

				case "screen" : 
					while (p--) {
						data2[pix-=4] = (255 - ( ((255-data2[pix])*(255-data[pix])) >> 8));
						data2[pix1=pix+1] = (255 - ( ((255-data2[pix1])*(255-data[pix1])) >> 8));
						data2[pix2=pix+2] = (255 - ( ((255-data2[pix2])*(255-data[pix2])) >> 8));
					}
					dataChanged = true;
					break;

				case "exclusion" : 
					var div_2_255 = 2 / 255;
					while (p--) {
						data2[pix-=4] = (r1 = data[pix]) - (r1 * div_2_255 - 1) * data2[pix];
						data2[pix1=pix+1] = (g1 = data[pix1]) - (g1 * div_2_255 - 1) * data2[pix1];
						data2[pix2=pix+2] = (b1 = data[pix2]) - (b1 * div_2_255 - 1) * data2[pix2];
					}
					dataChanged = true;
					break;

				case "overlay" : 
					var div_2_255 = 2 / 255;
					while (p--) {
						if ((r1 = data[pix-=4]) < 128)
							data2[pix] = data2[pix]*r1*div_2_255;
						else
							data2[pix] = 255 - (255-data2[pix])*(255-r1)*div_2_255;

						if ((g1 = data[pix1=pix+1]) < 128)
							data2[pix1] = data2[pix1]*g1*div_2_255;
						else
							data2[pix1] = 255 - (255-data2[pix1])*(255-g1)*div_2_255;

						if ((b1 = data[pix2=pix+2]) < 128)
							data2[pix2] = data2[pix2]*b1*div_2_255;
						else
							data2[pix2] = 255 - (255-data2[pix2])*(255-b1)*div_2_255;

					}
					dataChanged = true;
					break;

				case "softlight" : 
					var div_2_255 = 2 / 255;
					while (p--) {
						if ((r1 = data[pix-=4]) < 128)
							data2[pix] = ((data2[pix]>>1) + 64) * r1 * div_2_255;
						else
							data2[pix] = 255 - (191 - (data2[pix]>>1)) * (255-r1) * div_2_255;

						if ((g1 = data[pix1=pix+1]) < 128)
							data2[pix1] = ((data2[pix1]>>1)+64) * g1 * div_2_255;
						else
							data2[pix1] = 255 - (191 - (data2[pix1]>>1)) * (255-g1) * div_2_255;

						if ((b1 = data[pix2=pix+2]) < 128)
							data2[pix2] = ((data2[pix2]>>1)+64) * b1 * div_2_255;
						else
							data2[pix2] = 255 - (191 - (data2[pix2]>>1)) * (255-b1) * div_2_255;

					}
					dataChanged = true;
					break;

				case "hardlight" : 
					var div_2_255 = 2 / 255;
					while (p--) {
						if ((r2 = data2[pix-=4]) < 128)
							data2[pix] = data[pix] * r2 * div_2_255;
						else
							data2[pix] = 255 - (255-data[pix]) * (255-r2) * div_2_255;

						if ((g2 = data2[pix1=pix+1]) < 128)
							data2[pix1] = data[pix1] * g2 * div_2_255;
						else
							data2[pix1] = 255 - (255-data[pix1]) * (255-g2) * div_2_255;

						if ((b2 = data2[pix2=pix+2]) < 128)
							data2[pix2] = data[pix2] * b2 * div_2_255;
						else
							data2[pix2] = 255 - (255-data[pix2]) * (255-b2) * div_2_255;

					}
					dataChanged = true;
					break;

				case "colordodge" : 
					while (p--) {
						if ((r3 = (data[pix-=4]<<8)/(255-(r2 = data2[pix]))) > 255 || r2 == 255)
							data2[pix] = 255;
						else
							data2[pix] = r3;

						if ((g3 = (data[pix1=pix+1]<<8)/(255-(g2 = data2[pix1]))) > 255 || g2 == 255)
							data2[pix1] = 255;
						else
							data2[pix1] = g3;

						if ((b3 = (data[pix2=pix+2]<<8)/(255-(b2 = data2[pix2]))) > 255 || b2 == 255)
							data2[pix2] = 255;
						else
							data2[pix2] = b3;
					}
					dataChanged = true;
					break;

				case "colorburn" : 
					while (p--) {
						if ((r3 = 255-((255-data[pix-=4])<<8)/data2[pix]) < 0 || data2[pix] == 0)
							data2[pix] = 0;
						else
							data2[pix] = r3;

						if ((g3 = 255-((255-data[pix1=pix+1])<<8)/data2[pix1]) < 0 || data2[pix1] == 0)
							data2[pix1] = 0;
						else
							data2[pix1] = g3;

						if ((b3 = 255-((255-data[pix2=pix+2])<<8)/data2[pix2]) < 0 || data2[pix2] == 0)
							data2[pix2] = 0;
						else
							data2[pix2] = b3;
					}
					dataChanged = true;
					break;

				case "linearlight" : 
					while (p--) {
						if ( ((r3 = 2*(r2=data2[pix-=4])+data[pix]-256) < 0) || (r2 < 128 && r3 < 0)) {
							data2[pix] = 0
						} else {
							if (r3 > 255)
								data2[pix] = 255;
							else
								data2[pix] = r3;
						}
						if ( ((g3 = 2*(g2=data2[pix1=pix+1])+data[pix1]-256) < 0) || (g2 < 128 && g3 < 0)) {
							data2[pix1] = 0
						} else {
							if (g3 > 255)
								data2[pix1] = 255;
							else
								data2[pix1] = g3;
						}
						if ( ((b3 = 2*(b2=data2[pix2=pix+2])+data[pix2]-256) < 0) || (b2 < 128 && b3 < 0)) {
							data2[pix2] = 0
						} else {
							if (b3 > 255)
								data2[pix2] = 255;
							else
								data2[pix2] = b3;
						}
					}
					dataChanged = true;
					break;

				case "vividlight" : 
					while (p--) {
						if ((r2=data2[pix-=4]) < 128) {
							if (r2) {
								if ((r3 = 255 - ((255-data[pix])<<8) / (2*r2)) < 0) 
									data2[pix] = 0;
								else
									data2[pix] = r3
							} else {
								data2[pix] = 0;
							}
						} else if ((r3 = (r4=2*r2-256)) < 255) {
							if ((r3 = (data[pix]<<8)/(255-r4)) > 255) 
								data2[pix] = 255;
							else
								data2[pix] = r3;
						} else {
							if (r3 < 0) 
								data2[pix] = 0;
							else
								data2[pix] = r3
						}

						if ((g2=data2[pix1=pix+1]) < 128) {
							if (g2) {
								if ((g3 = 255 - ((255-data[pix1])<<8) / (2*g2)) < 0) 
									data2[pix1] = 0;
								else
									data2[pix1] = g3;
							} else {
								data2[pix1] = 0;
							}
						} else if ((g3 = (g4=2*g2-256)) < 255) {
							if ((g3 = (data[pix1]<<8)/(255-g4)) > 255)
								data2[pix1] = 255;
							else
								data2[pix1] = g3;
						} else {
							if (g3 < 0) 
								data2[pix1] = 0;
							else
								data2[pix1] = g3;
						}

						if ((b2=data2[pix2=pix+2]) < 128) {
							if (b2) {
								if ((b3 = 255 - ((255-data[pix2])<<8) / (2*b2)) < 0) 
									data2[pix2] = 0;
								else
									data2[pix2] = b3;
							} else {
								data2[pix2] = 0;
							}
						} else if ((b3 = (b4=2*b2-256)) < 255) {
							if ((b3 = (data[pix2]<<8)/(255-b4)) > 255) 
								data2[pix2] = 255;
							else
								data2[pix2] = b3;
						} else {
							if (b3 < 0) 
								data2[pix2] = 0;
							else
								data2[pix2] = b3;
						}
					}
					dataChanged = true;
					break;

				case "pinlight" : 
					while (p--) {
						if ((r2=data2[pix-=4]) < 128)
							if ((r1=data[pix]) < (r4=2*r2))
								data2[pix] = r1;
							else
								data2[pix] = r4;
						else
							if ((r1=data[pix]) > (r4=2*r2-256))
								data2[pix] = r1;
							else
								data2[pix] = r4;

						if ((g2=data2[pix1=pix+1]) < 128)
							if ((g1=data[pix1]) < (g4=2*g2))
								data2[pix1] = g1;
							else
								data2[pix1] = g4;
						else
							if ((g1=data[pix1]) > (g4=2*g2-256))
								data2[pix1] = g1;
							else
								data2[pix1] = g4;

						if ((r2=data2[pix2=pix+2]) < 128)
							if ((r1=data[pix2]) < (r4=2*r2))
								data2[pix2] = r1;
							else
								data2[pix2] = r4;
						else
							if ((r1=data[pix2]) > (r4=2*r2-256))
								data2[pix2] = r1;
							else
								data2[pix2] = r4;
					}
					dataChanged = true;
					break;

				case "hardmix" : 
					while (p--) {
						if ((r2 = data2[pix-=4]) < 128)
							if (255 - ((255-data[pix])<<8)/(2*r2) < 128 || r2 == 0)
								data2[pix] = 0;
							else
								data2[pix] = 255;
						else if ((r4=2*r2-256) < 255 && (data[pix]<<8)/(255-r4) < 128)
							data2[pix] = 0;
						else
							data2[pix] = 255;

						if ((g2 = data2[pix1=pix+1]) < 128)
							if (255 - ((255-data[pix1])<<8)/(2*g2) < 128 || g2 == 0)
								data2[pix1] = 0;
							else
								data2[pix1] = 255;
						else if ((g4=2*g2-256) < 255 && (data[pix1]<<8)/(255-g4) < 128)
							data2[pix1] = 0;
						else
							data2[pix1] = 255;

						if ((b2 = data2[pix2=pix+2]) < 128)
							if (255 - ((255-data[pix2])<<8)/(2*b2) < 128 || b2 == 0)
								data2[pix2] = 0;
							else
								data2[pix2] = 255;
						else if ((b4=2*b2-256) < 255 && (data[pix2]<<8)/(255-b4) < 128)
							data2[pix2] = 0;
						else
							data2[pix2] = 255;
					}
					dataChanged = true;
					break;
			}

            if (dataChanged) 
				otherCtx.putImageData(dataDesc2,0,0);

            if (amount != 1 && !Pixastic.Client.hasGlobalAlpha()) {
				var p = w*h;
				var amount2 = amount;
				var amount1 = 1 - amount;
				while (p--) {
					var pix = p*4;
					var r = (data[pix] * amount1 + data2[pix] * amount2)>>0;
					var g = (data[pix+1] * amount1 + data2[pix+1] * amount2)>>0;
					var b = (data[pix+2] * amount1 + data2[pix+2] * amount2)>>0;

					data[pix] = r;
					data[pix+1] = g;
					data[pix+2] = b;
				}
				params.useData = true;
			} else {
				var ctx = params.canvas.getContext("2d");
				ctx.save();
				ctx.globalAlpha = amount;
				ctx.drawImage(
					otherCanvas,
					0,0,rect.width,rect.height,
					rect.left,rect.top,rect.width,rect.height
				);
				ctx.globalAlpha = 1;
				ctx.restore();
			}

            return true;
        }
	},
	checkSupport() {
		return Pixastic.Client.hasCanvasImageData();
	}
}/*
 * Pixastic Lib - Blur filter - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.blur = {
	process(params) {

		if (typeof params.options.fixMargin == "undefined")
			params.options.fixMargin = true;

		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);
			var dataCopy = Pixastic.prepareData(params, true)

			/*
			var kernel = [
				[0.5, 	1, 	0.5],
				[1, 	2, 	1],
				[0.5, 	1, 	0.5]
			];
			*/

			var kernel = [
				[0, 	1, 	0],
				[1, 	2, 	1],
				[0, 	1, 	0]
			];

			var weight = 0;
			for (var i=0;i<3;i++) {
				for (var j=0;j<3;j++) {
					weight += kernel[i][j];
				}
			}

			weight = 1 / (weight*2);

			var rect = params.options.rect;
			var w = rect.width;
			var h = rect.height;

			var w4 = w*4;
			var y = h;
			do {
				var offsetY = (y-1)*w4;

				var prevY = (y == 1) ? 0 : y-2;
				var nextY = (y == h) ? y - 1 : y;

				var offsetYPrev = prevY*w*4;
				var offsetYNext = nextY*w*4;

				var x = w;
				do {
					var offset = offsetY + (x*4-4);

					var offsetPrev = offsetYPrev + ((x == 1) ? 0 : x-2) * 4;
					var offsetNext = offsetYNext + ((x == w) ? x-1 : x) * 4;
	
					data[offset] = (
						/*
						dataCopy[offsetPrev - 4]
						+ dataCopy[offsetPrev+4] 
						+ dataCopy[offsetNext - 4]
						+ dataCopy[offsetNext+4]
						+ 
						*/
						((dataCopy[offsetPrev]
						+ dataCopy[offset-4]
						+ dataCopy[offset+4]
						+ dataCopy[offsetNext])		* 2 + dataCopy[offset] 		* 4)
						) * weight;

					data[offset+1] = (
						/*
						dataCopy[offsetPrev - 3]
						+ dataCopy[offsetPrev+5] 
						+ dataCopy[offsetNext - 3] 
						+ dataCopy[offsetNext+5]
						+ 
						*/
						((dataCopy[offsetPrev+1]
						+ dataCopy[offset-3]
						+ dataCopy[offset+5]
						+ dataCopy[offsetNext+1])	* 2 + dataCopy[offset+1] 		* 4)
						) * weight;

					data[offset+2] = (
						/*
						dataCopy[offsetPrev - 2] 
						+ dataCopy[offsetPrev+6] 
						+ dataCopy[offsetNext - 2] 
						+ dataCopy[offsetNext+6]
						+ 
						*/
						((dataCopy[offsetPrev+2]
						+ dataCopy[offset-2]
						+ dataCopy[offset+6]
						+ dataCopy[offsetNext+2])	* 2 + dataCopy[offset+2] 		* 4)
						) * weight;

				} while (--x);
			} while (--y);

			return true;

		} else if (Pixastic.Client.isIE()) {
			params.image.style.filter += " progid:DXImageTransform.Microsoft.Blur(pixelradius=1.5)";

			if (params.options.fixMargin) {
				params.image.style.marginLeft = (parseInt(params.image.style.marginLeft,10)||0) - 2 + "px";
				params.image.style.marginTop = (parseInt(params.image.style.marginTop,10)||0) - 2 + "px";
			}

			return true;
		}
	},
	checkSupport() {
		return (Pixastic.Client.hasCanvasImageData() || Pixastic.Client.isIE());
	}
}/*
 * Pixastic Lib - Blur Fast - v0.1.1
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.blurfast = {
	process(params) {

		var amount = parseFloat(params.options.amount)||0;
		var clear = !!(params.options.clear && params.options.clear != "false");

		amount = Math.max(0,Math.min(5,amount));

		if (Pixastic.Client.hasCanvas()) {
			var rect = params.options.rect;

			var ctx = params.canvas.getContext("2d");
			ctx.save();
			ctx.beginPath();
			ctx.rect(rect.left, rect.top, rect.width, rect.height);
			ctx.clip();

			var scale = 2;
			var smallWidth = Math.round(params.width / scale);
			var smallHeight = Math.round(params.height / scale);

			var copy = document.createElement("canvas");
			copy.width = smallWidth;
			copy.height = smallHeight;

			var clear = false;
			var steps = Math.round(amount * 20);

			var copyCtx = copy.getContext("2d");
			for (var i=0;i<steps;i++) {
				var scaledWidth = Math.max(1,Math.round(smallWidth - i));
				var scaledHeight = Math.max(1,Math.round(smallHeight - i));
	
				copyCtx.clearRect(0,0,smallWidth,smallHeight);
	
				copyCtx.drawImage(
					params.canvas,
					0,0,params.width,params.height,
					0,0,scaledWidth,scaledHeight
				);
	
				if (clear)
					ctx.clearRect(rect.left,rect.top,rect.width,rect.height);
	
				ctx.drawImage(
					copy,
					0,0,scaledWidth,scaledHeight,
					0,0,params.width,params.height
				);
			}

			ctx.restore();

			params.useData = false;
			return true;
		} else if (Pixastic.Client.isIE()) {
			var radius = 10 * amount;
			params.image.style.filter += " progid:DXImageTransform.Microsoft.Blur(pixelradius=" + radius + ")";

			if (params.options.fixMargin || 1) {
				params.image.style.marginLeft = (parseInt(params.image.style.marginLeft,10)||0) - Math.round(radius) + "px";
				params.image.style.marginTop = (parseInt(params.image.style.marginTop,10)||0) - Math.round(radius) + "px";
			}

			return true;
		}
	},
	checkSupport() {
		return (Pixastic.Client.hasCanvas() || Pixastic.Client.isIE());
	}
}
/*
 * Pixastic Lib - Brightness/Contrast filter - v0.1.1
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.brightness = {

	process(params) {

		var brightness = parseInt(params.options.brightness,10) || 0;
		var contrast = parseFloat(params.options.contrast)||0;
		var legacy = !!(params.options.legacy && params.options.legacy != "false");

		if (legacy) {
			brightness = Math.min(150,Math.max(-150,brightness));
		} else {
			var brightMul = 1 + Math.min(150,Math.max(-150,brightness)) / 150;
		}
		contrast = Math.max(0,contrast+1);

		if (Pixastic.Client.hasCanvasImageData()) {
            var data = Pixastic.prepareData(params);
            var rect = params.options.rect;
            var w = rect.width;
            var h = rect.height;

            var p = w*h;
            var pix = p*4;
            var pix1;
            var pix2;
            var mul;
            var add;
            if (contrast != 1) {
				if (legacy) {
					mul = contrast;
					add = (brightness - 128) * contrast + 128;
				} else {
					mul = brightMul * contrast;
					add = - contrast * 128 + 128;
				}
			} else {  // this if-then is not necessary anymore, is it?
				if (legacy) {
					mul = 1;
					add = brightness;
				} else {
					mul = brightMul;
					add = 0;
				}
			}
            var r;
            var g;
            var b;
            while (p--) {
				if ((r = data[pix-=4] * mul + add) > 255 )
					data[pix] = 255;
				else if (r < 0)
					data[pix] = 0;
				else
 					data[pix] = r;

				if ((g = data[pix1=pix+1] * mul + add) > 255 ) 
					data[pix1] = 255;
				else if (g < 0)
					data[pix1] = 0;
				else
					data[pix1] = g;

				if ((b = data[pix2=pix+2] * mul + add) > 255 ) 
					data[pix2] = 255;
				else if (b < 0)
					data[pix2] = 0;
				else
					data[pix2] = b;
			}
            return true;
        }
	},
	checkSupport() {
		return Pixastic.Client.hasCanvasImageData();
	}
}

/*
 * Pixastic Lib - Color adjust filter - v0.1.1
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.coloradjust = {

	process(params) {
		var red = parseFloat(params.options.red) || 0;
		var green = parseFloat(params.options.green) || 0;
		var blue = parseFloat(params.options.blue) || 0;

		red = Math.round(red*255);
		green = Math.round(green*255);
		blue = Math.round(blue*255);

		if (Pixastic.Client.hasCanvasImageData()) {
            var data = Pixastic.prepareData(params);
            var rect = params.options.rect;

            var p = rect.width*rect.height;
            var pix = p*4;
            var pix1;
            var pix2;
            var r;
            var g;
            var b;
            while (p--) {
				pix -= 4;

				if (red) {
					if ((r = data[pix] + red) < 0 ) 
						data[pix] = 0;
					else if (r > 255 ) 
						data[pix] = 255;
					else
						data[pix] = r;
				}

				if (green) {
					if ((g = data[pix1=pix+1] + green) < 0 ) 
						data[pix1] = 0;
					else if (g > 255 ) 
						data[pix1] = 255;
					else
						data[pix1] = g;
				}

				if (blue) {
					if ((b = data[pix2=pix+2] + blue) < 0 ) 
						data[pix2] = 0;
					else if (b > 255 ) 
						data[pix2] = 255;
					else
						data[pix2] = b;
				}
			}
            return true;
        }
	},
	checkSupport() {
		return (Pixastic.Client.hasCanvasImageData());
	}
}
/*
 * Pixastic Lib - Histogram - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */


Pixastic.Actions.colorhistogram = {

	array256(default_value) {
		arr = [];
		for (var i=0; i<256; i++) { arr[i] = default_value; }
		return arr
	},
 
	process(params) {
		var values = [];
		if (typeof params.options.returnValue != "object") {
			params.options.returnValue = {rvals:[], gvals:[], bvals:[]};
		}
		var paint = !!(params.options.paint);

		var returnValue = params.options.returnValue;
		if (typeof returnValue.values != "array") {
			returnValue.rvals = [];
			returnValue.gvals = [];
			returnValue.bvals = [];
		}
 
		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);
			params.useData = false;
 
			var rvals = this.array256(0);
			var gvals = this.array256(0);
			var bvals = this.array256(0);
 
			var rect = params.options.rect;

			var p = rect.width*rect.height;
			var pix = p*4;
			while (p--) {
				rvals[data[pix-=4]]++;
				gvals[data[pix+1]]++;
				bvals[data[pix+2]]++;
			}
 
			returnValue.rvals = rvals;
			returnValue.gvals = gvals;
			returnValue.bvals = bvals;

			if (paint) {
				var ctx = params.canvas.getContext("2d");
				var vals = [rvals, gvals, bvals];
				for (var v=0;v<3;v++) {
					var yoff = (v+1) * params.height / 3;
					var maxValue = 0;
					for (var i=0;i<256;i++) {
						if (vals[v][i] > maxValue)
							maxValue = vals[v][i];
					}
					var heightScale = params.height / 3 / maxValue;
					var widthScale = params.width / 256;
					if (v==0) ctx.fillStyle = "rgba(255,0,0,0.5)";
					else if (v==1) ctx.fillStyle = "rgba(0,255,0,0.5)";
					else if (v==2) ctx.fillStyle = "rgba(0,0,255,0.5)";
					for (var i=0;i<256;i++) {
						ctx.fillRect(
							i * widthScale, params.height - heightScale * vals[v][i] - params.height + yoff,
							widthScale, vals[v][i] * heightScale
						);
					}
				}
			}
			return true;
		}
	},

	checkSupport() {
		return Pixastic.Client.hasCanvasImageData();
	}
}/*
 * Pixastic Lib - Crop - v0.1.1
 * Copyright (c) 2008-2009 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.crop = {
	process(params) {
		if (Pixastic.Client.hasCanvas()) {
			var rect = params.options.rect;

			var width = rect.width;
			var height = rect.height;
			var top = rect.top;
			var left = rect.left;

			if (typeof params.options.left != "undefined")
				left = parseInt(params.options.left,10);
			if (typeof params.options.top != "undefined")
				top = parseInt(params.options.top,10);
			if (typeof params.options.height != "undefined")
				width = parseInt(params.options.width,10);
			if (typeof params.options.height != "undefined")
				height = parseInt(params.options.height,10);

			if (left < 0) left = 0;
			if (left > params.width-1) left = params.width-1;

			if (top < 0) top = 0;
			if (top > params.height-1) top = params.height-1;

			if (width < 1) width = 1;
			if (left + width > params.width)
				width = params.width - left;

			if (height < 1) height = 1;
			if (top + height > params.height)
				height = params.height - top;

			var copy = document.createElement("canvas");
			copy.width = params.width;
			copy.height = params.height;
			copy.getContext("2d").drawImage(params.canvas,0,0);

			params.canvas.width = width;
			params.canvas.height = height;
			params.canvas.getContext("2d").clearRect(0,0,width,height);

			params.canvas.getContext("2d").drawImage(copy,
				left,top,width,height,
				0,0,width,height
			);

			params.useData = false;
			return true;
		}
	},
	checkSupport() {
		return Pixastic.Client.hasCanvas();
	}
}


/*
 * Pixastic Lib - Desaturation filter - v0.1.1
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.desaturate = {

	process(params) {
		var useAverage = !!(params.options.average && params.options.average != "false");

		if (Pixastic.Client.hasCanvasImageData()) {
            var data = Pixastic.prepareData(params);
            var rect = params.options.rect;
            var w = rect.width;
            var h = rect.height;

            var p = w*h;
            var pix = p*4;
            var pix1;
            var pix2;

            if (useAverage) {
				while (p--) 
					data[pix-=4] = data[pix1=pix+1] = data[pix2=pix+2] = (data[pix]+data[pix1]+data[pix2])/3
			} else {
				while (p--)
					data[pix-=4] = data[pix1=pix+1] = data[pix2=pix+2] = (data[pix]*0.3 + data[pix1]*0.59 + data[pix2]*0.11);
			}
            return true;
        } else if (Pixastic.Client.isIE()) {
			params.image.style.filter += " gray";
			return true;
		}
	},
	checkSupport() {
		return (Pixastic.Client.hasCanvasImageData() || Pixastic.Client.isIE());
	}
}/*
 * Pixastic Lib - Edge detection filter - v0.1.1
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.edges = {
	process(params) {

		var mono = !!(params.options.mono && params.options.mono != "false");
		var invert = !!(params.options.invert && params.options.invert != "false");

		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);
			var dataCopy = Pixastic.prepareData(params, true)

			var c = -1/8;
			var kernel = [
				[c, 	c, 	c],
				[c, 	1, 	c],
				[c, 	c, 	c]
			];

			weight = 1/c;

			var rect = params.options.rect;
			var w = rect.width;
			var h = rect.height;

			var w4 = w*4;
			var y = h;
			do {
				var offsetY = (y-1)*w4;

				var nextY = (y == h) ? y - 1 : y;
				var prevY = (y == 1) ? 0 : y-2;

				var offsetYPrev = prevY*w*4;
				var offsetYNext = nextY*w*4;

				var x = w;
				do {
					var offset = offsetY + (x*4-4);

					var offsetPrev = offsetYPrev + ((x == 1) ? 0 : x-2) * 4;
					var offsetNext = offsetYNext + ((x == w) ? x-1 : x) * 4;
	
					var r = ((dataCopy[offsetPrev-4]
						+ dataCopy[offsetPrev]
						+ dataCopy[offsetPrev+4]
						+ dataCopy[offset-4]
						+ dataCopy[offset+4]
						+ dataCopy[offsetNext-4]
						+ dataCopy[offsetNext]
						+ dataCopy[offsetNext+4]) * c
						+ dataCopy[offset]
						) 
						* weight;
	
					var g = ((dataCopy[offsetPrev-3]
						+ dataCopy[offsetPrev+1]
						+ dataCopy[offsetPrev+5]
						+ dataCopy[offset-3]
						+ dataCopy[offset+5]
						+ dataCopy[offsetNext-3]
						+ dataCopy[offsetNext+1]
						+ dataCopy[offsetNext+5]) * c
						+ dataCopy[offset+1])
						* weight;
	
					var b = ((dataCopy[offsetPrev-2]
						+ dataCopy[offsetPrev+2]
						+ dataCopy[offsetPrev+6]
						+ dataCopy[offset-2]
						+ dataCopy[offset+6]
						+ dataCopy[offsetNext-2]
						+ dataCopy[offsetNext+2]
						+ dataCopy[offsetNext+6]) * c
						+ dataCopy[offset+2])
						* weight;

					if (mono) {
						var brightness = (r*0.3 + g*0.59 + b*0.11)||0;
						if (invert) brightness = 255 - brightness;
						if (brightness < 0 ) brightness = 0;
						if (brightness > 255 ) brightness = 255;
						r = g = b = brightness;
					} else {
						if (invert) {
							r = 255 - r;
							g = 255 - g;
							b = 255 - b;
						}
						if (r < 0 ) r = 0;
						if (g < 0 ) g = 0;
						if (b < 0 ) b = 0;
						if (r > 255 ) r = 255;
						if (g > 255 ) g = 255;
						if (b > 255 ) b = 255;
					}

					data[offset] = r;
					data[offset+1] = g;
					data[offset+2] = b;

				} while (--x);
			} while (--y);

			return true;
		}
	},
	checkSupport() {
		return Pixastic.Client.hasCanvasImageData();
	}
}

/*
 * Pixastic Lib - Edge detection 2 - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 * 
 * Contribution by Oliver Hunt (http://nerget.com/, http://nerget.com/canvas/edgeDetection.js). Thanks Oliver!
 *
 */

Pixastic.Actions.edges3 = {
	process(params) {

		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);
			var dataCopy = Pixastic.prepareData(params, true)

			var rect = params.options.rect;
			var w = rect.width;
			var h = rect.height;

			var w4 = w * 4;
			var pixel = w4 + 4; // Start at (1,1)
			var hm1 = h - 1;
			var wm1 = w - 1;

			var tU = params.tUpper;
			var tL = params.tLower;

			for (var y = 1; y < hm1; ++y) {
                // Prepare initial cached values for current row
                var centerRow = pixel - 4;
                var priorRow = centerRow - w4;
                var nextRow = centerRow + w4;

                var r1 = - dataCopy[priorRow]   - dataCopy[centerRow]   - dataCopy[nextRow];
                var g1 = - dataCopy[++priorRow] - dataCopy[++centerRow] - dataCopy[++nextRow];
                var b1 = - dataCopy[++priorRow] - dataCopy[++centerRow] - dataCopy[++nextRow];

                var rp = dataCopy[priorRow += 2];
                var gp = dataCopy[++priorRow];
                var bp = dataCopy[++priorRow];

                var rc = dataCopy[centerRow += 2];
                var gc = dataCopy[++centerRow];
                var bc = dataCopy[++centerRow];

                var rn = dataCopy[nextRow += 2];
                var gn = dataCopy[++nextRow];
                var bn = dataCopy[++nextRow];

                var r2 = - rp - rc - rn;
                var g2 = - gp - gc - gn;
                var b2 = - bp - bc - bn;

                var x;
                var r;
                var g;
                var b;
                var p;

                // Main convolution loop
                for (x = 1; x < wm1; ++x) {

					centerRow = pixel + 4;
					priorRow = centerRow - w4;
					nextRow = centerRow + w4;
					
					r = 127 + r1 - rp - (rc * -8) - rn;
					g = 127 + g1 - gp - (gc * -8) - gn;
					b = 127 + b1 - bp - (bc * -8) - bn;
					
					r1 = r2;
					g1 = g2;
					b1 = b2;
					
					rp = dataCopy[  priorRow];
					gp = dataCopy[++priorRow];
					bp = dataCopy[++priorRow];
					
					rc = dataCopy[  centerRow];
					gc = dataCopy[++centerRow];
					bc = dataCopy[++centerRow];
					
					rn = dataCopy[  nextRow];
					gn = dataCopy[++nextRow];
					bn = dataCopy[++nextRow];
					
					r += (r2 = - rp - rc - rn);
					g += (g2 = - gp - gc - gn);
					b += (b2 = - bp - bc - bn);

					p = (r+g+b)/3;
					p = (r > tU) ? 255 : (p < tL) ? 255 : 0;

					data[pixel]   = p;
					data[++pixel] = p;
					data[++pixel] = p;

					pixel+=2;
				}
                pixel += 8;
            }
			return true;
		}
	},
	checkSupport() {
		return Pixastic.Client.hasCanvasImageData();
	}
}


/*
 * Pixastic Lib - Emboss filter - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.emboss = {
	process(params) {

		var strength = parseFloat(params.options.strength)||1;
		var greyLevel = typeof params.options.greyLevel != "undefined" ? parseInt(params.options.greyLevel) : 180;
		var direction = params.options.direction||"topleft";
		var blend = !!(params.options.blend && params.options.blend != "false");

		var dirY = 0;
		var dirX = 0;

		switch (direction) {
			case "topleft":			// top left
				dirY = -1;
				dirX = -1;
				break;
			case "top":			// top
				dirY = -1;
				dirX = 0;
				break;
			case "topright":			// top right
				dirY = -1;
				dirX = 1;
				break;
			case "right":			// right
				dirY = 0;
				dirX = 1;
				break;
			case "bottomright":			// bottom right
				dirY = 1;
				dirX = 1;
				break;
			case "bottom":			// bottom
				dirY = 1;
				dirX = 0;
				break;
			case "bottomleft":			// bottom left
				dirY = 1;
				dirX = -1;
				break;
			case "left":			// left
				dirY = 0;
				dirX = -1;
				break;
		}

		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);
			var dataCopy = Pixastic.prepareData(params, true)

			var invertAlpha = !!params.options.invertAlpha;
			var rect = params.options.rect;
			var w = rect.width;
			var h = rect.height;

			var w4 = w*4;
			var y = h;
			do {
				var offsetY = (y-1)*w4;

				var otherY = dirY;
				if (y + otherY < 1) otherY = 0;
				if (y + otherY > h) otherY = 0;

				var offsetYOther = (y-1+otherY)*w*4;

				var x = w;
				do {
						var offset = offsetY + (x-1)*4;

						var otherX = dirX;
						if (x + otherX < 1) otherX = 0;
						if (x + otherX > w) otherX = 0;

						var offsetOther = offsetYOther + (x-1+otherX)*4;

						var dR = dataCopy[offset] - dataCopy[offsetOther];
						var dG = dataCopy[offset+1] - dataCopy[offsetOther+1];
						var dB = dataCopy[offset+2] - dataCopy[offsetOther+2];

						var dif = dR;
						var absDif = dif > 0 ? dif : -dif;

						var absG = dG > 0 ? dG : -dG;
						var absB = dB > 0 ? dB : -dB;

						if (absG > absDif) {
							dif = dG;
						}
						if (absB > absDif) {
							dif = dB;
						}

						dif *= strength;

						if (blend) {
							var r = data[offset] + dif;
							var g = data[offset+1] + dif;
							var b = data[offset+2] + dif;

							data[offset] = (r > 255) ? 255 : (r < 0 ? 0 : r);
							data[offset+1] = (g > 255) ? 255 : (g < 0 ? 0 : g);
							data[offset+2] = (b > 255) ? 255 : (b < 0 ? 0 : b);
						} else {
							var grey = greyLevel - dif;
							if (grey < 0) {
								grey = 0;
							} else if (grey > 255) {
								grey = 255;
							}

							data[offset] = data[offset+1] = data[offset+2] = grey;
						}

				} while (--x);
			} while (--y);
			return true;

		} else if (Pixastic.Client.isIE()) {
			params.image.style.filter += " progid:DXImageTransform.Microsoft.emboss()";
			return true;
		}
	},
	checkSupport() {
		return (Pixastic.Client.hasCanvasImageData() || Pixastic.Client.isIE());
	}

}
/*
 * Pixastic Lib - Flip - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.flip = {
	process(params) {
		var rect = params.options.rect;
		var copyCanvas = document.createElement("canvas");
		copyCanvas.width = rect.width;
		copyCanvas.height = rect.height;
		copyCanvas.getContext("2d").drawImage(params.image, rect.left, rect.top, rect.width, rect.height, 0, 0, rect.width, rect.height);

		var ctx = params.canvas.getContext("2d");
		ctx.clearRect(rect.left, rect.top, rect.width, rect.height);

		if (params.options.axis == "horizontal") {
			ctx.scale(-1,1);
			ctx.drawImage(copyCanvas, -rect.left-rect.width, rect.top, rect.width, rect.height)
		} else {
			ctx.scale(1,-1);
			ctx.drawImage(copyCanvas, rect.left, -rect.top-rect.height, rect.width, rect.height)
		}

		params.useData = false;

		return true;		
	},
	checkSupport() {
		return Pixastic.Client.hasCanvas();
	}
}

/*
 * Pixastic Lib - Horizontal flip - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.fliph = {
	process(params) {
		if (Pixastic.Client.hasCanvas()) {
			var rect = params.options.rect;
			var copyCanvas = document.createElement("canvas");
			copyCanvas.width = rect.width;
			copyCanvas.height = rect.height;
			copyCanvas.getContext("2d").drawImage(params.image, rect.left, rect.top, rect.width, rect.height, 0, 0, rect.width, rect.height);

			var ctx = params.canvas.getContext("2d");
			ctx.clearRect(rect.left, rect.top, rect.width, rect.height);
			ctx.scale(-1,1);
			ctx.drawImage(copyCanvas, -rect.left-rect.width, rect.top, rect.width, rect.height)
			params.useData = false;

			return true;		

		} else if (Pixastic.Client.isIE()) {
			params.image.style.filter += " fliph";
			return true;
		}
	},
	checkSupport() {
		return (Pixastic.Client.hasCanvas() || Pixastic.Client.isIE());
	}
}

/*
 * Pixastic Lib - Vertical flip - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.flipv = {
	process(params) {
		if (Pixastic.Client.hasCanvas()) {
			var rect = params.options.rect;
			var copyCanvas = document.createElement("canvas");
			copyCanvas.width = rect.width;
			copyCanvas.height = rect.height;
			copyCanvas.getContext("2d").drawImage(params.image, rect.left, rect.top, rect.width, rect.height, 0, 0, rect.width, rect.height);

			var ctx = params.canvas.getContext("2d");
			ctx.clearRect(rect.left, rect.top, rect.width, rect.height);
			ctx.scale(1,-1);
			ctx.drawImage(copyCanvas, rect.left, -rect.top-rect.height, rect.width, rect.height)
			params.useData = false;

			return true;		

		} else if (Pixastic.Client.isIE()) {
			params.image.style.filter += " flipv";
			return true;
		}
	},
	checkSupport() {
		return (Pixastic.Client.hasCanvas() || Pixastic.Client.isIE());
	}
}

/*
 * Pixastic Lib - Glow - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */


Pixastic.Actions.glow = {
	process(params) {

		var amount = (parseFloat(params.options.amount)||0);
		var blurAmount = parseFloat(params.options.radius)||0;

		amount = Math.min(1,Math.max(0,amount));
		blurAmount = Math.min(5,Math.max(0,blurAmount));

		if (Pixastic.Client.hasCanvasImageData()) {
            var rect = params.options.rect;

            var blurCanvas = document.createElement("canvas");
            blurCanvas.width = params.width;
            blurCanvas.height = params.height;
            var blurCtx = blurCanvas.getContext("2d");
            blurCtx.drawImage(params.canvas,0,0);

            var scale = 2;
            var smallWidth = Math.round(params.width / scale);
            var smallHeight = Math.round(params.height / scale);

            var copy = document.createElement("canvas");
            copy.width = smallWidth;
            copy.height = smallHeight;

            var clear = true;
            var steps = Math.round(blurAmount * 20);

            var copyCtx = copy.getContext("2d");
            for (var i=0;i<steps;i++) {
				var scaledWidth = Math.max(1,Math.round(smallWidth - i));
				var scaledHeight = Math.max(1,Math.round(smallHeight - i));
	
				copyCtx.clearRect(0,0,smallWidth,smallHeight);
	
				copyCtx.drawImage(
					blurCanvas,
					0,0,params.width,params.height,
					0,0,scaledWidth,scaledHeight
				);
	
				blurCtx.clearRect(0,0,params.width,params.height);
	
				blurCtx.drawImage(
					copy,
					0,0,scaledWidth,scaledHeight,
					0,0,params.width,params.height
				);
			}

            var data = Pixastic.prepareData(params);
            var blurData = Pixastic.prepareData({canvas:blurCanvas,options:params.options});

            var p = rect.width * rect.height;

            var pix = p*4;
            var pix1 = pix + 1;
            var pix2 = pix + 2;
            var pix3 = pix + 3;
            while (p--) {
				if ((data[pix-=4] += amount * blurData[pix]) > 255) data[pix] = 255;
				if ((data[pix1-=4] += amount * blurData[pix1]) > 255) data[pix1] = 255;
				if ((data[pix2-=4] += amount * blurData[pix2]) > 255) data[pix2] = 255;
			}

            return true;
        }
	},
	checkSupport() {
		return Pixastic.Client.hasCanvasImageData();
	}
}



/*
 * Pixastic Lib - Histogram - v0.1.1
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.histogram = {
	process(params) {

		var average = !!(params.options.average && params.options.average != "false");
		var paint = !!(params.options.paint && params.options.paint != "false");
		var color = params.options.color || "rgba(255,255,255,0.5)";
		var values = [];
		if (typeof params.options.returnValue != "object") {
			params.options.returnValue = {values:[]};
		}
		var returnValue = params.options.returnValue;
		if (typeof returnValue.values != "array") {
			returnValue.values = [];
		}
		values = returnValue.values;

		if (Pixastic.Client.hasCanvasImageData()) {
            var data = Pixastic.prepareData(params);
            params.useData = false;

            for (var i=0;i<256;i++) {
				values[i] = 0;
			}

            var rect = params.options.rect;
            var p = rect.width * rect.height;

            var pix = p*4;
            var pix1 = pix + 1;
            var pix2 = pix + 2;
            var pix3 = pix + 3;
            var round = Math.round;

            if (average) {
				while (p--) {
					values[ round((data[pix-=4]+data[pix+1]+data[pix+2])/3) ]++;
				}
			} else {
				while (p--) {
					values[ round(data[pix-=4]*0.3 + data[pix+1]*0.59 + data[pix+2]*0.11) ]++;
				}
			}

            if (paint) {
				var maxValue = 0;
				for (var i=0;i<256;i++) {
					if (values[i] > maxValue) {
						maxValue = values[i];
					}
				}
				var heightScale = params.height / maxValue;
				var widthScale = params.width / 256;
				var ctx = params.canvas.getContext("2d");
				ctx.fillStyle = color;
				for (var i=0;i<256;i++) {
					ctx.fillRect(
						i * widthScale, params.height - heightScale * values[i],
						widthScale, values[i] * heightScale
					);
				}
			}

            returnValue.values = values;

            return true;
        }
	},
	checkSupport() {
		return Pixastic.Client.hasCanvasImageData();
	}
}
/*
 * Pixastic Lib - HSL Adjust  - v0.1.1
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.hsl = {
	process(params) {

		var hue = parseInt(params.options.hue,10)||0;
		var saturation = (parseInt(params.options.saturation,10)||0) / 100;
		var lightness = (parseInt(params.options.lightness,10)||0) / 100;


		// this seems to give the same result as Photoshop
		if (saturation < 0) {
			var satMul = 1+saturation;
		} else {
			var satMul = 1+saturation*2;
		}

		hue = (hue%360) / 360;
		var hue6 = hue * 6;

		var rgbDiv = 1 / 255;

		var light255 = lightness * 255;
		var lightp1 = 1 + lightness;
		var lightm1 = 1 - lightness;
		if (Pixastic.Client.hasCanvasImageData()) {
            var data = Pixastic.prepareData(params);

            var rect = params.options.rect;

            var p = rect.width * rect.height;

            var pix = p*4;
            var pix1 = pix + 1;
            var pix2 = pix + 2;
            var pix3 = pix + 3;

            while (p--) {

				var r = data[pix-=4];
				var g = data[pix1=pix+1];
				var b = data[pix2=pix+2];

				if (hue != 0 || saturation != 0) {
					// ok, here comes rgb to hsl + adjust + hsl to rgb, all in one jumbled mess. 
					// It's not so pretty, but it's been optimized to get somewhat decent performance.
					// The transforms were originally adapted from the ones found in Graphics Gems, but have been heavily modified.
					var vs = r;
					if (g > vs) vs = g;
					if (b > vs) vs = b;
					var ms = r;
					if (g < ms) ms = g;
					if (b < ms) ms = b;
					var vm = (vs-ms);
					var l = (ms+vs)/510;
					if (l > 0) {
						if (vm > 0) {
							if (l <= 0.5) {
								var s = vm / (vs+ms) * satMul;
								if (s > 1) s = 1;
								var v = (l * (1+s));
							} else {
								var s = vm / (510-vs-ms) * satMul;
								if (s > 1) s = 1;
								var v = (l+s - l*s);
							}
							if (r == vs) {
								if (g == ms)
									var h = 5 + ((vs-b)/vm) + hue6;
								else
									var h = 1 - ((vs-g)/vm) + hue6;
							} else if (g == vs) {
								if (b == ms)
									var h = 1 + ((vs-r)/vm) + hue6;
								else
									var h = 3 - ((vs-b)/vm) + hue6;
							} else {
								if (r == ms)
									var h = 3 + ((vs-g)/vm) + hue6;
								else
									var h = 5 - ((vs-r)/vm) + hue6;
							}
							if (h < 0) h+=6;
							if (h >= 6) h-=6;
							var m = (l+l-v);
							var sextant = h>>0;
							if (sextant == 0) {
								r = v*255; g = (m+((v-m)*(h-sextant)))*255; b = m*255;
							} else if (sextant == 1) {
								r = (v-((v-m)*(h-sextant)))*255; g = v*255; b = m*255;
							} else if (sextant == 2) {
								r = m*255; g = v*255; b = (m+((v-m)*(h-sextant)))*255;
							} else if (sextant == 3) {
								r = m*255; g = (v-((v-m)*(h-sextant)))*255; b = v*255;
							} else if (sextant == 4) {
								r = (m+((v-m)*(h-sextant)))*255; g = m*255; b = v*255;
							} else if (sextant == 5) {
								r = v*255; g = m*255; b = (v-((v-m)*(h-sextant)))*255;
							}
						}
					}
				}

				if (lightness < 0) {
					r *= lightp1;
					g *= lightp1;
					b *= lightp1;
				} else if (lightness > 0) {
					r = r * lightm1 + light255;
					g = g * lightm1 + light255;
					b = b * lightm1 + light255;
				}

				if (r < 0) 
					data[pix] = 0
				else if (r > 255)
					data[pix] = 255
				else
					data[pix] = r;

				if (g < 0) 
					data[pix1] = 0
				else if (g > 255)
					data[pix1] = 255
				else
					data[pix1] = g;

				if (b < 0) 
					data[pix2] = 0
				else if (b > 255)
					data[pix2] = 255
				else
					data[pix2] = b;

			}

            return true;
        }
	},
	checkSupport() {
		return Pixastic.Client.hasCanvasImageData();
	}

}
/*
 * Pixastic Lib - Invert filter - v0.1.1
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.invert = {
	process(params) {
		if (Pixastic.Client.hasCanvasImageData()) {
            var data = Pixastic.prepareData(params);

            var invertAlpha = !!params.options.invertAlpha;
            var rect = params.options.rect;

            var p = rect.width * rect.height;

            var pix = p*4;
            var pix1 = pix + 1;
            var pix2 = pix + 2;
            var pix3 = pix + 3;

            while (p--) {
				data[pix-=4] = 255 - data[pix];
				data[pix1-=4] = 255 - data[pix1];
				data[pix2-=4] = 255 - data[pix2];
				if (invertAlpha)
					data[pix3-=4] = 255 - data[pix3];
			}

            return true;
        } else if (Pixastic.Client.isIE()) {
			params.image.style.filter += " invert";
			return true;
		}
	},
	checkSupport() {
		return (Pixastic.Client.hasCanvasImageData() || Pixastic.Client.isIE());
	}
}
/*
 * Pixastic Lib - Laplace filter - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.laplace = {
	process(params) {

		var strength = 1.0;
		var invert = !!(params.options.invert && params.options.invert != "false");
		var contrast = parseFloat(params.options.edgeStrength)||0;

		var greyLevel = parseInt(params.options.greyLevel)||0;

		contrast = -contrast;

		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);
			var dataCopy = Pixastic.prepareData(params, true)

			var kernel = [
				[-1, 	-1, 	-1],
				[-1, 	8, 	-1],
				[-1, 	-1, 	-1]
			];

			var weight = 1/8;

			var rect = params.options.rect;
			var w = rect.width;
			var h = rect.height;

			var w4 = w*4;
			var y = h;
			do {
				var offsetY = (y-1)*w4;

				var nextY = (y == h) ? y - 1 : y;
				var prevY = (y == 1) ? 0 : y-2;

				var offsetYPrev = prevY*w*4;
				var offsetYNext = nextY*w*4;

				var x = w;
				do {
					var offset = offsetY + (x*4-4);

					var offsetPrev = offsetYPrev + ((x == 1) ? 0 : x-2) * 4;
					var offsetNext = offsetYNext + ((x == w) ? x-1 : x) * 4;
	
					var r = ((-dataCopy[offsetPrev-4]
						- dataCopy[offsetPrev]
						- dataCopy[offsetPrev+4]
						- dataCopy[offset-4]
						- dataCopy[offset+4]
						- dataCopy[offsetNext-4]
						- dataCopy[offsetNext]
						- dataCopy[offsetNext+4])
						+ dataCopy[offset] * 8) 
						* weight;
	
					var g = ((-dataCopy[offsetPrev-3]
						- dataCopy[offsetPrev+1]
						- dataCopy[offsetPrev+5]
						- dataCopy[offset-3]
						- dataCopy[offset+5]
						- dataCopy[offsetNext-3]
						- dataCopy[offsetNext+1]
						- dataCopy[offsetNext+5])
						+ dataCopy[offset+1] * 8)
						* weight;
	
					var b = ((-dataCopy[offsetPrev-2]
						- dataCopy[offsetPrev+2]
						- dataCopy[offsetPrev+6]
						- dataCopy[offset-2]
						- dataCopy[offset+6]
						- dataCopy[offsetNext-2]
						- dataCopy[offsetNext+2]
						- dataCopy[offsetNext+6])
						+ dataCopy[offset+2] * 8)
						* weight;

					var brightness = ((r + g + b)/3) + greyLevel;

					if (contrast != 0) {
						if (brightness > 127) {
							brightness += ((brightness + 1) - 128) * contrast;
						} else if (brightness < 127) {
							brightness -= (brightness + 1) * contrast;
						}
					}
					if (invert) {
						brightness = 255 - brightness;
					}
					if (brightness < 0 ) brightness = 0;
					if (brightness > 255 ) brightness = 255;

					data[offset] = data[offset+1] = data[offset+2] = brightness;

				} while (--x);
			} while (--y);

			return true;
		}
	},
	checkSupport() {
		return Pixastic.Client.hasCanvasImageData();
	}
}

/*
 * Pixastic Lib - Lighten filter - v0.1.1
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.lighten = {

	process(params) {
		var amount = parseFloat(params.options.amount) || 0;
		amount = Math.max(-1, Math.min(1, amount));

		if (Pixastic.Client.hasCanvasImageData()) {
            var data = Pixastic.prepareData(params);
            var rect = params.options.rect;

            var p = rect.width * rect.height;

            var pix = p*4;
            var pix1 = pix + 1;
            var pix2 = pix + 2;
            var mul = amount + 1;

            while (p--) {
				if ((data[pix-=4] = data[pix] * mul) > 255)
					data[pix] = 255;

				if ((data[pix1-=4] = data[pix1] * mul) > 255)
					data[pix1] = 255;

				if ((data[pix2-=4] = data[pix2] * mul) > 255)
					data[pix2] = 255;

			}

            return true;
        } else if (Pixastic.Client.isIE()) {
			var img = params.image;
			if (amount < 0) {
				img.style.filter += " light()";
				img.filters[img.filters.length-1].addAmbient(
					255,255,255,
					100 * -amount
				);
			} else if (amount > 0) {
				img.style.filter += " light()";
				img.filters[img.filters.length-1].addAmbient(
					255,255,255,
					100
				);
				img.filters[img.filters.length-1].addAmbient(
					255,255,255,
					100 * amount
				);
			}
			return true;
		}
	},
	checkSupport() {
		return (Pixastic.Client.hasCanvasImageData() || Pixastic.Client.isIE());
	}
}
/*
 * Pixastic Lib - Mosaic filter - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.mosaic = {

	process(params) {
		var blockSize = Math.max(1,parseInt(params.options.blockSize,10));

		if (Pixastic.Client.hasCanvasImageData()) {
			var rect = params.options.rect;
			var w = rect.width;
			var h = rect.height;
			var w4 = w*4;
			var y = h;

			var ctx = params.canvas.getContext("2d");

			var pixel = document.createElement("canvas");
			pixel.width = pixel.height = 1;
			var pixelCtx = pixel.getContext("2d");

			var copy = document.createElement("canvas");
			copy.width = w;
			copy.height = h;
			var copyCtx = copy.getContext("2d");
			copyCtx.drawImage(params.canvas,rect.left,rect.top,w,h, 0,0,w,h);

			for (var y=0;y<h;y+=blockSize) {
				for (var x=0;x<w;x+=blockSize) {
					var blockSizeX = blockSize;
					var blockSizeY = blockSize;
		
					if (blockSizeX + x > w)
						blockSizeX = w - x;
					if (blockSizeY + y > h)
						blockSizeY = h - y;

					pixelCtx.drawImage(copy, x, y, blockSizeX, blockSizeY, 0, 0, 1, 1);
					var data = pixelCtx.getImageData(0,0,1,1).data;
					ctx.fillStyle = "rgb(" + data[0] + "," + data[1] + "," + data[2] + ")";
					ctx.fillRect(rect.left + x, rect.top + y, blockSize, blockSize);
				}
			}
			params.useData = false;

			return true;
		}
	},
	checkSupport() {
		return (Pixastic.Client.hasCanvasImageData());
	}
}/*
 * Pixastic Lib - Noise filter - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.noise = {

	process(params) {
		var amount = 0;
		var strength = 0;
		var mono = false;

		if (typeof params.options.amount != "undefined")
			amount = parseFloat(params.options.amount)||0;
		if (typeof params.options.strength != "undefined")
			strength = parseFloat(params.options.strength)||0;
		if (typeof params.options.mono != "undefined")
			mono = !!(params.options.mono && params.options.mono != "false");

		amount = Math.max(0,Math.min(1,amount));
		strength = Math.max(0,Math.min(1,strength));

		var noise = 128 * strength;
		var noise2 = noise / 2;

		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);
			var rect = params.options.rect;
			var w = rect.width;
			var h = rect.height;
			var w4 = w*4;
			var y = h;
			var random = Math.random;

			do {
				var offsetY = (y-1)*w4;
				var x = w;
				do {
					var offset = offsetY + (x-1)*4;
					if (random() < amount) {
						if (mono) {
							var pixelNoise = - noise2 + random() * noise;
							var r = data[offset] + pixelNoise;
							var g = data[offset+1] + pixelNoise;
							var b = data[offset+2] + pixelNoise;
						} else {
							var r = data[offset] - noise2 + (random() * noise);
							var g = data[offset+1] - noise2 + (random() * noise);
							var b = data[offset+2] - noise2 + (random() * noise);
						}

						if (r < 0 ) r = 0;
						if (g < 0 ) g = 0;
						if (b < 0 ) b = 0;
						if (r > 255 ) r = 255;
						if (g > 255 ) g = 255;
						if (b > 255 ) b = 255;

						data[offset] = r;
						data[offset+1] = g;
						data[offset+2] = b;
					}
				} while (--x);
			} while (--y);
			return true;
		}
	},
	checkSupport() {
		return Pixastic.Client.hasCanvasImageData();
	}
}

/*
 * Pixastic Lib - Posterize effect - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.posterize = {

	process(params) {

		
		var numLevels = 256;
		if (typeof params.options.levels != "undefined")
			numLevels = parseInt(params.options.levels,10)||1;

		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);

			numLevels = Math.max(2,Math.min(256,numLevels));
	
			var numAreas = 256 / numLevels;
			var numValues = 256 / (numLevels-1);

			var rect = params.options.rect;
			var w = rect.width;
			var h = rect.height;
			var w4 = w*4;
			var y = h;
			do {
				var offsetY = (y-1)*w4;
				var x = w;
				do {
					var offset = offsetY + (x-1)*4;

					var r = numValues * ((data[offset] / numAreas)>>0);
					var g = numValues * ((data[offset+1] / numAreas)>>0);
					var b = numValues * ((data[offset+2] / numAreas)>>0);

					if (r > 255) r = 255;
					if (g > 255) g = 255;
					if (b > 255) b = 255;

					data[offset] = r;
					data[offset+1] = g;
					data[offset+2] = b;

				} while (--x);
			} while (--y);
			return true;
		}
	},
	checkSupport() {
		return Pixastic.Client.hasCanvasImageData();
	}
}


/*
 * Pixastic Lib - Pointillize filter - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.pointillize = {

	process(params) {
		var radius = Math.max(1,parseInt(params.options.radius,10));
		var density = Math.min(5,Math.max(0,parseFloat(params.options.density)||0));
		var noise = Math.max(0,parseFloat(params.options.noise)||0);
		var transparent = !!(params.options.transparent && params.options.transparent != "false");

		if (Pixastic.Client.hasCanvasImageData()) {
			var rect = params.options.rect;
			var w = rect.width;
			var h = rect.height;
			var w4 = w*4;
			var y = h;

			var ctx = params.canvas.getContext("2d");
			var canvasWidth = params.canvas.width;
			var canvasHeight = params.canvas.height;

			var pixel = document.createElement("canvas");
			pixel.width = pixel.height = 1;
			var pixelCtx = pixel.getContext("2d");

			var copy = document.createElement("canvas");
			copy.width = w;
			copy.height = h;
			var copyCtx = copy.getContext("2d");
			copyCtx.drawImage(params.canvas,rect.left,rect.top,w,h, 0,0,w,h);

			var diameter = radius * 2;

			if (transparent)
				ctx.clearRect(rect.left, rect.top, rect.width, rect.height);

			var noiseRadius = radius * noise;

			var dist = 1 / density;

			for (var y=0;y<h+radius;y+=diameter*dist) {
				for (var x=0;x<w+radius;x+=diameter*dist) {
					rndX = noise ? (x+((Math.random()*2-1) * noiseRadius))>>0 : x;
					rndY = noise ? (y+((Math.random()*2-1) * noiseRadius))>>0 : y;

					var pixX = rndX - radius;
					var pixY = rndY - radius;
					if (pixX < 0) pixX = 0;
					if (pixY < 0) pixY = 0;

					var cx = rndX + rect.left;
					var cy = rndY + rect.top;
					if (cx < 0) cx = 0;
					if (cx > canvasWidth) cx = canvasWidth;
					if (cy < 0) cy = 0;
					if (cy > canvasHeight) cy = canvasHeight;

					var diameterX = diameter;
					var diameterY = diameter;

					if (diameterX + pixX > w)
						diameterX = w - pixX;
					if (diameterY + pixY > h)
						diameterY = h - pixY;
					if (diameterX < 1) diameterX = 1;
					if (diameterY < 1) diameterY = 1;

					pixelCtx.drawImage(copy, pixX, pixY, diameterX, diameterY, 0, 0, 1, 1);
					var data = pixelCtx.getImageData(0,0,1,1).data;

					ctx.fillStyle = "rgb(" + data[0] + "," + data[1] + "," + data[2] + ")";
					ctx.beginPath();
					ctx.arc(cx, cy, radius, 0, Math.PI*2, true);
					ctx.closePath();
					ctx.fill();
				}
			}

			params.useData = false;

			return true;
		}
	},
	checkSupport() {
		return (Pixastic.Client.hasCanvasImageData());
	}
}/*
 * Pixastic Lib - Remove noise - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.removenoise = {
	process(params) {

		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);

			var rect = params.options.rect;
			var w = rect.width;
			var h = rect.height;

			var w4 = w*4;
			var y = h;
			do {
				var offsetY = (y-1)*w4;

				var nextY = (y == h) ? y - 1 : y;
				var prevY = (y == 1) ? 0 : y-2;

				var offsetYPrev = prevY*w*4;
				var offsetYNext = nextY*w*4;

				var x = w;
				do {
                    var offset = offsetY + (x*4-4);

                    var offsetPrev = offsetYPrev + ((x == 1) ? 0 : x-2) * 4;
                    var offsetNext = offsetYNext + ((x == w) ? x-1 : x) * 4;

                    var minR;
                    var maxR;
                    var minG;
                    var maxG;
                    var minB;
                    var maxB;

                    minR = maxR = data[offsetPrev];
                    var r1 = data[offset-4];
                    var r2 = data[offset+4];
                    var r3 = data[offsetNext];
                    if (r1 < minR) minR = r1;
                    if (r2 < minR) minR = r2;
                    if (r3 < minR) minR = r3;
                    if (r1 > maxR) maxR = r1;
                    if (r2 > maxR) maxR = r2;
                    if (r3 > maxR) maxR = r3;

                    minG = maxG = data[offsetPrev+1];
                    var g1 = data[offset-3];
                    var g2 = data[offset+5];
                    var g3 = data[offsetNext+1];
                    if (g1 < minG) minG = g1;
                    if (g2 < minG) minG = g2;
                    if (g3 < minG) minG = g3;
                    if (g1 > maxG) maxG = g1;
                    if (g2 > maxG) maxG = g2;
                    if (g3 > maxG) maxG = g3;

                    minB = maxB = data[offsetPrev+2];
                    var b1 = data[offset-2];
                    var b2 = data[offset+6];
                    var b3 = data[offsetNext+2];
                    if (b1 < minB) minB = b1;
                    if (b2 < minB) minB = b2;
                    if (b3 < minB) minB = b3;
                    if (b1 > maxB) maxB = b1;
                    if (b2 > maxB) maxB = b2;
                    if (b3 > maxB) maxB = b3;

                    if (data[offset] > maxR) {
						data[offset] = maxR;
					} else if (data[offset] < minR) {
						data[offset] = minR;
					}
                    if (data[offset+1] > maxG) {
						data[offset+1] = maxG;
					} else if (data[offset+1] < minG) {
						data[offset+1] = minG;
					}
                    if (data[offset+2] > maxB) {
						data[offset+2] = maxB;
					} else if (data[offset+2] < minB) {
						data[offset+2] = minB;
					}
                } while (--x);
			} while (--y);

			return true;
		}
	},
	checkSupport() {
		return Pixastic.Client.hasCanvasImageData();
	}
}/*
 * Pixastic Lib - Resize - v0.1.0
 * Copyright (c) 2009 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.resize = {
	process(params) {
		if (Pixastic.Client.hasCanvas()) {
			var width = parseInt(params.options.width,10);
			var height = parseInt(params.options.height,10);
			var canvas = params.canvas;

			if (width < 1) width = 1;
			if (width < 2) width = 2;

			var copy = document.createElement("canvas");
			copy.width = width;
			copy.height = height;

			copy.getContext("2d").drawImage(canvas,0,0,width,height);
			canvas.width = width;
			canvas.height = height;

			canvas.getContext("2d").drawImage(copy,0,0);

			params.useData = false;
			return true;
		}
	},
	checkSupport() {
		return Pixastic.Client.hasCanvas();
	}
}


/*
 * Pixastic Lib - Rotate - v0.1.0
 * Copyright (c) 2009 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.rotate = {
	process(params) {
		if (Pixastic.Client.hasCanvas()) {
			var canvas = params.canvas;

			var width = params.width;
			var height = params.height;

			var copy = document.createElement("canvas");
			copy.width = width;
			copy.height = height;
			copy.getContext("2d").drawImage(canvas,0,0,width,height);

			var angle = -parseFloat(params.options.angle) * Math.PI / 180;

			var dimAngle = angle;
			if (dimAngle > Math.PI*0.5)
				dimAngle = Math.PI - dimAngle;
			if (dimAngle < -Math.PI*0.5)
				dimAngle = -Math.PI - dimAngle;

			var diag = Math.sqrt(width*width + height*height);

			var diagAngle1 = Math.abs(dimAngle) - Math.abs(Math.atan2(height, width));
			var diagAngle2 = Math.abs(dimAngle) + Math.abs(Math.atan2(height, width));

			var newWidth = Math.abs(Math.cos(diagAngle1) * diag);
			var newHeight = Math.abs(Math.sin(diagAngle2) * diag);

			canvas.width = newWidth;
			canvas.height = newHeight;

			var ctx = canvas.getContext("2d");
			ctx.translate(newWidth/2, newHeight/2);
			ctx.rotate(angle);
			ctx.drawImage(copy,-width/2,-height/2);

			params.useData = false;
			return true;
		}
	},
	checkSupport() {
		return Pixastic.Client.hasCanvas();
	}
}


/*
 * Pixastic Lib - Sepia filter - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.sepia = {

	process(params) {
		var mode = (parseInt(params.options.mode,10)||0);
		if (mode < 0) mode = 0;
		if (mode > 1) mode = 1;

		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);
			var rect = params.options.rect;
			var w = rect.width;
			var h = rect.height;
			var w4 = w*4;
			var y = h;
			do {
				var offsetY = (y-1)*w4;
				var x = w;
				do {
					var offset = offsetY + (x-1)*4;

					if (mode) {
						// a bit faster, but not as good
						var d = data[offset] * 0.299 + data[offset+1] * 0.587 + data[offset+2] * 0.114;
						var r = (d + 39);
						var g = (d + 14);
						var b = (d - 36);
					} else {
						// Microsoft
						var or = data[offset];
						var og = data[offset+1];
						var ob = data[offset+2];
	
						var r = (or * 0.393 + og * 0.769 + ob * 0.189);
						var g = (or * 0.349 + og * 0.686 + ob * 0.168);
						var b = (or * 0.272 + og * 0.534 + ob * 0.131);
					}

					if (r < 0) r = 0; if (r > 255) r = 255;
					if (g < 0) g = 0; if (g > 255) g = 255;
					if (b < 0) b = 0; if (b > 255) b = 255;

					data[offset] = r;
					data[offset+1] = g;
					data[offset+2] = b;

				} while (--x);
			} while (--y);
			return true;
		}
	},
	checkSupport() {
		return Pixastic.Client.hasCanvasImageData();
	}
}/*
 * Pixastic Lib - Sharpen filter - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.sharpen = {
	process(params) {

		var strength = 0;
		if (typeof params.options.amount != "undefined")
			strength = parseFloat(params.options.amount)||0;

		if (strength < 0) strength = 0;
		if (strength > 1) strength = 1;

		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);
			var dataCopy = Pixastic.prepareData(params, true)

			var mul = 15;
			var mulOther = 1 + 3*strength;

			var kernel = [
				[0, 	-mulOther, 	0],
				[-mulOther, 	mul, 	-mulOther],
				[0, 	-mulOther, 	0]
			];

			var weight = 0;
			for (var i=0;i<3;i++) {
				for (var j=0;j<3;j++) {
					weight += kernel[i][j];
				}
			}

			weight = 1 / weight;

			var rect = params.options.rect;
			var w = rect.width;
			var h = rect.height;

			mul *= weight;
			mulOther *= weight;

			var w4 = w*4;
			var y = h;
			do {
				var offsetY = (y-1)*w4;

				var nextY = (y == h) ? y - 1 : y;
				var prevY = (y == 1) ? 0 : y-2;

				var offsetYPrev = prevY*w4;
				var offsetYNext = nextY*w4;

				var x = w;
				do {
					var offset = offsetY + (x*4-4);

					var offsetPrev = offsetYPrev + ((x == 1) ? 0 : x-2) * 4;
					var offsetNext = offsetYNext + ((x == w) ? x-1 : x) * 4;

					var r = ((
						- dataCopy[offsetPrev]
						- dataCopy[offset-4]
						- dataCopy[offset+4]
						- dataCopy[offsetNext])		* mulOther
						+ dataCopy[offset] 	* mul
						);

					var g = ((
						- dataCopy[offsetPrev+1]
						- dataCopy[offset-3]
						- dataCopy[offset+5]
						- dataCopy[offsetNext+1])	* mulOther
						+ dataCopy[offset+1] 	* mul
						);

					var b = ((
						- dataCopy[offsetPrev+2]
						- dataCopy[offset-2]
						- dataCopy[offset+6]
						- dataCopy[offsetNext+2])	* mulOther
						+ dataCopy[offset+2] 	* mul
						);


					if (r < 0 ) r = 0;
					if (g < 0 ) g = 0;
					if (b < 0 ) b = 0;
					if (r > 255 ) r = 255;
					if (g > 255 ) g = 255;
					if (b > 255 ) b = 255;

					data[offset] = r;
					data[offset+1] = g;
					data[offset+2] = b;

				} while (--x);
			} while (--y);

			return true;

		}
	},
	checkSupport() {
		return Pixastic.Client.hasCanvasImageData();
	}
}
/*
 * Pixastic Lib - Solarize filter - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */

Pixastic.Actions.solarize = {

	process(params) {
		var useAverage = !!(params.options.average && params.options.average != "false");

		if (Pixastic.Client.hasCanvasImageData()) {
			var data = Pixastic.prepareData(params);
			var rect = params.options.rect;
			var w = rect.width;
			var h = rect.height;
			var w4 = w*4;
			var y = h;
			do {
				var offsetY = (y-1)*w4;
				var x = w;
				do {
					var offset = offsetY + (x-1)*4;

					var r = data[offset];
					var g = data[offset+1];
					var b = data[offset+2];

					if (r > 127) r = 255 - r;
					if (g > 127) g = 255 - g;
					if (b > 127) b = 255 - b;

					data[offset] = r;
					data[offset+1] = g;
					data[offset+2] = b;

				} while (--x);
			} while (--y);
			return true;
		}
	},
	checkSupport() {
		return (Pixastic.Client.hasCanvasImageData());
	}
}/*
 * Pixastic Lib - USM - v0.1.0
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * License: [http://www.pixastic.com/lib/license.txt]
 */


Pixastic.Actions.unsharpmask = {
	process(params) {

		var amount = (parseFloat(params.options.amount)||0);
		var blurAmount = parseFloat(params.options.radius)||0;
		var threshold = parseFloat(params.options.threshold)||0;

		amount = Math.min(500,Math.max(0,amount)) / 2;
		blurAmount = Math.min(5,Math.max(0,blurAmount)) / 10;
		threshold = Math.min(255,Math.max(0,threshold));

		threshold--;
		var thresholdNeg = -threshold;

		amount *= 0.016;
		amount++;

		if (Pixastic.Client.hasCanvasImageData()) {
			var rect = params.options.rect;

			var blurCanvas = document.createElement("canvas");
			blurCanvas.width = params.width;
			blurCanvas.height = params.height;
			var blurCtx = blurCanvas.getContext("2d");
			blurCtx.drawImage(params.canvas,0,0);

			var scale = 2;
			var smallWidth = Math.round(params.width / scale);
			var smallHeight = Math.round(params.height / scale);

			var copy = document.createElement("canvas");
			copy.width = smallWidth;
			copy.height = smallHeight;

			var steps = Math.round(blurAmount * 20);

			var copyCtx = copy.getContext("2d");
			for (var i=0;i<steps;i++) {
				var scaledWidth = Math.max(1,Math.round(smallWidth - i));
				var scaledHeight = Math.max(1,Math.round(smallHeight - i));

				copyCtx.clearRect(0,0,smallWidth,smallHeight);

				copyCtx.drawImage(
					blurCanvas,
					0,0,params.width,params.height,
					0,0,scaledWidth,scaledHeight
				);
	
				blurCtx.clearRect(0,0,params.width,params.height);
	
				blurCtx.drawImage(
					copy,
					0,0,scaledWidth,scaledHeight,
					0,0,params.width,params.height
				);
			}

			var data = Pixastic.prepareData(params);
			var blurData = Pixastic.prepareData({canvas:blurCanvas,options:params.options});
			var w = rect.width;
			var h = rect.height;
			var w4 = w*4;
			var y = h;
			do {
				var offsetY = (y-1)*w4;
				var x = w;
				do {
					var offset = offsetY + (x*4-4);

					var difR = data[offset] - blurData[offset];
					if (difR > threshold || difR < thresholdNeg) {
						var blurR = blurData[offset];
						blurR = amount * difR + blurR;
						data[offset] = blurR > 255 ? 255 : (blurR < 0 ? 0 : blurR);
					}

					var difG = data[offset+1] - blurData[offset+1];
					if (difG > threshold || difG < thresholdNeg) {
						var blurG = blurData[offset+1];
						blurG = amount * difG + blurG;
						data[offset+1] = blurG > 255 ? 255 : (blurG < 0 ? 0 : blurG);
					}

					var difB = data[offset+2] - blurData[offset+2];
					if (difB > threshold || difB < thresholdNeg) {
						var blurB = blurData[offset+2];
						blurB = amount * difB + blurB;
						data[offset+2] = blurB > 255 ? 255 : (blurB < 0 ? 0 : blurB);
					}

				} while (--x);
			} while (--y);

			return true;
		}
	},
	checkSupport() {
		return Pixastic.Client.hasCanvasImageData();
	}
}



