// =======================================================
// THREE.JS: ФОН + ЦЕНТРАЛЬНЫЙ КУБ
// =======================================================

let scene, camera, renderer, starGeo, stars;
let digitalCube;

const container = document.getElementById('three-container');

function initStars() {
    if (!container || !window.WebGLRenderingContext) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0d1117, 0.001);

    camera = new THREE.PerspectiveCamera(60, width / height, 1, 2000);
    camera.position.set(0, 0, 100);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 2));

    // ⭐ ЗВЁЗДЫ
    starGeo = new THREE.BufferGeometry();
    const count = 6000;
    const pos = [];

    for (let i = 0; i < count; i++) {
        pos.push(
            Math.random() * 800 - 400,
            Math.random() * 800 - 400,
            Math.random() * 800 - 400
        );
    }

    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    stars = new THREE.Points(
        starGeo,
        new THREE.PointsMaterial({ color: 0xffffff, size: 0.8 })
    );
    scene.add(stars);

    // 🧊 ЦЕНТРАЛЬНЫЙ КУБ
    digitalCube = new THREE.Mesh(
        new THREE.BoxGeometry(40, 40, 40), 
        new THREE.MeshBasicMaterial({
            color: 0x58a6ff,
            wireframe: true,
            transparent: true,
            opacity: 0.6
        })
    );
    digitalCube.position.set(0, 0, 0);
    scene.add(digitalCube);

    window.addEventListener('resize', onResize);

    animate();
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// =======================================================
// SMOOTH SCROLL + BLUR ПРИ СКРОЛЛЕ
// =======================================================

document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopImmediatePropagation();

        const targetSelector = btn.dataset.scroll;
        const target = document.querySelector(targetSelector);
        if (!target) return;

        const startY = window.pageYOffset;
        const targetY = target.getBoundingClientRect().top + startY;
        const distance = targetY - startY;
        const duration = 900;
        let startTime = null;

        function easeInOutCubic(t) {
            return t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function animateScroll(currentTime) {
            if (!startTime) startTime = currentTime;
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            window.scrollTo(
                0,
                startY + distance * easeInOutCubic(progress)
            );

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        }

        requestAnimationFrame(animateScroll);
    });
});

// =======================================================
// АНИМАЦИЯ ЗВЁЗД И КУБА + SCROLL BLUR
// =======================================================

function animate() {
    requestAnimationFrame(animate);

    // движение звёзд
    const a = starGeo.attributes.position.array;
    for (let i = 1; i < a.length; i += 3) {
        a[i] -= 0.3;
        if (a[i] < -400) a[i] = 400;
    }
    starGeo.attributes.position.needsUpdate = true;

    // вращение куба
    digitalCube.rotation.x += 0.004;
    digitalCube.rotation.y += 0.006;

    // эффект blur при скролле
    const scrollY = window.scrollY;
    const blurValue = Math.min(scrollY / 120, 6); // макс blur 6px
    container.style.filter = `blur(${blurValue}px) brightness(0.75)`;

    // появление секций при скролле
    document.querySelectorAll('.section').forEach(section => {
        const rect = section.getBoundingClientRect();
        if(rect.top < window.innerHeight - 100) {
            section.classList.add('is-visible');
        }
    });

    renderer.render(scene, camera);
}

initStars();