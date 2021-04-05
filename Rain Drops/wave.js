const cnv = document.querySelector('.canvas');
const ctx = cnv.getContext('2d');
let w = cnv.width;
let h = cnv.height;


let waves = ['#12c8bc6e',
             '#c7faff5e',
             '#c7fffc57',
             '#12c8bc6e']

let i = 0;

function draw() {
cnv.width = cnv.width;

for(let j = waves.length - 1; j >= 0; j--) {
let offset = i + j * Math.PI * 12;
ctx.fillStyle = (waves[j]);
let randomLeft            = (Math.sin(offset/100)  + 1) / 2 * 200;
let randomRight           = (Math.sin((offset/100) + 10) + 1) / 2 * 200;
let randomLeftConstraint  = (Math.sin((offset/60)  + 2)  + 1) / 2 * 200;
let randomRightConstraint = (Math.sin((offset/60)  + 1)  + 1) / 2 * 200;

ctx.beginPath();
ctx.moveTo(0, randomLeft + 100);

ctx.bezierCurveTo(w / 3, randomLeftConstraint, w / 3 * 2, randomRightConstraint, w, randomRight + 100);
ctx.lineTo(w , h);
ctx.lineTo(0, h);
ctx.lineTo(0, randomLeft + 100);

ctx.closePath();
ctx.fill();
}

i = i + 3;
}
setInterval("draw()", 50);