// Variáveis para controlar a posição dos olhos
let eyeDistance = 0;
let eyeAngle = 0;

// Função de setup do p5.js
function setup() {
    // Cria o canvas responsivo
    let container = document.getElementById('sketch-container');
    let containerWidth = container.offsetWidth;
    let canvasSize = Math.min(containerWidth - 40, 600);
    
    let canvas = createCanvas(canvasSize, canvasSize);
    canvas.parent('sketch-container');
}

// Função draw - executada continuamente
function draw() {
    // Fundo com gradiente
    background(245, 240, 235);
    
    // Desenha a pintura
    drawMonalisa();
    
    // Calcula a posição do mouse relativa ao centro do canvas
    updateEyePosition();
}

// Função para desenhar a Monalisa
function drawMonalisa() {
    push();
    
    let centerX = width / 2;
    let centerY = height / 2;
    let faceRadius = 120;
    
    // Fundo da paisagem (pintura dentro do círculo)
    fill(100, 150, 120, 80);
    noStroke();
    ellipse(centerX, centerY - 20, faceRadius * 2.5, faceRadius * 2);
    
    // Rosto (círculo principal)
    fill(230, 200, 170);
    stroke(180, 150, 120);
    strokeWeight(3);
    ellipse(centerX, centerY, faceRadius * 2, faceRadius * 2.2);
    
    // Cabelo (arcos)
    fill(80, 50, 30);
    noStroke();
    arc(centerX, centerY - 80, faceRadius * 1.8, faceRadius * 1.5, PI, TWO_PI);
    
    // Cabelo lateral esquerdo
    ellipse(centerX - faceRadius - 20, centerY - 20, faceRadius * 0.6, faceRadius * 1.5);
    
    // Cabelo lateral direito
    ellipse(centerX + faceRadius + 20, centerY - 20, faceRadius * 0.6, faceRadius * 1.5);
    
    // Pescoço
    fill(230, 200, 170);
    stroke(180, 150, 120);
    strokeWeight(2);
    rect(centerX - 30, centerY + 90, 60, 60);
    
    // --- OLHOS ---
    
    // Olho esquerdo
    drawEye(centerX - faceRadius * 0.35, centerY - faceRadius * 0.2, true);
    
    // Olho direito
    drawEye(centerX + faceRadius * 0.35, centerY - faceRadius * 0.2, false);
    
    // --- SOBRANCELHAS ---
    stroke(80, 50, 30);
    strokeWeight(4);
    noFill();
    
    // Sobrancelha esquerda
    arc(centerX - faceRadius * 0.35, centerY - faceRadius * 0.45, 50, 25, PI, 0);
    
    // Sobrancelha direita
    arc(centerX + faceRadius * 0.35, centerY - faceRadius * 0.45, 50, 25, PI, 0);
    
    // --- NARIZ ---
    stroke(180, 150, 120);
    strokeWeight(2);
    noFill();
    line(centerX, centerY - 10, centerX, centerY + 40);
    
    // Narinas
    noStroke();
    fill(150, 120, 100);
    ellipse(centerX - 8, centerY + 35, 6, 5);
    ellipse(centerX + 8, centerY + 35, 6, 5);
    
    // --- BOCA (Sorriso Enigmático) ---
    stroke(200, 100, 100);
    strokeWeight(3);
    noFill();
    
    // Sorriso usando arc
    arc(centerX, centerY + 50, 80, 40, 0, PI, CHORD);
    
    // --- MÃOS/BRAÇOS MINIMALISTAS ---
    stroke(230, 200, 170);
    strokeWeight(8);
    noFill();
    
    // Braço esquerdo
    bezier(
        centerX - faceRadius - 20, centerY + 80,
        centerX - faceRadius - 60, centerY + 100,
        centerX - faceRadius - 80, centerY + 120,
        centerX - faceRadius - 60, centerY + 140
    );
    
    // Braço direito
    bezier(
        centerX + faceRadius + 20, centerY + 80,
        centerX + faceRadius + 60, centerY + 100,
        centerX + faceRadius + 80, centerY + 120,
        centerX + faceRadius + 60, centerY + 140
    );
    
    pop();
}

// Função para desenhar um olho com íris que segue o mouse
function drawEye(eyeX, eyeY, isLeftEye) {
    push();
    
    // Branco do olho
    fill(255);
    stroke(0);
    strokeWeight(2);
    ellipse(eyeX, eyeY, 40, 50);
    
    // Cálculo da posição da íris baseado no mouse
    let mouseVectorX = mouseX - eyeX;
    let mouseVectorY = mouseY - eyeY;
    let distance = sqrt(mouseVectorX * mouseVectorX + mouseVectorY * mouseVectorY);
    
    // Limita a distância para que a íris não ultrapasse o branco do olho
    let maxDistance = 15;
    if (distance > maxDistance) {
        mouseVectorX = (mouseVectorX / distance) * maxDistance;
        mouseVectorY = (mouseVectorY / distance) * maxDistance;
    }
    
    // Posição da íris
    let irisX = eyeX + mouseVectorX;
    let irisY = eyeY + mouseVectorY;
    
    // Íris (cor azul-esverdeada, inspirada no sorriso enigmático)
    fill(70, 140, 180);
    noStroke();
    ellipse(irisX, irisY, 25, 32);
    
    // Pupila
    fill(20);
    ellipse(irisX, irisY, 12, 15);
    
    // Reflexo (brilho no olho)
    fill(255);
    ellipse(irisX - 3, irisY - 5, 6, 8);
    
    pop();
}

// Função para atualizar a posição dos olhos
function updateEyePosition() {
    // Calcula o ângulo e a distância do mouse em relação ao centro
    let centerX = width / 2;
    let centerY = height / 2;
    
    let dx = mouseX - centerX;
    let dy = mouseY - centerY;
    
    eyeDistance = sqrt(dx * dx + dy * dy);
    eyeAngle = atan2(dy, dx);
}

// Redimensiona o canvas quando a janela é redimensionada
function windowResized() {
    let container = document.getElementById('sketch-container');
    if (container && windowWidth > 0) {
        let containerWidth = container.offsetWidth;
        let canvasSize = Math.min(containerWidth - 40, 600);
        resizeCanvas(canvasSize, canvasSize);
    }
}

// Função chamada quando o mouse sai da área do canvas
function mouseExited() {
    // Os olhos continuarão acompanhando normalmente
}
