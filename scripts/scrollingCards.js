document.addEventListener('DOMContentLoaded', () => {
    const cardBlock = document.getElementById('card-block');
    const cardContainer = document.querySelector('.card-container');
    const cards = document.querySelectorAll('.card');
    let cardIndex = 0;
    let inCardBlock = false;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY >= cardBlock.offsetTop && window.scrollY < cardBlock.offsetTop + cardBlock.offsetHeight) {
            if (!inCardBlock) {
                inCardBlock = true;
                document.body.style.overflow = 'hidden';
            }
            handleCardScroll();
        } else {
            if (inCardBlock) {
                inCardBlock = false;
                document.body.style.overflow = 'auto';
            }
        }
    });

    const handleCardScroll = () => {
        if (inCardBlock) {
            const scrollAmount = window.scrollY - cardBlock.offsetTop;
            const cardHeight = cards[0].offsetHeight + 40; // card height + margin
            cardIndex = Math.min(cards.length - 1, Math.floor(scrollAmount / cardHeight));
            updateCards();
        }
    };

    const updateCards = () => {
        cards.forEach((card, index) => {
            if (index <= cardIndex) {
                card.style.transform = `rotateY(${(index - cardIndex) * 90}deg) translateZ(${(index - cardIndex) * 200}px)`;
            } else {
                card.style.transform = `rotateY(0deg) translateZ(${index * 200}px)`;
            }
        });
        cardContainer.style.transform = `translateY(-${cardIndex * (cards[0].offsetHeight + 40)}px)`;
    };
});