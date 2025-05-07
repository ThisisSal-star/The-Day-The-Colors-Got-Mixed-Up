document.addEventListener('DOMContentLoaded', function() {
    // Book navigation elements
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const bookContainer = document.getElementById('book-container');
    const frontCover = document.getElementById('front-cover');
    const backCover = document.getElementById('back-cover');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    
    // Game elements
    const gameContainer = document.getElementById('game-container');
    const closeGameBtn = document.getElementById('close-game');
    const playGameBtn = document.getElementById('play-game-btn');
    const resetColorsBtn = document.getElementById('reset-colors');
    const mixingBowl = document.getElementById('mixing-bowl');
    const mixedColor = document.getElementById('mixed-color');
    const colorOptions = document.querySelectorAll('.color-option');
    
    // Coloring pages elements
    const coloringPages = document.getElementById('coloring-pages');
    const coloringPagesBtn = document.getElementById('coloring-pages-btn');
    const closeColoringBtn = document.getElementById('close-coloring');
    
    // Narration elements
    const narrationBtn = document.getElementById('narration-btn');
    const narrationAudio = document.getElementById('narration-audio');
    
    // Sound effects elements
    const pageTurnSound = document.getElementById('page-turn-sound');
    const colorMixSound = document.getElementById('color-mix-sound');
    const toggleSoundBtn = document.getElementById('toggle-sound-btn');
    let soundEnabled = true;
    
    // Features menu elements
    const featuresBtn = document.getElementById('features-btn');
    const featuresDropdown = document.getElementById('features-dropdown');
    
    // Page narration texts
    const pageNarrations = [
        "In the happy town of Colorville, everything was bright and beautiful. The houses were all shades of colors, the trees were green, and the flowers bloomed in every color of the rainbow!",
        "The children of Colorville loved to play outside. They would run through the fields, climb trees, and paint pictures with all the colors they could find.",
        "But one sunny morning, a little paintbrush named Benny woke up feeling very mischievous. What if I mixed up all the colors? he thought with a giggle.",
        "Benny dipped himself into the pots of paint and swirled them together. Red mixed with blue, yellow mixed with green, and soon, a big, colorful mess was made!",
        "Suddenly, the sky turned purple, the grass became orange, and the houses changed to all sorts of strange colors! The children gasped in surprise.",
        "What happened to our colors? cried Lily, a little girl with bright blue shoes. Everything looks so strange! The children looked around, puzzled.",
        "Benny watched from behind a tree, giggling at the colorful chaos he had created. This is so funny! he thought. But soon, he noticed the children were sad.",
        "I miss the way things used to be, said Max, a boy with a red cap. I want the blue sky and green grass back! The children nodded in agreement.",
        "Benny felt a little guilty. He didn't want to make the children sad. Maybe I should help them get their colors back, he said to himself.",
        "So, Benny gathered all the colors he had mixed up. Let's fix this! he declared. He dipped himself into each color, one by one.",
        "With a swish and a swirl, Benny painted the sky back to blue, the grass back to green, and the flowers back to their bright, cheerful colors.",
        "The children watched in awe as their colorful world returned to normal. Look! It's beautiful again! shouted Lily, clapping her hands.",
        "Benny smiled, feeling proud. I'm sorry for mixing up the colors. I just wanted to have some fun! he said. The children giggled and forgave him.",
        "From that day on, Benny and the children worked together to create beautiful art. They learned that mixing colors could be fun, but it was even better to appreciate the colors they had!",
        "And so, Colorville was bright and beautiful once more, filled with laughter, friendship, and the joy of colors—just the way it was meant to be!"
    ];
    
    let currentPage = 1;
    const totalPages = 15;
    let narrationPlaying = false;
    let speechSynthesis = window.speechSynthesis;
    
    // Start the book
    startButton.addEventListener('click', function() {
        frontCover.style.display = 'none';
        bookContainer.style.display = 'block';
        if (soundEnabled) pageTurnSound.play();
    });
    
    // Restart the book
    restartButton.addEventListener('click', function() {
        backCover.style.display = 'none';
        frontCover.style.display = 'flex';
        currentPage = 1;
        updatePage();
        if (soundEnabled) pageTurnSound.play();
    });
    
    // Navigation
    nextButton.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            updatePage();
            if (soundEnabled) pageTurnSound.play();
        } else {
            bookContainer.style.display = 'none';
            backCover.style.display = 'flex';
            if (soundEnabled) pageTurnSound.play();
        }
    });
    
    prevButton.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updatePage();
            if (soundEnabled) pageTurnSound.play();
        }
    });
    
    function updatePage() {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
        });
        
        // Show current page
        document.getElementById(`page${currentPage}`).style.display = 'flex';
        
        // Update button states
        prevButton.disabled = currentPage === 1;
        nextButton.textContent = currentPage === totalPages ? 'The End' : 'Next';
        
        // Stop any ongoing narration
        if (narrationPlaying) {
            speechSynthesis.cancel();
            narrationPlaying = false;
            narrationBtn.textContent = '🔊';
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (bookContainer.style.display === 'block') {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                nextButton.click();
            } else if (e.key === 'ArrowLeft') {
                prevButton.click();
            }
        }
    });
    
    // Color Mixing Game
    playGameBtn.addEventListener('click', function() {
        gameContainer.style.display = 'flex';
        featuresDropdown.style.display = 'none';
        if (soundEnabled) colorMixSound.play();
    });
    
    closeGameBtn.addEventListener('click', function() {
        gameContainer.style.display = 'none';
        if (soundEnabled) colorMixSound.play();
    });
    
    resetColorsBtn.addEventListener('click', function() {
        mixedColor.style.backgroundColor = '#f0f0f0';
        mixedColor.textContent = 'Mix colors here!';
        mixedColor.style.color = 'black';
        if (soundEnabled) colorMixSound.play();
    });
    
    // Make color options draggable
    colorOptions.forEach(option => {
        option.setAttribute('draggable', 'true');
        
        option.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.getAttribute('data-color'));
        });
    });
    
    // Make mixing bowl a drop target
    mixingBowl.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    mixingBowl.addEventListener('drop', function(e) {
        e.preventDefault();
        const color = e.dataTransfer.getData('text/plain');
        mixColor(color);
        if (soundEnabled) colorMixSound.play();
    });
    
    // Color mixing logic
    function mixColor(newColor) {
        const currentColor = mixedColor.style.backgroundColor;
        
        if (currentColor === '' || currentColor === 'rgb(240, 240, 240)') {
            // Bowl is empty, just add the color
            applyColor(newColor);
        } else {
            // Mix with existing color
            const mixed = mixColors(currentColor, newColor);
            applyMixedColor(mixed);
        }
    }
    
    function applyColor(color) {
        switch(color) {
            case 'red':
                mixedColor.style.backgroundColor = 'var(--red)';
                mixedColor.textContent = 'Red';
                break;
            case 'blue':
                mixedColor.style.backgroundColor = 'var(--blue)';
                mixedColor.textContent = 'Blue';
                break;
            case 'yellow':
                mixedColor.style.backgroundColor = 'var(--yellow)';
                mixedColor.textContent = 'Yellow';
                break;
            case 'green':
                mixedColor.style.backgroundColor = 'var(--green)';
                mixedColor.textContent = 'Green';
                break;
            case 'purple':
                mixedColor.style.backgroundColor = 'var(--purple)';
                mixedColor.textContent = 'Purple';
                break;
            case 'orange':
                mixedColor.style.backgroundColor = 'var(--orange)';
                mixedColor.textContent = 'Orange';
                break;
        }
        mixedColor.style.color = 'white';
    }
    
    function mixColors(current, newColor) {
        // This is a simplified color mixing logic
        // In a real app, you'd want more sophisticated color mixing
        const colorCombinations = {
            'red+blue': { color: 'purple', bg: 'var(--purple)', name: 'Purple' },
            'blue+yellow': { color: 'green', bg: 'var(--green)', name: 'Green' },
            'red+yellow': { color: 'orange', bg: 'var(--orange)', name: 'Orange' },
            // Add more combinations as needed
        };
        
        // Get the current color name
        let currentName = '';
        if (current.includes('var(--red)')) currentName = 'red';
        else if (current.includes('var(--blue)')) currentName = 'blue';
        else if (current.includes('var(--yellow)')) currentName = 'yellow';
        else if (current.includes('var(--green)')) currentName = 'green';
        else if (current.includes('var(--purple)')) currentName = 'purple';
        else if (current.includes('var(--orange)')) currentName = 'orange';
        
        const combination1 = `${currentName}+${newColor}`;
        const combination2 = `${newColor}+${currentName}`;
        
        if (colorCombinations[combination1]) {
            return colorCombinations[combination1];
        } else if (colorCombinations[combination2]) {
            return colorCombinations[combination2];
        } else {
            // Default to the new color if no special mix
            return { color: newColor, bg: `var(--${newColor})`, name: newColor.charAt(0).toUpperCase() + newColor.slice(1) };
        }
    }
    
    function applyMixedColor(mixed) {
        mixedColor.style.backgroundColor = mixed.bg;
        mixedColor.textContent = mixed.name;
        mixedColor.style.color = 'white';
    }
    
    // Coloring Pages
    coloringPagesBtn.addEventListener('click', function() {
        coloringPages.style.display = 'block';
        featuresDropdown.style.display = 'none';
    });
    
    closeColoringBtn.addEventListener('click', function() {
        coloringPages.style.display = 'none';
    });
    
    function printColoringPage(btn) {
        const coloringPage = btn.parentElement;
        const printWindow = window.open('', '', 'width=800,height=600');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Coloring Page</title>
                    <style>
                        body { text-align: center; font-family: Arial; }
                        img { max-width: 100%; height: auto; margin: 20px 0; }
                        h1 { color: #5f27cd; }
                    </style>
                </head>
                <body>
                    <h1>${coloringPage.querySelector('h3').textContent}</h1>
                    <img src="${coloringPage.querySelector('img').src}" alt="Coloring Page">
                    <p>Have fun coloring!</p>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }
    
    // Narration
    narrationBtn.addEventListener('click', function() {
        if (narrationPlaying) {
            speechSynthesis.cancel();
            narrationPlaying = false;
            this.textContent = '🔊';
        } else {
            if (bookContainer.style.display === 'block') {
                readCurrentPage();
            } else if (frontCover.style.display === 'flex') {
                readText("Welcome to The Day the Colors Got Mixed Up! Press Start Reading to begin.");
            } else if (backCover.style.display === 'flex') {
                readText("The End. Thank you for reading The Day the Colors Got Mixed Up!");
            }
        }
    });
    
    function readCurrentPage() {
        if (currentPage >= 1 && currentPage <= totalPages) {
            readText(pageNarrations[currentPage - 1]);
            narrationPlaying = true;
            narrationBtn.textContent = '⏹️';
        }
    }
    
    function readText(text) {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = speechSynthesis.getVoices().find(voice => voice.name.includes('Google US English'));
        utterance.rate = 0.9;
        utterance.pitch = 1;
        
        utterance.onend = function() {
            narrationPlaying = false;
            narrationBtn.textContent = '🔊';
        };
        
        speechSynthesis.speak(utterance);
    }
    
    // Sound effects toggle
    toggleSoundBtn.addEventListener('click', function() {
        soundEnabled = !soundEnabled;
        featuresDropdown.style.display = 'none';
        if (soundEnabled) {
            this.textContent = '🔊 Sound On';
            pageTurnSound.play();
        } else {
            this.textContent = '🔇 Sound Off';
        }
    });
    
    // Features menu toggle
    featuresBtn.addEventListener('click', function() {
        featuresDropdown.style.display = featuresDropdown.style.display === 'block' ? 'none' : 'block';
    });
    
    
});