import { io } from "../server";
export const noti = async (req, res) => {

    const { data } = req.body;
    io.emit('data', data);

    res.send('data received');
    
    
} 