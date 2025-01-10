// Import JavaScript functionality
import { handleSubmit } from './js/formHandler';

// Import SCSS styles
import "./styles/base.scss";
import "./styles/header.scss";
import "./styles/footer.scss";
import "./styles/form.scss";
import "./styles/results.scss";

// Attach the handleSubmit function to the form
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('urlForm');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
});
