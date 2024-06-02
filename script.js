canvas = document.getElementById("life")

canvas.width = window.innerWidth - 20;
canvas.height = window.innerHeight - 25;
m = canvas.getContext("2d")

canvasWidth = canvas.offsetWidth
canvasHeight = canvas.offsetHeight

addEventListener("resize", (event) => { });
onresize = (event) => {
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 25;

    canvasWidth = canvas.offsetWidth
    canvasHeight = canvas.offsetHeight

    console.log(canvasWidth)
};

draw = (x, y, c, s) => {
    m.fillStyle = c
    m.fillRect(x, y, s, s)
}

particles = [];

particle = (x, y, c) => {
    return { "x": x, "y": y, "vx": 0, "vy": 0, "color": c }
}

random = (size) => {
    return Math.random() * size + 50
}

create = (number, color) => {
    group = []
    for (let i = 0; i < number; i++) {
        group.push(particle(random(canvasWidth), random(canvasHeight), color))
        particles.push(group[i])
    }
    return group;
}

rule = (particles1, particles2, g) => {
    for (i = 0; i < particles1.length; i++) {  // for every particle
        fx = 0
        fy = 0
        for (j = 0; j < particles2.length; j++) {  // check against every other particle
            a = particles1[i]                       // particle a
            b = particles2[j]                       // particle b

            dx = a.x - b.x
            dy = a.y - b.y

            d = Math.sqrt(dx * dx + dy * dy)

            if (d > 0 && d < 80) {
                F = g * 1 / d
                fx += (F * dx)
                fy += (F * dy)
            }
        }
        a.vx = (a.vx + fx) * 0.5
        a.vy = (a.vy + fy) * 0.5

        a.x += a.vx
        a.y += a.vy

        if (a.x <= 0 || a.x >= canvasWidth) { a.vx *= -1 }
        if (a.y <= 0 || a.y >= canvasHeight) { a.vy *= -1 }
    }
}

mouseRule = (particles, mouseX, mouseY, g) => {
    for (i = 0; i < particles.length; i++) {  // for every particle
        fx = 0
        fy = 0

        a = particles[i]                       // particle a

        dx = a.x - mouseX
        dy = a.y - mouseY

        d = Math.sqrt(dx * dx + dy * dy)

        if (d > 0 && d < 80) {
            F = g * 1 / d
            fx += (F * dx)
            fy += (F * dy)
        }

        a.vx = (a.vx + fx) * 0.5
        a.vy = (a.vy + fy) * 0.5

        a.x += a.vx
        a.y += a.vy

        if (a.x <= 0 || a.x >= canvasWidth) { a.vx *= -1 }
        if (a.y <= 0 || a.y >= canvasHeight) { a.vy *= -1 }
    }
}

colors = []

colors.push(yellow = create(300, "yellow"))
colors.push(red = create(300, "red"))
colors.push(blue = create(300, "blue"))
colors.push(green = create(300, "green"))



axioms = [];


for (i = 0; i < colors.length; i++) {
    for (j = 0; j < colors.length; j++) {
        const axiom = {
            color1: colors[i],
            color2: colors[j],
            force: (Math.random() - 0.5) * 3,
        };

        //console.log('made rulepair:', axiom.color1[0].color, axiom.color2[0].color, axiom.force)

        axioms.push(axiom);
    }

}

//handling the cursor rule
var mouseDown = 0;
document.body.onmousedown = function () {
    ++mouseDown;
}
document.body.onmouseup = function () {
    --mouseDown;
}

let mouseX;
let mouseY;

document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX; // X-coordinate of the mouse cursor
    mouseY = event.clientY; // Y-coordinate of the mouse cursor
});

update = () => {

    for (let i = 0; i < axioms.length; i++) {
        rule(axioms[i].color1, axioms[i].color2, axioms[i].force)
    }


    if (mouseDown) {

        mouseRule(yellow, mouseX, mouseY, -50)
        mouseRule(red, mouseX, mouseY, -50)
        mouseRule(blue, mouseX, mouseY, -50)
        mouseRule(green, mouseX, mouseY, -50)

        

    }


    m.clearRect(0, 0, canvasHeight, canvasWidth) // clears the canvas?
    //draw(0, 0, "black", canvasHeight)  // draws a black background
    m.fillStyle = "black"
    m.fillRect(0, 0, canvasWidth, canvasHeight)

    for (i = 0; i < particles.length; i++) {
        draw(particles[i].x, particles[i].y, particles[i].color, 5)
    }
    requestAnimationFrame(update)
}

update();