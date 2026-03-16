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
    drawFlyer(false); // Initial silent draw
};
templateImg.onerror = () => {
    console.error('Failed to load template image. Check if public/template.jpeg exists.');
};
templateImg.src = 'template.jpeg'; // Using relative path for Vite compatibility

const fileUploadContainer = document.querySelector('.file-upload') as HTMLDivElement;

function validateForm() {
    const isNameValid = nameInput.value.trim().length > 0;
    const isTitleValid = portfolioInput.value.trim().length > 0;
    const isImageValid = userImg !== null;

    // Remove error classes on input
    if (isNameValid) nameInput.classList.remove('error');
    if (isTitleValid) portfolioInput.classList.remove('error');
    if (isImageValid) fileUploadContainer.classList.remove('error');

    return isNameValid && isTitleValid && isImageValid;
}

// Event Listeners for feedback
nameInput.addEventListener('input', () => { validateForm(); });
portfolioInput.addEventListener('input', () => { validateForm(); });

imageInput.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
        fileStatus.textContent = file.name;
        const reader = new FileReader();
        reader.onload = (event) => {
            userImg = new Image();
            userImg.onload = () => {
                console.log('User image loaded');
                validateForm();
            };
            userImg.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    }
});

function drawFlyer(isManualClick: boolean = true) {
    if (!templateImg.complete) return;

    // Always draw template first regardless of validation
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(templateImg, 0, 0);

    // Check validation
    const isValid = validateForm();
    
    if (!isValid) {
        if (isManualClick) {
            if (!nameInput.value.trim()) nameInput.classList.add('error');
            if (!portfolioInput.value.trim()) portfolioInput.classList.add('error');
            if (!userImg) fileUploadContainer.classList.add('error');
        }
        
        downloadBtn.disabled = true;
        return;
    }

    // Draw user image
    if (userImg) {
        const targetX = 318; 
        const targetY = 200;
        const targetWidth = 444; 
        const targetHeight = 450;

        ctx.save();
        ctx.beginPath();
        ctx.rect(targetX, targetY, targetWidth, targetHeight);
        ctx.clip();
        
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

    const name = nameInput.value.toUpperCase();
    const title = portfolioInput.value.toUpperCase();
    const centerX = 540;

    ctx.font = 'bold 30px "Inter", sans-serif';
    ctx.fillStyle = '#1e1b4b'; 
    ctx.textAlign = 'center';
    ctx.fillText(name, centerX, 685);

    ctx.font = '600 18px "Outfit", sans-serif';
    ctx.fillStyle = '#c41e3a'; 
    ctx.fillText(title, centerX, 710);

    downloadBtn.disabled = false;
}

generateBtn.addEventListener('click', () => drawFlyer(true));
// Always enable the generate button now
generateBtn.disabled = false;

downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = `Flyer_${nameInput.value || 'Personalized'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// Final refined layout complete.
