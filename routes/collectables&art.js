const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("c&a");
});

module.exports = router;