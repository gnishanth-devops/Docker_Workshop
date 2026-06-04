app.delete('/items', async (req, res) => {
    const ids = req.body;

    for (const id of ids) {
        await db.removeItem(id);
    }

    res.sendStatus(200);
});
