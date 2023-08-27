let users = [];

//join user to chat
exports.userJoin = (id, userName, room) => {
    const user = {
        id : String(id),
        userName,
        room
    }
    users.push(user);
    return user;
}

exports.getCurrentUser = (id) => {
    return users.find(user => user.id === id);
}

//user leaves chat
exports.userLeave = (id) => {
    let user = users.filter(user => user.id === String(id));
    users = users.filter(user => user.id !== String(id));
    return user[0];
};

exports.getRoomUsers = (room) => {
    return users.filter(user => user.room === room);
};

