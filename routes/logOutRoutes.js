export const logout = (app) => {
    app.post('/api/logout', (req, res) => {
        res.clearCookie("accessToken");
        res.sendStatus(200).send('logged out');
    })
}