const express = require('express');
const axios = require('axios');

const app = express();
const port = 8008;

app.get('/numbers', async (req, res) => {
    const urls = req.query.url;

    if (!urls || !Array.isArray(urls)) {
        return res.status(400).send({ error: 'Invalid input' });
    }

    const fetchPromises = urls.map((url) =>
        axios.get(url, { timeout: 1000 }).then(response => response.data.numbers).catch(err => {
            console.error(`Failed to fetch from ${url}:`, err.message);
            return [];
        })
    );

    const results = await Promise.allSettled(fetchPromises);

    const allNumbers = results
        .filter(result => result.status === 'fulfilled')
        .flatMap(result => result.value);

    console.log('All numbers:', allNumbers);

    const uniqueNumbers = [...new Set(allNumbers)].sort((a, b) => a - b);

    res.send({ numbers: uniqueNumbers });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

