const tr = require("googletrans").default;

async function translateText(text) {
    try {
        const res = await tr(text, { to: 'vi' });
        return res.text;
    } catch (error) {
        console.error('Error translating text:', error);
        throw error;
    }
}

module.exports = {
    translateText
};