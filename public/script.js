const socket = io(); // Connect to the server

function setContactName(name) {
    const contactNameElement = document.getElementById('contactName');
    contactNameElement.textContent = name;
}

let contactName;

do {
    contactName = prompt('Please enter your contact name:');
} while (!contactName);

setContactName(contactName);

function handleSlashCommand(command) {
    const messages = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    messageInput.value = ''; // Clear the input space

    switch (command) {
        case '/clear':
            messages.innerHTML = ''; // Clear all messages
            break;
        case '/random':
            const randomNumber = Math.floor(Math.random() * 100); // Generate a random number between 0 and 99
            // Display the random number only to the user who issued the command
            const li = document.createElement('li');
            li.appendChild(document.createTextNode(`Random Number: ${randomNumber}`));
            messages.appendChild(li);
            break;
        case '/help':
            alert('Available Slash Commands:\n\n/clear - Clear all messages\n/random - Generate a random number and display it\n/help - Show this help message');
            break;
        default:
            // Handle unrecognized slash commands
            socket.emit('chat message', `Unrecognized Slash Command: ${command}`);
    }
}

const emojiMap = {
    "react": "⚛️",
    "woah": "😮",
    "hey": "👋",
    "lol": "😂",
    "like": "❤️",
    "congratulations": "🎉"
};

function replaceWordsWithEmojis(message) {
    // Split the message into words
    const words = message.split(" ");

    // Replace words with emojis based on the mapping
    const replacedWords = words.map((word) => {
        return emojiMap[word.toLowerCase()] || word;
    });

    // Join the words back into a message
    return replacedWords.join(" ");
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    if (message.trim() !== '') {
        if (message === '/clear' || message === '/random' || message === '/help') {
            const command = message.split(' ')[0]; // Extract the command part
            handleSlashCommand(command);
        } else {
            const messageWithEmojis = replaceWordsWithEmojis(message);
            socket.emit('chat message', messageWithEmojis); // Send message to the server
        }
        messageInput.value = '';
    }
}

socket.on('chat message', (message) => {
    // Get the sender's username
    const sender = message.sender;

    // Check if the message is a slash command
    if (message === '/clear') {
        handleSlashCommand(message);
    } else {
        // Create a new list item for the message
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(message));

        // Add a class to the message element based on the sender's username
        li.classList.add(`message-${sender}`);

        // Add the message to the messages list
        const messages = document.getElementById('messages');
        messages.appendChild(li);
    }
});