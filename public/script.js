document.addEventListener('DOMContentLoaded', () => {

    const API_URL = 'http://localhost:3000';
    const SCRYFALL_API = 'https://api.scryfall.com/cards/named?fuzzy=';
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                const response = await fetch(`${API_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();
                console.log('Login Response:', data);

                if (response.ok) {
                    localStorage.setItem('token', data.token);
                    alert('Login bem-sucedido!');
                    window.location.href = 'dashboard.html';  
                } else {
                    alert('Erro no login: ' + data.message);
                }
            } catch (error) {
                console.error('Error during login:', error);
            }
        });
    }


const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;

            try {
                const response = await fetch(`${API_URL}/auth/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();
                console.log('Signup Response:', data);

                if (response.ok) {
                    alert('Cadastro realizado com sucesso!.');
                } else {
                    alert('Erro no signup: ' + data.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }




    const loadDecksButton = document.getElementById('loadDecksButton');
    const deckList = document.getElementById('deck-list');
    
    if (loadDecksButton) {
        loadDecksButton.addEventListener('click', loadDecks);
    }

    async function loadDecks() {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                alert('Token não encontrado! Por favor, faça login.');
                return;
            }

            const response = await fetch(`${API_URL}/deck/myDeck`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar decks: ' + response.statusText);
            }
        } catch (error) {
            console.error('Error fetching decks:', error);
        }
    }

    async function fetchCommanderImage(commanderName) {
        try {
            const response = await fetch(`${SCRYFALL_API}${encodeURIComponent(commanderName)}`);
            if (!response.ok) {
                throw new Error('Erro ao buscar a carta do comandante: ' + response.statusText);
            }

            const cardData = await response.json();
            const cardImage = cardData.image_uris?.normal;

            if (cardImage) {
                displayCommanderImage(cardImage); 
            }
        } catch (error) {
            console.error('Erro ao buscar a imagem do comandante:', error);
        }
    }

    function displayCommanderImage(imageUrl) {
        const existingImg = document.getElementById('commander-image');
        
        if (existingImg) {
            existingImg.src = imageUrl;  
        } else {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = 'Umbris, Fear Manifest';
            img.id = 'commander-image';
            img.style.width = '150px'; 
            img.style.display = 'block';
            img.style.margin = '20px auto'; 

            document.body.insertBefore(img, document.body.firstChild); 
        }
    }

    async function deleteDeck(deckId) {
        const confirmDelete = confirm("Tem certeza que deseja excluir este deck?");
        
        if (!confirmDelete) return;
      
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/deck/deleteDeck/${deckId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error('Erro ao excluir o deck: ' + errorData.message);
            }

            alert('Deck excluído com sucesso!');
            loadDecks(); 
        } catch (error) {
            console.error('Erro ao excluir o deck:', error);
            alert('Ocorreu um erro ao excluir o deck.');
        }
    }

    const createDeckForm = document.getElementById('createDeckForm');
    if (createDeckForm) {
        createDeckForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const commanderName = document.getElementById('commanderName').value;
            const deckName = document.getElementById('deckName').value;

            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert('Token não encontrado! Por favor, faça login.');
                    return;
                }

                const response = await fetch(`${API_URL}/decks/createDeckWithCommander?commanderName=${encodeURIComponent(commanderName)}&deckName=${encodeURIComponent(deckName)}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error('Erro ao criar o deck: ' + errorData.message);
                }

                const newDeck = await response.json();
                alert('Deck criado com sucesso!');
                console.log('Deck criado:', newDeck);

                loadDecks();

            } catch (error) {
                console.error('Erro ao criar o deck:', error);
                alert(error.message);
            }
        });
    }
});
