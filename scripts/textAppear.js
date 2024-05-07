const txt = (document.getElementsByTagName('canvas')[0]);
var coords = getCenterCoordinates(document.getElementsByTagName('canvas')[0]);

window.addEventListener('scroll', (e) => {
	const { clientX, clientY } = e
  const x = Math.round((clientX / window.innerWidth) * 100)
  const y = Math.round((clientY / window.innerHeight) * 100)


	
	var coords = getCenterCoordinates(document.getElementsByTagName('canvas')[0]);
	document.getElementsByClassName('masked-text')[0].style.maskImage = `radial-gradient(circle 400px at ${coords.x / window.innerWidth * 100}% ${coords.y  * 100}%, white, transparent)`;
})


function generateRandomCode() {
    // Примерный список строк псевдокода для демонстрации.
    const snippets = [
        `<span style="color:#569CD6;">const</span> <span style="color:#9CDCFE;">element</span> = <span style="color:#9CDCFE;">document</span>.<span style="color:#DCDCAA;">getElementById</span>(<span style="color:#CE9178;">'unique-id'</span>);
		<span style="color:#9CDCFE;">element</span>.<span style="color:#DCDCAA;">textContent</span> = <span style="color:#CE9178;">'Новый текст'</span>;`,
        `<span style="color:#569CD6;">const</span> <span style="color:#9CDCFE;">button</span> = <span style="color:#9CDCFE;">document</span>.<span style="color:#DCDCAA;">querySelector</span>(<span style="color:#CE9178;">'#my-button'</span>);
		<span style="color:#9CDCFE;">button</span>.<span style="color:#DCDCAA;">addEventListener</span>(<span style="color:#CE9178;">'click'</span>, <span style="color:#569CD6;">function</span>() {
		  <span style="color:#9CDCFE;">alert</span>(<span style="color:#CE9178;">'Кнопка нажата!'</span>);
		});`,
        `<span style="color:#569CD6;">const</span> <span style="color:#9CDCFE;">newDiv</span> = <span style="color:#9CDCFE;">document</span>.<span style="color:#DCDCAA;">createElement</span>(<span style="color:#CE9178;">'div'</span>);
		<span style="color:#9CDCFE;">newDiv</span>.<span style="color:#DCDCAA;">textContent</span> = <span style="color:#CE9178;">'Я новый div!'</span>;
		<span style="color:#9CDCFE;">document</span>.<span style="color:#DCDCAA;">body</span>.<span style="color:#DCDCAA;">appendChild</span>(<span style="color:#9CDCFE;">newDiv</span>);`,
        `<span style="color:#569CD6;">const</span> <span style="color:#9CDCFE;">styledElement</span> = <span style="color:#9CDCFE;">document</span>.<span style="color:#DCDCAA;">querySelector</span>(<span style="color:#CE9178;">'.my-element'</span>);
		<span style="color:#9CDCFE;">styledElement</span>.<span style="color:#DCDCAA;">style</span>.<span style="color:#DCDCAA;">backgroundColor</span> = <span style="color:#CE9178;">'yellow'</span>;`,
        `<span style="color:#569CD6;">async function</span> <span style="color:#9CDCFE;">fetchData</span>() {
			<span style="color:#569CD6;">try</span> {
			  <span style="color:#569CD6;">const</span> <span style="color:#9CDCFE;">response</span> = <span style="color:#569CD6;">await</span> <span style="color:#9CDCFE;">fetch</span>(<span style="color:#CE9178;">'https://api.example.com/data'</span>);
			  <span style="color:#569CD6;">if</span> (!<span style="color:#9CDCFE;">response</span>.<span style="color:#DCDCAA;">ok</span>) {
				<span style="color:#569CD6;">throw new</span> <span style="color:#9CDCFE;">Error</span>(<span style="color:#CE9178;">'Data could not be fetched!'</span>);
			  }
			  <span style="color:#569CD6;">const</span> <span style="color:#9CDCFE;">data</span> = <span style="color:#569CD6;">await</span> <span style="color:#9CDCFE;">response</span>.<span style="color:#DCDCAA;">json</span>();
			  <span style="color:#CE9178;">console</span>.<span style="color:#DCDCAA;">log</span>(<span style="color:#9CDCFE;">data</span>);
			} <span style="color:#569CD6;">catch</span> (<span style="color:#9CDCFE;">error</span>) {
			  <span style="color:#CE9178;">console</span>.<span style="color:#DCDCAA;">error</span>(<span style="color:#9CDCFE;">error</span>.<span style="color:#DCDCAA;">message</span>);
			}
		  }`
    ];

    // Генерация случайного индекса и возврат случайной строки псевдокода.
    const randomIndex = Math.floor(Math.random() * snippets.length);
    return snippets[randomIndex];
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
  }

function updateElementWithCode() {
	if (window.scroll.y < 100) return;
    const element = document.getElementsByClassName('masked-text')[0]; // Предполагается, что элемент с ID 'codeDisplay' уже существует в HTML.

    // Устанавливаем интервал генерации и размещения кода три раза в секунду.
    setInterval(() => {
        const randomCode = generateRandomCode(); // Генерация случайной строки псевдокода.
        const codeElement = document.createElement('div'); // Создание нового элемента для текста.
		codeElement.classList.add('generated-line');
		var coords = getCenterCoordinates(document.getElementsByTagName('canvas')[0]);
		codeElement.style.left = `${coords.x / window.innerWidth * 100 + 25} %`;
		codeElement.style.top = `${coords.y  * 100 +getRandomInt(-55, 55)}%`;
		codeElement.style.scale = `${Math.random()* (3 - 0.5) + 0.5}`;
        codeElement.innerHTML = randomCode; // Добавление текста в элемент.
        element.appendChild(codeElement); // Добавление элемента с текстом в целевой элемент.

        // Установка таймера для удаления созданного элемента через 300 мс.
        setTimeout(() => {
            codeElement.remove();
        }, 2900);
    }, 1000 / 20); // 1000 мс делённые на 3, чтобы функция выполнялась 3 раза в секунду.
}

// Вызов функции для запуска процесса.
updateElementWithCode();



function getCenterCoordinates(element) {
	if (!element) return {x: 0, y: 10000};
	const rect = element.getBoundingClientRect();
	const centerX = rect.left + (rect.width / 2);
	const centerY = rect.top  + (rect.height / 2);
	const blockRect = document.getElementsByClassName('masked-text')[0].getBoundingClientRect();
	// Преобразование координат в контекст страницы, если страница прокручивается
	const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	
	return { x: centerX + scrollLeft, y:(centerY - blockRect.top)/blockRect.height};
  }