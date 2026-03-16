import './style.css'

const canvas = document.getElementById('flyerCanvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const nameInput = document.getElementById('userName') as HTMLInputElement;
const portfolioInput = document.getElementById('portfolioTitle') as HTMLInputElement;
const imageInput = document.getElementById('imageInput') as HTMLInputElement;
const generateBtn = document.getElementById('generateBtn') as HTMLButtonElement;
const downloadBtn = document.getElementById('downloadBtn') as HTMLButtonElement;
const fileStatus = document.getElementById('file-status') as HTMLParagraphElement;

let templateImg = new Image();
let userImg: HTMLImageElement | null = null;

// Initial template load
templateImg.onload = () => {
    console.log('Template loaded successfully:', templateImg.width, 'x', templateImg.height);
    canvas.width = templateImg.width;
    canvas.height = templateImg.height;
    drawFlyer(); // Initial draw
};
templateImg.onerror = () => {
    console.error('Failed to load template image. Check if public/template.jpeg exists.');
};
templateImg.src = 'template.jpeg'; // Using relative path for Vite compatibility

imageInput.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
        fileStatus.textContent = file.name;
        const reader = new FileReader();
        reader.onload = (event) => {
            userImg = new Image();
            userImg.src = event.target?.result as string;
            userImg.onload = () => {
                console.log('User image loaded');
            };
        };
        reader.readAsDataURL(file);
    }
});

function drawFlyer() {
    if (!templateImg.complete) return;

    // Clear and draw template
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(templateImg, 0, 0);

    // Draw user image if available
    if (userImg) {
        // Significantly adjusted coordinates based on user feedback to avoid overlaps
        const targetX = 318; 
        const targetY = 200; // Lowered significantly to clear header text
        const targetWidth = 444; 
        const targetHeight = 450; // Cropped/Reduced height to clear footer text area

        // Clip the image to fit the placeholder
        ctx.save();
        ctx.beginPath();
        ctx.rect(targetX, targetY, targetWidth, targetHeight);
        ctx.clip();
        
        // Aspect ratio cover logic
        const imgRatio = userImg.width / userImg.height;
        const targetRatio = targetWidth / targetHeight;
        let drawW, drawH, drawX, drawY;

        if (imgRatio > targetRatio) {
            drawH = targetHeight;
            drawW = userImg.width * (targetHeight / userImg.height);
            drawX = targetX - (drawW - targetWidth) / 2;
            drawY = targetY;
        } else {
            drawW = targetWidth;
            drawH = userImg.height * (targetWidth / userImg.width);
            drawX = targetX;
            drawY = targetY - (drawH - targetHeight) / 2;
        }

        ctx.drawImage(userImg, drawX, drawY, drawW, drawH);
        ctx.restore();
    }

    // Draw Text inside the white "chin" (Raised slightly to clear "I WILL BE ATTENDING")
    const name = nameInput.value.toUpperCase() || "YOUR NAME";
    const title = portfolioInput.value.toUpperCase() || "DELEGATE";

    // Center point (Template width is 1080)
    const centerX = 540;

    // Name styles (Dark for visibility on white)
    ctx.font = 'bold 30px "Inter", sans-serif';
    ctx.fillStyle = '#1e1b4b'; // Deep Navy
    ctx.textAlign = 'center';
    // Positioned higher in the white chin to avoid bottom overlap
    ctx.fillText(name, centerX, 685);

    // Portfolio styles
    ctx.font = '600 18px "Outfit", sans-serif';
    ctx.fillStyle = '#c41e3a'; // Crimson Red
    ctx.fillText(title, centerX, 710);

    downloadBtn.disabled = false;
}

generateBtn.addEventListener('click', drawFlyer);

downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `Flyer_${nameInput.value || 'Personalized'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// Final refined layout complete.
