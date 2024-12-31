````markdown
# Anbabi - Modern eBook Reader with AI and Utilities

Anbabi is a responsive eBook reader built using **React.js** and **EPUB.js**, offering state-of-the-art features like annotations, AI assistance, translation, dictionary, and Wikipedia integration. This project elevates the reading experience with modern tools and a user-friendly interface.

---

## Features

### 📖 Reading Experience

- Clean and responsive reader interface.
- Support for EPUB format with seamless navigation.
- Integrated with `react-reader` for an optimized reading experience.

### ✍️ Highlights and Annotations

- Highlight specific text or paragraphs with ease.
- Save, edit, and delete annotations.
- Prevent overlapping highlights with intelligent detection.

### 📘 Dictionary and Wikipedia Integration

- Instantly look up word definitions using the built-in dictionary.
- Explore related topics via direct integration with Wikipedia.

### 🌍 Translation

- Translate selected text into multiple languages.
- Perfect for readers exploring multilingual content.

### 🤖 AI Assistance

- Use AI to summarize chapters or selected text.
- Get context-based explanations for better comprehension.
- Generate insights or ideas based on the content.

### 🎨 Customizable Themes

- Light mode with a soft yellowish background for enhanced readability.
- Customizable highlight colors to improve text visibility without obscuring content.

### 🛠 Backend Integration

- Annotation, dictionary, and translation data persist in the database via backend APIs.
- AI models are integrated with cloud APIs for seamless responses.

---

## Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** or **yarn**

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/anbabi.git
   ```
````

2. Navigate to the project directory:
   ```bash
   cd anbabi
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## Usage

### Adding EPUB Files

Place your `.epub` files in the `/public/ebooks` directory for testing. Update the `src/pages/reader` component to load your eBook.

### Highlighting and Annotating Text

1. Select text in the reader interface.
2. Choose a highlight color or add an annotation.
3. Access saved highlights and annotations for editing or deletion.

### Using the Dictionary and Wikipedia

1. Select a word or phrase.
2. Right-click or use the context menu to access definitions or related Wikipedia articles.

### Translating Text

1. Select a sentence or paragraph.
2. Click the "Translate" option to view translations in your desired language.

### AI Assistance

1. Highlight a section of text or a chapter.
2. Use the "AI Assist" button to summarize or analyze the content.

---

## Dependencies

- **React.js**: Frontend framework.
- **EPUB.js**: eBook rendering engine.
- **react-reader**: EPUB.js wrapper for React.
- **Tailwind CSS**: Utility-first CSS framework.
- **AI API**: Integrated for summaries and explanations.
- **Translation API**: Supports multilingual translation.
- **Dictionary API**: Fetches word definitions.
- **Wikipedia API**: Retrieves related Wikipedia content.

---

## Contribution

Contributions are welcome! Please create a pull request or open an issue to discuss changes or report bugs.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [EPUB.js](https://github.com/futurepress/epub.js)
- [react-reader](https://github.com/gerhardsletten/react-reader)
- Modern eBook readers like Kindle and Google Books for inspiration.
- API providers for dictionary, translation, and AI features.

---
