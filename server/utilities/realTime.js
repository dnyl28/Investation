const emitEvent = (event, data = {}) => {
	console.log("emitEvent", event, data);
	masailSocket.emit(event, data);
};

module.exports = {
	emitEvent,
};
